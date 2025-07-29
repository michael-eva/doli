import { CheckBusinessStatus, GetGigs, GetAllGigs } from "@/db/query"
import { useUser } from "@supabase/auth-helpers-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useSuperAdmin } from "@/context/use-super-admin"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Edit3 } from "lucide-react"
import { cancelGig, reinstateGig } from "@/db/mutations"
import { toast } from "react-hot-toast"
import { useState } from "react"

interface Gig {
  id: string
  name: string
  event_date: string
  event_time: string
  ticket_type: string
  ticket_price: number | null
  status?: string
  artists: { name: string, type: string, genre: string, music_type: string, image_url?: string }
  posts: {
    name: string
    locations: Array<{
      suburb: string
      state: string
      postcode: string
    }>
  }
  created_by: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }
  return date.toLocaleDateString('en-AU', options)
}

function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'pm' : 'am'
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${displayHour}:${minutes}${ampm}`
}

function GigCard({ gig }: { gig: Gig }) {
  const user = useUser()
  const navigate = useNavigate()
  const { isJod } = useSuperAdmin()
  const queryClient = useQueryClient()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  const formattedTime = formatTime(gig.event_time)
  const location = gig.posts.locations[0]
  const locationString = `${location.suburb}, ${location.state} ${location.postcode}`
  const ticketInfo = gig.ticket_type === 'free' ? 'Free Entry' : 'Ticketed Event'
  const artistImage = gig.artists.image_url
  const artistInitial = gig.artists.name.charAt(0).toUpperCase()
  const isCancelled = gig.status === 'cancelled'

  const canEditGigs = isJod || user?.id === gig.created_by

  const handleEditGig = () => {
    setIsPopoverOpen(false)
    navigate(`/add-gigs?edit=${gig.id}`, {
      state: {
        gigData: gig,
        isEditing: true
      }
    })
  }

  const cancelGigMutation = useMutation({
    mutationFn: () => cancelGig(gig.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] })
      toast.success("Gig cancelled successfully")
      setIsCancelDialogOpen(false)
      setIsPopoverOpen(false)
    },
    onError: () => {
      toast.error("Failed to cancel gig")
    }
  })

  const reinstateGigMutation = useMutation({
    mutationFn: () => reinstateGig(gig.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] })
      toast.success("Gig reinstated successfully")
      setIsPopoverOpen(false)
    },
    onError: () => {
      toast.error("Failed to reinstate gig")
    }
  })

  const handleCancelGig = () => {
    cancelGigMutation.mutate()
  }

  const handleReinstateGig = () => {
    reinstateGigMutation.mutate()
  }

  return (
    <div className={`flex flex-col md:flex-row items-center md:items-start bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 hover:shadow-lg transition-shadow relative overflow-hidden ${isCancelled ? 'opacity-75' : ''}`}>
      {/* Settings menu for authorized users */}
      {canEditGigs && (
        <div className="absolute top-2 right-2 z-10">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/90 hover:bg-white text-gray-700 border-gray-300 hover:border-gray-400 p-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <div className="space-y-1">
                <Button
                  onClick={handleEditGig}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  size="sm"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {!isCancelled ? (
                  <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                        size="sm"
                      >
                        Cancel Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Event</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to cancel this event? This action will hide the event from the public gig guide.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsCancelDialogOpen(false)}
                        >
                          Keep Event
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleCancelGig}
                          disabled={cancelGigMutation.isPending}
                        >
                          {cancelGigMutation.isPending ? "Cancelling..." : "Cancel Event"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button
                    onClick={handleReinstateGig}
                    variant="ghost"
                    className="w-full justify-start text-left text-green-600 hover:text-green-700 hover:bg-green-50"
                    size="sm"
                    disabled={reinstateGigMutation.isPending}
                  >
                    {reinstateGigMutation.isPending ? "Reinstating..." : "Reinstate Event"}
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Diagonal CANCELLED banner */}
      {isCancelled && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute bg-red-600 text-white font-bold text-lg py-4 transform -rotate-45 shadow-lg flex items-center justify-center"
            style={{
              width: '150%',
              height: '80px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-45deg)'
            }}
          >
            CANCELLED
          </div>
        </div>
      )}

      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
        {artistImage ? (
          <img
            src={artistImage}
            alt={gig.artists.name}
            className="w-32 h-32 rounded-full object-cover border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 border border-gray-200">
            {artistInitial}
          </div>
        )}
      </div>
      <div className="flex-1 pr-12 md:pr-12">
        <div className="text-lg  text-gray-900 mb-1 ">
          <span onClick={() => {
            navigate(`/gig-guide/artists?name=${gig.artists.name}`)
          }} className="underline font-bold cursor-pointer">{gig.artists.name}</span> - {gig.artists.type === "music" ? gig.artists.genre.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") + " " + gig.artists.music_type.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : gig.artists.type.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </div>
        <div className="text-gray-700 mb-1">
          {formattedTime} @ <span className="underline font-bold cursor-pointer" onClick={() => {
            navigate(`/?search=${gig.posts.name}`)
          }}>{gig.posts.name}</span>
        </div>
        <div className="text-gray-600 mb-2">
          {locationString}
        </div>
        <div className="text-sm font-medium text-blue-600">
          {ticketInfo}
        </div>
      </div>
    </div>
  )
}

export default function Gigs() {
  const navigate = useNavigate()
  const user = useUser()
  const { isJod } = useSuperAdmin()

  const { data: gigs } = useQuery({
    queryKey: ["gigs"],
    queryFn: isJod ? GetAllGigs : GetGigs,
  })
  const { data: userHasBusiness, isLoading: isBusinessLoading } = useQuery({
    queryKey: ["isBusiness"],
    queryFn: () => CheckBusinessStatus(user?.id!),
    enabled: !!user?.id
  })
  if (!gigs) {
    // Skeleton loading state
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Upcoming Gigs</h1>
          {/* <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" /> */}
        </div>
        <div className="space-y-6">
          {/* Date group skeleton */}
          <div>
            {/* <div className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
            </div> */}
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 animate-pulse relative">
                  {/* Edit button skeleton */}
                  <div className="absolute top-2 right-2 w-12 h-7 bg-gray-200 rounded animate-pulse" />

                  {/* Artist image skeleton */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex-1 space-y-2">
                    {/* Artist name and type */}
                    <div className="space-y-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>

                    {/* Time and venue */}
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />

                    {/* Location */}
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />

                    {/* Ticket info */}
                    <div className="h-4 bg-blue-100 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Second date group skeleton */}
          <div>
            <div className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {[1].map((i) => (
                <div key={i} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 animate-pulse relative">
                  {/* Edit button skeleton */}
                  <div className="absolute top-2 right-2 w-12 h-7 bg-gray-200 rounded animate-pulse" />

                  {/* Artist image skeleton */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex-1 space-y-2">
                    {/* Artist name and type */}
                    <div className="space-y-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>

                    {/* Time and venue */}
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />

                    {/* Location */}
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />

                    {/* Ticket info */}
                    <div className="h-4 bg-blue-100 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if there are no gigs
  if (gigs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Gigs</h1>
        <div className="text-center py-16 px-8">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Main message */}
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            No gigs on the calendar right now!
          </h3>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            Why not <a
              href="/gig-guide/artists"
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors underline decoration-blue-300 hover:decoration-blue-500"
            >
              explore our artists
            </a> and discover your next favourite act?
          </p>

          {/* Call to action */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/gig-guide/artists')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Artists
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
          </div>

          {/* Bottom message */}
          <p className="text-gray-500 text-sm mt-6">
            Check back soon for new events!
          </p>
        </div>
      </div>
    )
  }

  // Group gigs by date
  const gigsByDate = gigs.reduce((acc: Record<string, Gig[]>, gig: Gig) => {
    const dateKey = gig.event_date
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(gig)
    return acc
  }, {})

  // Sort dates and gigs within each date
  const sortedDates = Object.keys(gigsByDate).sort()
  sortedDates.forEach(date => {
    gigsByDate[date].sort((a: Gig, b: Gig) => a.event_time.localeCompare(b.event_time))
  })

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Gigs</h1>
          <p className="text-gray-600">
            Discover live performances and upcoming events
          </p>
        </div>
        {userHasBusiness && (
          <button
            onClick={() => navigate('/add-gigs')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
          >
            Create Gig
          </button>
        )}
      </div>
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date}>
            <div className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">
              {formatDate(date)}
            </div>
            <div className="space-y-2">
              {gigsByDate[date].map((gig: Gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}