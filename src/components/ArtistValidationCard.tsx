import { Button } from "./ui/button"

interface ArtistValidationCardProps {
  id: string
  name: string
  image_url: string
  type: string
  music_type?: string
  genre?: string
  about: string
  admin_one_email: string
  admin_two_email?: string
  is_verified?: boolean
  is_rejected?: boolean
  handleSubmit: (artistId: string) => void
  handleReject: (artistId: string) => void
}

export default function ArtistValidationCard({
  id,
  name,
  image_url,
  type,
  music_type,
  genre,
  about,
  admin_one_email,
  admin_two_email,
  is_verified,
  is_rejected,
  handleSubmit,
  handleReject,
}: ArtistValidationCardProps) {
  
  const getArtistSubtitle = () => {
    if (genre && music_type) {
      return `${genre.charAt(0).toUpperCase() + genre.slice(1)} ${music_type === "cover" ? "Covers" : "Originals"}`
    } else if (genre) {
      return genre.charAt(0).toUpperCase() + genre.slice(1)
    } else if (type) {
      return type.charAt(0).toUpperCase() + type.slice(1)
    }
    return "Artist"
  }

  const badgePicker = () => {
    if (is_rejected) {
      return <div className="badge badge-error badge-outline mb-2">Rejected</div>
    }
    if (is_verified) {
      return <div className="badge badge-success badge-outline mb-2">Verified</div>
    } else {
      return <div className="badge badge-warning badge-outline mb-2">Pending Verification</div>
    }
  }

  return (
    <div className="w-80 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
      {badgePicker()}
      
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
        <img
          src={image_url}
          alt="Artist Image"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/placeholder.jpeg'
          }}
        />
      </div>
      
      <div className="text-center">
        <div className="text-xl font-bold text-gray-900 mb-1">
          {name}
        </div>
        <div className="text-sm text-blue-600 mb-2 cursor-pointer underline">
          {getArtistSubtitle()}
        </div>
        
        <div className="text-gray-700 text-sm mb-4 min-h-[48px]">
          {about}
        </div>
        
        <div className="mb-4 text-xs text-gray-600">
          <p><strong>Primary:</strong> {admin_one_email}</p>
          {admin_two_email && (
            <p><strong>Secondary:</strong> {admin_two_email}</p>
          )}
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => handleReject(id)}
            variant="destructive"
            size="sm"
            className="text-xs px-4"
          >
            Reject
          </Button>
          <Button
            onClick={() => handleSubmit(id)}
            className="!bg-green-600 hover:!bg-green-700 text-white text-xs px-4"
            size="sm"
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}