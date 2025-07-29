import { GetArtists, GetGigs, GetUserBusiness, CheckBusinessStatus } from "@/db/query"
import { useUser } from "@supabase/auth-helpers-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import businessType from "@/data/businessTypes.json"
import { useEffect, useState } from "react"
import { CreateGig, updateGig } from "@/db/mutations"
import ArtistPreview from "@/components/ArtistPreview"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"

export const GigSchema = z.object({
  id: z.string().optional(), // Optional for create mode, required for edit mode
  businessName: z.string().min(1),
  suburb: z.string().min(1),
  type: z.number(),
  artist: z.object({
    name: z.string().min(1),
    image_url: z.string().url().optional().or(z.literal('')),
    type: z.string(),
    music_type: z.string(),
    genre: z.string(),
    about: z.string().min(1),
  }),
  date: z.string().min(1),
  time: z.string().min(1),
  ticketType: z.enum(["free", "paid"]),
  description: z.string().min(1),
})

export default function AddGigs() {
  const user = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // Get gig data from navigation state or URL parameters for edit mode
  const searchParams = new URLSearchParams(location.search)
  const editGigId = searchParams.get('edit')
  const gigDataFromState = location.state?.gigData
  const isEditingFromState = location.state?.isEditing

  // Determine if we're editing and get gig data
  const isEditing = isEditingFromState || !!editGigId


  // All hooks must be called before any conditional returns
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<z.infer<typeof GigSchema>>({
    resolver: zodResolver(GigSchema),
  })

  const { data: artists } = useQuery({
    queryKey: ["artists"],
    queryFn: () => GetArtists(),
    enabled: !!user?.id
  })

  // Fetch gig data if editing via URL parameter
  const { data: allGigs } = useQuery({
    queryKey: ["gigs"],
    queryFn: GetGigs,
    enabled: !!editGigId
  })

  // Fetch user's businesses for auto-population (only in create mode)
  const { data: userBusinesses } = useQuery({
    queryKey: ["userBusiness", user?.id],
    queryFn: () => GetUserBusiness(user?.id!),
    enabled: !!user?.id && !isEditing
  })

  // Check if user has any verified businesses
  const { data: hasVerifiedBusiness } = useQuery({
    queryKey: ["hasVerifiedBusiness", user?.id],
    queryFn: () => CheckBusinessStatus(user?.id!),
    enabled: !!user?.id
  })

  // Get gig data from state or fetched data
  const gigData = gigDataFromState || (editGigId && allGigs ? allGigs.find(gig => gig.id === editGigId) : null)


  const { mutate: createGig } = useMutation({
    mutationFn: (data: z.infer<typeof GigSchema>) => CreateGig({
      ...data,
      date: new Date(data.date),
      artist: {
        ...data.artist,
        image_url: data.artist.image_url || ''
      }
    }, user!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      toast.success("Gig created successfully");
      navigate('/gig-guide/gigs');
    },
    onError: () => {
      toast.error("Failed to create gig");
    }
  })

  const { mutate: updateGigMutation, isPending: isUpdatingGig } = useMutation({
    mutationFn: updateGig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
      toast.success("Gig updated successfully!");
      navigate('/gig-guide/gigs');
    },
    onError: (error) => {
      console.error("Error updating gig:", error);
      toast.error("Failed to update gig. Please try again.");
    }
  });

  // Handle artist selection and prefill artist data
  const [selectedArtistId, setSelectedArtistId] = useState<string>("")

  // Handle business selection for auto-population
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("")

  // Prefill form data for edit mode
  useEffect(() => {
    if (isEditing && gigData) {

      // Set gig ID for edit mode
      setValue("id", gigData.id);

      // Set business information from posts
      setValue("businessName", gigData.posts.name);
      if (gigData.posts.locations && gigData.posts.locations.length > 0) {
        setValue("suburb", gigData.posts.locations[0].suburb);
      }

      // Set artist information from artists
      setValue("artist.name", gigData.artists.name);
      setValue("artist.image_url", gigData.artists.image_url || '');
      setValue("artist.type", gigData.artists.type);
      setValue("artist.music_type", gigData.artists.music_type || '');
      setValue("artist.genre", gigData.artists.genre || '');
      setValue("artist.about", gigData.artists.about || '');

      // Set the selected artist ID for the dropdown
      setSelectedArtistId(gigData.artist_id || '');

      // Set event details from gig
      setValue("date", gigData.event_date);
      setValue("time", gigData.event_time);
      setValue("ticketType", gigData.ticket_type);
      setValue("description", gigData.description || '');

      // Set business type from posts data
      if (gigData.posts.type !== undefined) {
        const typeIndex = businessType.findIndex(type => type === gigData.posts.type);
        setValue("type", typeIndex !== -1 ? typeIndex : 0);
      } else {
        setValue("type", 0);
      }
    }
  }, [isEditing, gigData, setValue]);


  // Auto-populate business information based on user's businesses (only for create mode)
  useEffect(() => {
    if (!isEditing && userBusinesses && userBusinesses.length > 0) {
      // Filter only approved businesses for auto-population
      const approvedBusinesses = userBusinesses.filter(business => business.isVerified === true)

      // If user has only one approved business, auto-populate immediately
      if (approvedBusinesses.length === 1) {
        const business = approvedBusinesses[0]
        setSelectedBusinessId(business.postId)

        // Set business name
        if (business.name) {
          setValue("businessName", business.name)
        }

        // Set suburb from location data
        if (business.locations && business.locations.length > 0) {
          const location = business.locations[0]
          if (location.suburb) {
            setValue("suburb", location.suburb)
          }
        }

        // Set business type
        if (business.type) {
          const typeIndex = businessType.findIndex(type => type === business.type)
          if (typeIndex !== -1) {
            setValue("type", typeIndex)
          }
        }
      }
      // If user has multiple approved businesses, don't auto-populate - wait for user selection
    }
  }, [userBusinesses, setValue, isEditing])




  // Now we can have conditional returns
  if (!user) {
    return <div>Loading...</div>;
  }

  // Show registration message if user doesn't have a verified business and is not editing
  if (!isEditing && hasVerifiedBusiness === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Register Your Business First</h1>
          <p className="text-lg text-gray-600 mb-8">
            To add gigs and events, you need to have a verified business listing. 
            Register your business and wait for approval before creating gigs.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/register/business')} 
              className="bg-[#4e9da8] hover:bg-[#4e9da8]/80 text-white mr-4"
            >
              Register Business
            </Button>
            <Button 
              onClick={() => navigate('/manage-listings')} 
              variant="outline"
              className="mr-4"
            >
              View My Listings
            </Button>
            <Button 
              onClick={() => navigate('/gig-guide/gigs')} 
              variant="outline"
            >
              Browse Gigs
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && !gigData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No Gig Data</h1>
          <p className="text-lg text-gray-600 mb-8">No gig data provided for editing.</p>
          <Button onClick={() => navigate('/gig-guide/gigs')} className="bg-blue-600 hover:bg-blue-700">
            Back to Gigs
          </Button>
        </div>
      </div>
    );
  }

  const handleArtistSelection = (artistName: string) => {
    const selectedArtist = artists?.find(artist => artist.name === artistName)
    if (selectedArtist) {
      setSelectedArtistId(selectedArtist.id!)
      setValue("artist.name", selectedArtist.name)
      setValue("artist.image_url", selectedArtist.image_url)
      setValue("artist.type", selectedArtist.type)
      setValue("artist.music_type", selectedArtist.music_type || "")
      setValue("artist.genre", selectedArtist.genre || "")
      setValue("artist.about", selectedArtist.about)
    }
  }

  const handleBusinessSelection = (businessId: string) => {
    const selectedBusiness = userBusinesses?.find(business => business.postId === businessId)
    if (selectedBusiness) {
      // Only allow selection of approved businesses
      if (!selectedBusiness.isVerified) {
        return; // Don't proceed if business is not approved
      }

      setSelectedBusinessId(businessId)

      // Set business name
      if (selectedBusiness.name) {
        setValue("businessName", selectedBusiness.name)
      }

      // Set suburb from location data
      if (selectedBusiness.locations && selectedBusiness.locations.length > 0) {
        const location = selectedBusiness.locations[0]
        if (location.suburb) {
          setValue("suburb", location.suburb)
        }
      }

      // Set business type
      if (selectedBusiness.type) {
        const typeIndex = businessType.findIndex(type => type === selectedBusiness.type)
        if (typeIndex !== -1) {
          setValue("type", typeIndex)
        }
      }
    }
  }

  const selectedArtistName = watch("artist.name")
  const artistImage = watch("artist.image_url")
  const artistType = watch("artist.type")
  const musicType = watch("artist.music_type")
  const genre = watch("artist.genre")
  const about = watch("artist.about")

  const onSubmit = (data: z.infer<typeof GigSchema>) => {
    if (isEditing) {
      // Update existing gig
      if (data.id) {
        updateGigMutation({
          ...data,
          id: data.id,
          date: new Date(data.date),
          artist: {
            ...data.artist,
            image_url: data.artist.image_url || ''
          }
        });
      }
    } else {
      createGig(data);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isEditing ? "Edit Gig" : "Add a New Gig"}
          </h1>
          <p className="text-lg text-gray-600">
            {isEditing ? "Update your event details" : "Share your upcoming event with the community"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Business Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Business Information
                </h2>

                {/* Business Selection Dropdown - Show if user has multiple businesses OR has unapproved businesses */}
                {!isEditing && userBusinesses && (userBusinesses.length > 1 || userBusinesses.some(b => !b.isVerified)) && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Select Your Business *
                    </label>
                    <select
                      value={selectedBusinessId}
                      onChange={(e) => handleBusinessSelection(e.target.value)}
                      className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    >
                      <option value="">Choose a business to auto-populate details</option>
                      {userBusinesses.map((business) => {
                        const isApproved = business.isVerified === true
                        const isRejected = business.isRejected === true
                        const isPending = !isApproved && !isRejected

                        let statusText = ""
                        if (isRejected) {
                          statusText = " (Rejected)"
                        } else if (isPending) {
                          statusText = " (Pending Approval)"
                        }

                        return (
                          <option
                            key={business.postId}
                            value={business.postId}
                            disabled={!isApproved}
                            style={!isApproved ? { color: '#9CA3AF', fontStyle: 'italic' } : {}}
                          >
                            {business.name} {business.locations?.[0]?.suburb && `- ${business.locations[0].suburb}`}{statusText}
                          </option>
                        )
                      })}
                    </select>
                    {/* Show helpful text about approval status */}
                    {userBusinesses.some(b => !b.isVerified) && (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="text-yellow-600">⚠️</span> Businesses pending approval or rejected cannot be selected for gigs
                      </p>
                    )}
                    {/* Show warning if no approved businesses */}
                    {userBusinesses.every(b => !b.isVerified) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-yellow-800">
                          <span className="font-medium">No approved businesses:</span> You need at least one approved business listing to create gigs. Please wait for approval or contact support.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      {...register("businessName")}
                      placeholder="Enter business name"
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                    {errors.businessName && (
                      <p className="text-red-600 text-sm">{errors.businessName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Suburb *
                    </label>
                    <input
                      type="text"
                      {...register("suburb")}
                      placeholder="Enter suburb"
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                    {errors.suburb && (
                      <p className="text-red-600 text-sm">{errors.suburb.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Business Type *
                  </label>
                  <select
                    {...register("type", { valueAsNumber: true })}
                    className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  >
                    <option value="">Select Business Type</option>
                    {businessType.map((type, index) => (
                      <option key={type} value={index}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-600 text-sm">{errors.type.message}</p>
                  )}
                </div>
              </div>

              {/* Artist Selection */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Artist Information
                </h2>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Artist *
                  </label>
                  <select
                    {...register("artist.name")}
                    onChange={(e) => handleArtistSelection(e.target.value)}
                    className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  >
                    <option value="">Select an Artist</option>
                    {artists?.map((artist) => (
                      <option key={artist.id} value={artist.name}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                  {errors.artist?.name && (
                    <p className="text-red-600 text-sm">{errors.artist.name.message}</p>
                  )}
                </div>

                {/* Artist Preview */}
                {selectedArtistName && (
                  <ArtistPreview
                    artistId={selectedArtistId}
                    artistName={selectedArtistName || "Artist Name"}
                    artistImage={artistImage || '/images/placeholder.jpeg'}
                    artistType={artistType || ""}
                    musicType={musicType || ""}
                    genre={genre || ""}
                    about={about || "Artist description goes here. Tell us about your artist/band, your style, experience, and what makes you unique..."}
                    showFollowButton={false}
                  />
                )}
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Event Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      {...register("date")}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                    {errors.date && (
                      <p className="text-red-600 text-sm">{errors.date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Time *
                    </label>
                    <input
                      type="time"
                      {...register("time")}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    />
                    {errors.time && (
                      <p className="text-red-600 text-sm">{errors.time.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ticket Type *
                    </label>
                    <select
                      {...register("ticketType")}
                      className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    >
                      <option value="">Select Ticket Type</option>
                      <option value="free">Free Entry</option>
                      <option value="paid">Paid Entry</option>
                    </select>
                    {errors.ticketType && (
                      <p className="text-red-600 text-sm">{errors.ticketType.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Enter a description for your event"
                    className="textarea textarea-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                  />
                  {errors.description && (
                    <p className="text-red-600 text-sm">{errors.description.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    onClick={() => navigate('/gig-guide/gigs')}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn !bg-[#4e9da8] !text-white flex-1 group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                    disabled={!isValid || isUpdatingGig}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isUpdatingGig ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Updating...
                        </>
                      ) : (
                        isEditing ? "Update Gig" : "Add Gig"
                      )}
                    </span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}