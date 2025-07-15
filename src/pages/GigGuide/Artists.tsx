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
    <div className="mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {showFollows ? "Followed Artists" : "Artists"}
          </h1>
          <p className="text-gray-600">
            {showFollows
              ? "Your favorite performers"
              : "Discover amazing local talent"
            }
          </p>
        </div>
        {user && (
          <Button
            onClick={handleToggleFollows}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
          >
            {showFollows ? "Show All Artists" : "Show Followed Artists"}
          </Button>
        )}
      </div>

      {artists && artists.length === 0 ? (
        <div className="text-center py-16 px-8">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Main message */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            {showFollows
              ? (nameFilter ? `No followed artists found matching "${nameFilter}"` : "You haven't followed any artists yet")
              : (nameFilter ? `No artists found matching "${nameFilter}"` : "No artists found")
            }
          </h3>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {nameFilter ? (
              <>
                Try adjusting your search or <a
                  href="/gig-guide/artists"
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors underline decoration-blue-300 hover:decoration-blue-500"
                >
                  view all artists
                </a>
              </>
            ) : showFollows ? (
              <>
                Start following artists to see them here and stay updated with their latest gigs and news!
              </>
            ) : (
              <>
                Be the first to add an artist to our platform and help grow the local music scene!
              </>
            )}
          </p>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {nameFilter ? (
              <>
                <button
                  onClick={() => setSearchParams({})}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Search
                </button>
                <button
                  onClick={() => navigate('/gig-guide/artists')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Browse All Artists
                </button>
              </>
            ) : showFollows ? (
              <button
                onClick={() => setSearchParams({})}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Discover Artists
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/add-artist')}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Artist
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </>
            )}
          </div>

          {/* Bottom message */}
          <p className="text-gray-500 text-sm mt-6">
            {showFollows
              ? "Follow artists to get notified about their upcoming gigs!"
              : "Check back soon for new artists joining the platform!"
            }
          </p>
        </div>
      ) : (
        <div className="md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex justify-center">
          {artists?.sort((a, b) => a.name.localeCompare(b.name)).map((artist) => (
            <div key={artist.id} className="relative group">
              <div className="">
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
                  <div className="absolute top-2 right-2 transition-opacity duration-200">
                    <Button
                      onClick={() => handleEditArtist(artist)}
                      size="sm"
                      variant="outline"
                      className="bg-white/90 hover:bg-white text-gray-700 border-gray-300 hover:border-gray-400 shadow-sm"
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
