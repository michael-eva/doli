import { z } from "zod"
import { useUser } from "@supabase/auth-helpers-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Music, Mic, Palette, Upload, Send } from "lucide-react";
import ImageUpload from "../../components/ImageUpload";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function RegisterArtist() {
  const user = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const RegisterArtistSchema = z.discriminatedUnion("type", [
    z.object({
      name: z.string().min(1),
      admin_one_email: z.string().email(),
      admin_two_email: z.string().email(),
      image_url: z.string().url(),
      type: z.literal("music"),
      music_type: z.enum(["cover", "original"]),
      genre: z.enum(["alt", "classical", "country", "electronic", "folk", "heavy metal", "hip-hop", "jazz", "latin", "punk", "reggae", "r&b", "rock"]),
      about: z.string().min(1),
    }),
    z.object({
      name: z.string().min(1),
      admin_one_email: z.string().email(),
      admin_two_email: z.string().email(),
      image_url: z.string().url(),
      type: z.enum(["comedy", "other"]),
      music_type: z.enum(["cover", "original"]).optional(),
      genre: z.enum(["alt", "classical", "country", "electronic", "folk", "heavy metal", "hip-hop", "jazz", "latin", "punk", "reggae", "r&b", "rock"]).optional(),
      about: z.string().min(1),
    })
  ]);

  const getDefaultValues = () => {
    return {
      name: "",
      admin_one_email: user?.email,
      admin_two_email: "",
      image_url: "",
      type: undefined,
      music_type: undefined,
      genre: undefined,
      about: ""
    }
  }

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<z.infer<typeof RegisterArtistSchema>>({
    defaultValues: getDefaultValues()
  });

  // Set the user email once it's available
  useEffect(() => {
    if (user?.email) {
      setValue("admin_one_email", user.email);
    }
  }, [user?.email, setValue]);

  const selectedType = watch("type");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedFile(result);
        setValue("image_url", result);
        // Reset cropped image when new file is selected
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      // If no file selected, reset everything
      setSelectedFile("");
      setCroppedImage(null);
      setValue("image_url", "");
    }
  };

  const handleFormSubmit = async (data: z.infer<typeof RegisterArtistSchema>) => {
    setIsSubmitting(true);
    try {
      // Use cropped image if available, otherwise use the original
      const finalImageUrl = croppedImage || data.image_url;

      // Here you would typically send the data to your backend
      console.log("Form data:", { ...data, image_url: finalImageUrl });

      toast.success("Artist registration submitted successfully!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Register Your Artist Profile</h1>
          <p className="text-lg text-gray-600">Share your talent with the community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
              {/* Image Upload */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Artist Image
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Upload Artist Image *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full file-input file-input-bordered"
                      />
                    </div>
                  </div>

                  {selectedFile && !croppedImage && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Crop Your Image</h3>
                      <ImageUpload
                        file={selectedFile}
                        setCroppedImage={setCroppedImage}
                        circular={true}
                      />
                    </div>
                  )}

                  {/* Artist Post Preview (always visible) */}
                  <div className="flex pt-8">
                    <div className="w-80 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                        <img
                          src={croppedImage || '/images/placeholder.jpeg'}
                          alt="Artist Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900 mb-1">
                          {watch("name") || "Artist Name"}
                        </div>
                        <div className="text-sm text-blue-600 mb-2 cursor-pointer underline">
                          {selectedType === "music"
                            ? (watch("genre") && watch("music_type")
                              ? `${watch("genre")!.charAt(0).toUpperCase() + watch("genre")!.slice(1)} ${watch("music_type") === "cover" ? "Covers" : "Originals"}`
                              : "Alt / Indie Originals")
                            : selectedType === "comedy"
                              ? "Comedy"
                              : selectedType === "other"
                                ? "Other"
                                : "Alt / Indie Originals"}
                        </div>
                        <div className="text-gray-700 text-sm mb-4 min-h-[48px]">
                          {watch("about") || "Artist description goes here. Tell us about your artist/band, your style, experience, and what makes you unique..."}
                        </div>
                        {/* <button
                          type="button"
                          className="bg-[#4e9da8] hover:bg-[#3d8a94] text-white px-6 py-2 rounded-full font-medium text-sm shadow transition-all duration-200"
                          disabled
                        >
                          Follow
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {errors.image_url && (
                    <p className="text-red-600 text-sm">{errors.image_url.message}</p>
                  )}
                </div>
              </div>
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Artist/Band Name *
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="Enter artist or band name"
                      className="w-full"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Artist Type *
                    </label>
                    <Select onValueChange={(value) => setValue("type", value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select artist type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="music">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Music
                          </div>
                        </SelectItem>
                        <SelectItem value="comedy">
                          <div className="flex items-center gap-2">
                            <Mic className="w-4 h-4" />
                            Comedy
                          </div>
                        </SelectItem>
                        <SelectItem value="other">
                          <div className="flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Other
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-red-600 text-sm">{errors.type.message}</p>
                    )}
                  </div>
                </div>

                {/* Music-specific fields */}
                {selectedType === "music" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Music Type *
                      </label>
                      <Select onValueChange={(value) => setValue("music_type", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select music type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cover">Cover Songs</SelectItem>
                          <SelectItem value="original">Original Music</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.music_type && (
                        <p className="text-red-600 text-sm">{errors.music_type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Genre *
                      </label>
                      <Select onValueChange={(value) => setValue("genre", value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alt">Alternative</SelectItem>
                          <SelectItem value="classical">Classical</SelectItem>
                          <SelectItem value="country">Country</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="folk">Folk</SelectItem>
                          <SelectItem value="heavy metal">Heavy Metal</SelectItem>
                          <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="latin">Latin</SelectItem>
                          <SelectItem value="punk">Punk</SelectItem>
                          <SelectItem value="reggae">Reggae</SelectItem>
                          <SelectItem value="r&b">R&B</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.genre && (
                        <p className="text-red-600 text-sm">{errors.genre.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Primary Admin Email *
                    </label>
                    <Input
                      {...register("admin_one_email")}
                      type="email"
                      placeholder="primary@example.com"
                      className="w-full"
                    />
                    {errors.admin_one_email && (
                      <p className="text-red-600 text-sm">{errors.admin_one_email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Secondary Admin Email *
                    </label>
                    <Input
                      {...register("admin_two_email")}
                      type="email"
                      placeholder="secondary@example.com"
                      className="w-full"
                    />
                    {errors.admin_two_email && (
                      <p className="text-red-600 text-sm">{errors.admin_two_email.message}</p>
                    )}
                  </div>
                </div>
              </div>



              {/* About Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  About Your Artist
                </h2>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Artist Description *
                  </label>
                  <textarea
                    {...register("about")}
                    rows={4}
                    placeholder="Tell us about your artist/band, your style, experience, and what makes you unique..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e9da8] focus:border-transparent resize-none"
                  />
                  {errors.about && (
                    <p className="text-red-600 text-sm">{errors.about.message}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-[#4e9da8] hover:bg-[#3d8a94] text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Artist Registration
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
