import { useQuery } from "@tanstack/react-query"
import { useSearchParams, useNavigate } from "react-router-dom"
import { GetArtists, GetFollowedArtists } from "@/db/query"
import ArtistPreview from "@/components/ArtistPreview"
import { useUser } from "@supabase/auth-helpers-react"
import { Button } from "@/components/ui/button"
import { useSuperAdmin } from "@/context/use-super-admin"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { deleteArtist } from "@/db/mutations"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export default function Artists() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const nameFilter = searchParams.get("name") || ""
  const showFollows = searchParams.get("showFollows") === "true"
  const user = useUser()
  const { isJod } = useSuperAdmin()
  const queryClient = useQueryClient()

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

  // Delete artist mutation
  const deleteMutation = useMutation({
    mutationFn: (artistId: string) => deleteArtist(artistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artists", nameFilter, showFollows, user?.id] })
      toast.success("Artist deleted successfully")
    },
    onError: (error) => {
      console.error("Error deleting artist:", error)
      toast.error("Failed to delete artist. Please try again.")
    }
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

  const handleDeleteArtist = (artistId: string, artistName: string) => {
    deleteMutation.mutate(artistId)
  }

  // Check if user can edit artists (admin or isJob user)
  const canEditArtists = isJod || artists?.find(artist => artist.user_id === user?.id)

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {showFollows ? "Followed Artists" : "Artists"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {showFollows
              ? "Your favorite performers"
              : "Discover amazing local talent"
            }
          </p>
        </div>
        {user && (
          <div className="flex justify-center sm:justify-start">
            <Button
              onClick={handleToggleFollows}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors w-full sm:w-auto text-sm sm:text-base"
            >
              {showFollows ? "Show All Artists" : "Show Followed Artists"}
            </Button>
          </div>
        )}
      </div>

      {artists && artists.length === 0 ? (
        <div className="text-center py-8 sm:py-16 px-4 sm:px-8">
          {/* Icon */}
          <div className="mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          {/* Main message */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 px-4">
            {showFollows
              ? (nameFilter ? `No followed artists found matching "${nameFilter}"` : "You haven't followed any artists yet")
              : (nameFilter ? `No artists found matching "${nameFilter}"` : "No artists found")
            }
          </h3>

          {/* Subtitle */}
          <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
            {nameFilter ? (
              <>
                <button
                  onClick={() => setSearchParams({})}
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Search
                </button>
                <button
                  onClick={() => navigate('/gig-guide/artists')}
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
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
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base"
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
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add First Artist
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
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
          <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6 px-4">
            {showFollows
              ? "Follow artists to get notified about their upcoming gigs!"
              : "Check back soon for new artists joining the platform!"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {artists?.sort((a, b) => a.name.localeCompare(b.name)).map((artist) => (
            <div key={artist.id} className="relative group flex justify-center">
              <div className="w-full max-w-sm">
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
                {/* Gear icon dropdown menu for authorized users */}
                {canEditArtists && (
                  <div className="absolute top-2 right-2 transition-opacity duration-200 z-10">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 hover:bg-white text-gray-700 border-gray-300 hover:border-gray-400 shadow-sm w-8 h-8 p-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2" align="end">
                        <div className="space-y-1">
                          <button
                            onClick={() => handleEditArtist(artist)}
                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Artist</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{artist.name}"? This action cannot be undone and will remove the artist from the platform.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteArtist(artist.id!, artist.name)}
                                  className="!bg-red-600 hover:bg-red-700"
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </PopoverContent>
                    </Popover>
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
