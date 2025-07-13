interface ArtistPreviewProps {
  artistName: string
  artistImage: string
  artistType: string
  musicType: string
  genre: string
  about: string
}

export default function ArtistPreview({
  artistName,
  artistImage,
  artistType,
  musicType,
  genre,
  about
}: ArtistPreviewProps) {
  const getArtistSubtitle = () => {
    if (genre && musicType) {
      return `${genre.charAt(0).toUpperCase() + genre.slice(1)} ${musicType === "cover" ? "Covers" : "Originals"}`
    } else if (genre) {
      return genre.charAt(0).toUpperCase() + genre.slice(1)
    } else if (artistType) {
      return artistType
    }
    return "Live Music"
  }

  return (
    <div className="flex pt-8">
      <div className="w-80 bg-white rounded-2xl shadow-md px-2 py-4 flex flex-col items-center">
        <div className="w-44 h-44 rounded-full overflow-hidden mb-4">
          <img
            src={artistImage}
            alt="Artist Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/placeholder.jpeg'
            }}
          />
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900 mb-1">
            {artistName}
          </div>
          <div className="text-sm text-blue-600 mb-2">
            {getArtistSubtitle()}
          </div>
          <div className="text-gray-700 text-sm">
            {about}
          </div>
        </div>
      </div>
    </div>
  )
} 