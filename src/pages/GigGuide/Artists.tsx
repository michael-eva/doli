import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { GetArtists } from "@/db/query"
import ArtistPreview from "@/components/ArtistPreview"

export default function Artists() {
  const [searchParams] = useSearchParams()
  const nameFilter = searchParams.get("name") || ""

  const { data: artists } = useQuery({
    queryKey: ["artists", nameFilter],
    queryFn: () => GetArtists(nameFilter),
  })
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Artists
      </h1>
      {artists && artists.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {nameFilter ? `No artists found matching "${nameFilter}"` : "No artists found"}
          </div>
          {nameFilter && (
            <div className="text-gray-400">
              Try adjusting your search or <a href="/gig-guide/artists" className="text-blue-500 underline hover:text-blue-700 transition-colors">view all artists</a>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists?.sort((a, b) => a.name.localeCompare(b.name)).map((artist) => (
            <ArtistPreview
              key={artist.id}
              artistName={artist.name}
              artistImage={artist.image_url}
              artistType={artist.type}
              musicType={artist.music_type || ""}
              genre={artist.genre || ""}
              about={artist.about}
              showFollowButton={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}
