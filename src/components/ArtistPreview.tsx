import { Button } from "./ui/button"
import { useUser } from "@supabase/auth-helpers-react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { followArtist, unfollowArtist } from "@/db/mutations"
import { isFollowingArtist } from "@/db/query"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface ArtistPreviewProps {
  artistId: string
  artistName: string
  artistImage: string
  artistType: string
  musicType: string
  genre: string
  about: string
  showFollowButton?: boolean
}

export default function ArtistPreview({
  artistId,
  artistName,
  artistImage,
  artistType,
  musicType,
  genre,
  about,
  showFollowButton = false
}: ArtistPreviewProps) {
  const user = useUser()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isFollowing, setIsFollowing] = useState(false)

  // Check if user is following this artist
  const { data: followingStatus } = useQuery({
    queryKey: ["followingStatus", user?.id, artistId],
    queryFn: () => isFollowingArtist(user?.id!, artistId),
    enabled: !!user?.id && !!artistId,
  })

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: () => followArtist(user?.id!, artistId),
    onSuccess: () => {
      setIsFollowing(true)
      queryClient.invalidateQueries({ queryKey: ["followingStatus", user?.id, artistId] })
      toast.success(`Following ${artistName}`)
    },
    onError: (error) => {
      console.error("Error following artist:", error)
      toast.error("Failed to follow artist. Please try again.")
    }
  })

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: () => unfollowArtist(user?.id!, artistId),
    onSuccess: () => {
      setIsFollowing(false)
      queryClient.invalidateQueries({ queryKey: ["followingStatus", user?.id, artistId] })
      toast.success(`Unfollowed ${artistName}`)
    },
    onError: (error) => {
      console.error("Error unfollowing artist:", error)
      toast.error("Failed to unfollow artist. Please try again.")
    }
  })

  // Update local state when query data changes
  useEffect(() => {
    if (followingStatus !== undefined) {
      setIsFollowing(followingStatus)
    }
  }, [followingStatus])

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

  const handleFollowClick = () => {
    if (!user) {
      navigate('/login', {
        state: { message: "Please sign in to follow artists" }
      })
      return
    }

    if (isFollowing) {
      unfollowMutation.mutate()
    } else {
      followMutation.mutate()
    }
  }

  const isLoading = followMutation.isPending || unfollowMutation.isPending

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
          {showFollowButton && (
            <Button
              onClick={handleFollowClick}
              disabled={isLoading}
              className={`rounded-full !text-white hover:opacity-80 transition-all ${isFollowing
                ? "!bg-[#ce3f42] hover:!bg-[#ce3f42]/80"
                : "!bg-[#4e9da8] hover:!bg-[#4e9da8]/80"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isFollowing ? "Unfollowing..." : "Following..."}
                </span>
              ) : (
                isFollowing ? "Unfollow" : "Follow"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 