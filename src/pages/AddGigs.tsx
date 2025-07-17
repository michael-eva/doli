import { GetArtists, GetGigs } from "@/db/query"
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
    image_url: z.url(),
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

  // Get gig data from state or fetched data
  const gigData = gigDataFromState || (editGigId && allGigs ? allGigs.find(gig => gig.id === editGigId) : null)

  const post = gigData?.posts

  const { mutate: createGig } = useMutation({
    mutationFn: (data: z.infer<typeof GigSchema>) => CreateGig({ ...data, date: new Date(data.date) }, user!),
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


  // Prefill business information when userBusiness data is loaded (only for create mode)
  useEffect(() => {
    if (!isEditing && post && post.length > 0) {
      const business = post[0] // Get the first business record

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
  }, [post, setValue, isEditing])




  // Now we can have conditional returns
  if (!user) {
    return <div>Loading...</div>;
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
        updateGigMutation({ ...data, date: new Date(data.date) } as z.infer<typeof GigSchema> & { id: string; date: Date });
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