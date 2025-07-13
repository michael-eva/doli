import { useQuery } from "@tanstack/react-query"
import { GetArtists } from "@/db/query"
import ArtistPreview from "@/components/ArtistPreview"

export default function Artists() {
  const { data: artists } = useQuery({
    queryKey: ["artists"],
    queryFn: GetArtists,
  })
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Artists</h1>
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
    </div>
  )
}
