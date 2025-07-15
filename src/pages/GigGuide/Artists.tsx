import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useNavigate } from "react-router-dom"
import { GetArtists, GetFollowedArtists } from "@/db/query"
import ArtistPreview from "@/components/ArtistPreview"
import { useUser } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"
import { useSuperAdmin } from "@/context/use-super-admin"

export default function Artists() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const nameFilter = searchParams.get("name") || ""
  const showFollows = searchParams.get("showFollows") === "true"
  const user = useUser()
  const { isJod } = useSuperAdmin()

  const { data: artists } = useQuery({
    queryKey: ["artists", nameFilter, showFollows, user?.id],
    queryFn: () => {
      if (showFollows && user?.id) {
        return GetFollowedArtists(user.id, nameFilter)
      }
      return GetArtists(nameFilter)
    },
    enabled: !showFollows || !!user?.id
  })

  const handleToggleFollows = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (showFollows) {
      newSearchParams.delete("showFollows")
    } else {
      newSearchParams.set("showFollows", "true")
    }
    setSearchParams(newSearchParams)
  }

  const handleEditArtist = (artist: any) => {
    // Navigate to edit artist page with artist data
    navigate('/edit-artist', {
      state: {
        artistData: artist,
        isEditing: true
      }
    })
  }

  // Check if user can edit artists (admin or isJob user)
  const canEditArtists = isJod || artists?.find(artist => artist.user_id === user?.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {showFollows ? "Followed Artists" : "Artists"}
        </h1>
        {user && (
          <Button
            onClick={handleToggleFollows}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showFollows ? "Show All Artists" : "Show Followed Artists"}
          </Button>
        )}
      </div>
      {artists && artists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {showFollows
              ? (nameFilter ? `No followed artists found matching "${nameFilter}"` : "You haven't followed any artists yet")
              : (nameFilter ? `No artists found matching "${nameFilter}"` : "No artists found")
            }
          </div>
          {nameFilter && (
            <div className="text-gray-400">
              Try adjusting your search or <a href="/gig-guide/artists" className="text-blue-500 underline hover:text-blue-700 transition-colors">view all artists</a>
            </div>
          )}
          {showFollows && !nameFilter && (
            <div className="text-gray-400">
              <a href="/gig-guide/artists" className="text-blue-500 underline hover:text-blue-700 transition-colors">Discover artists to follow</a>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists?.sort((a, b) => a.name.localeCompare(b.name)).map((artist) => (
            <div key={artist.id} className="relative">
              <ArtistPreview
                artistId={artist.id!}
                artistName={artist.name}
                artistImage={artist.image_url}
                artistType={artist.type}
                musicType={artist.music_type || ""}
                genre={artist.genre || ""}
                about={artist.about}
                showFollowButton={true}
              />
              {/* Edit button for authorized users */}
              {canEditArtists && (
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={() => handleEditArtist(artist)}
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
