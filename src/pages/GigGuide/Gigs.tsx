import { CheckBusinessStatus, GetGigs } from "@/db/query"
import { useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

interface Gig {
  id: string
  name: string
  event_date: string
  event_time: string
  ticket_type: string
  ticket_price: number | null
  artists: { name: string, type: string, genre: string, music_type: string, image_url?: string }
  posts: {
    name: string
    locations: Array<{
      suburb: string
      state: string
      postcode: string
    }>
  }
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
  const navigate = useNavigate()
  const formattedTime = formatTime(gig.event_time)
  const location = gig.posts.locations[0]
  const locationString = `${location.suburb}, ${location.state} ${location.postcode}`
  const ticketInfo = gig.ticket_type === 'free' ? 'Free Entry' : 'Ticketed Event'
  const artistImage = gig.artists.image_url
  const artistInitial = gig.artists.name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex-shrink-0 mr-4">
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
      <div className="flex-1">
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
  const { data: gigs } = useQuery({
    queryKey: ["gigs"],
    queryFn: GetGigs,
  })
  const user = useUser()
  const { data: userHasBusiness, isLoading: isBusinessLoading } = useQuery({
    queryKey: ["isBusiness"],
    queryFn: () => CheckBusinessStatus(user?.id!),
    enabled: !!user?.id
  })
  if (!gigs) {
    // Skeleton loading state
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Gigs</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-3 border border-gray-200 animate-pulse">
              <div className="flex-shrink-0 mr-4">
                <div className="w-32 h-32 rounded-full bg-gray-200" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-blue-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Check if there are no gigs
  if (gigs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Gigs</h1>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No gigs on the calendar right now!</div>
          <div className="text-gray-400 mb-2">Why not <a href="/gig-guide/artists" className="text-blue-500 underline hover:text-blue-700 transition-colors">explore our artists</a> and discover your next favourite act?</div>
          <div className="text-gray-400">Check back soon for new events!</div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Gigs</h1>
        {userHasBusiness && (
          <button
            onClick={() => navigate('/add-gigs')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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