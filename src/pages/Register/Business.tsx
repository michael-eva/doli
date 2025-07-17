import { useState, useEffect } from "react"
import transformedTags from '@/data/tags.ts'
import { useUser } from "@supabase/auth-helpers-react";
import businessType from "@/data/businessTypes.json"
import { useForm } from "react-hook-form"
import supabase from "@/config/supabaseClient.ts";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import OpeningHours from "@/components/Opening-Hours/OpeningHours.tsx"
import Select from "react-select"
import { useMediaQuery } from "react-responsive"
import LocationSearch from "@/components/Location/LocationSearch.tsx";
import { CardProps, SelectedTags } from "@/Types/index.ts"
import Toggle from "@/components/Toggle/Toggle.tsx";
import ToggleButton from "@/components/Toggle/ToggleButton.tsx";
import ToggleOn from "@/components/Toggle/ToggleOn.tsx";
import SimpleModal from "@/components/Modals/SimpleModal.tsx";
import { FaInfoCircle } from "react-icons/fa";
import { determineVerificationStatus, handleErrors, countChars } from "@/components/PostForm/utils.ts";
import { uploadCoverImage, deleteImage } from "@/utils/imageUpload";
import ImageUpload from "@/components/ImageUpload.tsx";
import { PreviewCard } from "@/components/PreviewCard.tsx";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Send } from "lucide-react";


type LocationData = {
  address: string,
  postcode: string,
  suburb: string,
  state: string,
  country: string,
  coordinates: any
}
type RuleCheckbox = {
  [key: string]: boolean;
  checkbox1: boolean,
  checkbox2: boolean,
  checkbox3: boolean,
  checkbox4: boolean
}

export default function RegisterBusiness({ postData, }: CardProps) {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors }, setValue, reset, getValues } = useForm();
  const user = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<SelectedTags[]>([]);
  const [deliveryMethodError, setDeliveryMethodError] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(true)
  const [openingHoursError, setOpeningHoursError] = useState<string>("")
  const [locationError, setLocationError] = useState<boolean>(false)
  const [isAgree, setIsAgree] = useState<boolean>(true)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    coordinates: "",
    address: "",
    postcode: "",
    suburb: "",
    state: "",
    country: ""
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const handleLocationSelect = (address: string, postcode: string, suburb: string, state: string, country: string, coordinates: any) => {
    setSelectedLocation({
      coordinates: coordinates,
      address: address,
      postcode: postcode,
      suburb: suburb,
      state: state,
      country: country
    });
  };
  const [checkboxes, setCheckboxes] = useState<RuleCheckbox>({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false
  });
  const [allChecked, setAllChecked] = useState<boolean>(false);
  useEffect(() => {
    if (postData) {
      setAllChecked(true)
    }
  }, [postData])
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  const formCleanup = (shouldSetVerifiedFalse: boolean) => {
    setDeliveryMethodError(false)
    setIsSubmitting(false)
    setSelectedTags([])
    reset()
    {
      !shouldSetVerifiedFalse ?
        toast.success("Listing will be submitted for verification!")
        :
        toast.success("Listing has been submitted!")
    }
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }
  const handleTagChange = (selectedTags: any) => {
    if (selectedTags.length <= 5) {
      setSelectedTags(selectedTags);
    }
  };
  const handleFileChange = (e: any) => {
    setCroppedImage(null)
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  }
  const deleteCurrentImage = async () => {
    const currentImagePath = `${user?.id}/${postData?.postId}`;
    const result = await deleteImage('cover_images', currentImagePath);
    if (!result.success) {
      console.error('Error deleting current image:', result.error);
    }
  };

  const uploadNewImage = async (postId: string, selectedFile: Blob) => {
    const result = await uploadCoverImage(selectedFile, user?.id!, postId);

    if (!result.success) {
      console.error('Error uploading image:', result.error);
      return null;
    }

    return result.url!;
  };


  const updateImage = async (imageUrl: string) => {
    const { error: updateError } = await supabase
      .from('posts')
      .update({ imgUrl: imageUrl })
      .eq('id', user?.id)
      .eq('postId', postData?.postId);
    if (updateError) {
      console.error('Error updating imgUrl:', updateError);
    }
  };

  function handleFormErrors(formData: CardProps, selectedLocation: { selectedLocation: any; }) {
    const { isDeliveryMethod, hasOpeningHours, hasSelectedLocation } = handleErrors({ delivery: watch().delivery, dineIn: watch().dineIn, pickUp: watch().pickUp }, { openingHours: formData.openingHours }, selectedLocation)
    setDeliveryMethodError(false)
    setLocationError(false)
    setOpeningHoursError("")
    if (!isDeliveryMethod) {
      setDeliveryMethodError(true)
      return false
    }
    if (typeof hasOpeningHours === 'object' && hasOpeningHours?.hasOpenDays === false) {
      setOpeningHoursError("*No opening days have been selected.")
      return false
    }
    if (typeof hasOpeningHours === 'object' && hasOpeningHours?.validOpeningTimes === false) {
      setOpeningHoursError("Cannot have both opening and closing times set to '00:00.'")
      return false
    }
    if (!hasSelectedLocation) {
      setLocationError(true)
      return false
    }
    return true
  }

  const handleEditFormSubmit = async (formData: CardProps) => {
    const noErrors = handleFormErrors(formData, { selectedLocation: postData.locationData.postcode })
    if (!noErrors) {
      return
    }
    setIsSubmitting(true);
    const shouldSetVerifiedFalse = determineVerificationStatus(formData, postData)
    try {
      const { error: insertError } = await supabase
        .from('posts')
        .update({
          ...formData,
          selectedTags: selectedTags,
          isVerified: shouldSetVerifiedFalse,
          imgUrl: postData?.imgUrl,
          openingHours: formData.openingHours,
          email: user?.email,
          isRejected: false,
          updated_at: new Date().toISOString()
        })
        .match({ postId: postData?.postId });

      if (insertError) {
        console.error('Error updating post details:', insertError);
        return;
      }

      if (selectedFile) {
        await deleteCurrentImage();

        // Use cropped image if available, otherwise use original file
        let fileToUpload: Blob;

        if (croppedImage) {
          // Convert blob URL to Blob
          const response = await fetch(croppedImage);
          fileToUpload = await response.blob();
        } else {
          fileToUpload = selectedFile;
        }

        const imageUrl = await uploadNewImage(postData?.postId, fileToUpload);
        if (imageUrl !== null) {
          await updateImage(imageUrl);
        }

        const { error: updateError } = await supabase
          .from('posts')
          .update({ imgUrl: imageUrl })
          .eq('id', user?.id)
          .eq('postId', postData?.postId);

        if (updateError) {
          console.error('Error updating imgUrl:', updateError);
          return;
        }
      }
      const { error: locationError } = await supabase
        .from("locations")
        .update({
          country: selectedLocation.country,
          state: selectedLocation.state,
          suburb: selectedLocation.suburb,
          postcode: selectedLocation.postcode,
          streetAddress: selectedLocation.address,
          formatted_address: selectedLocation.address,
          postId: postData?.postId,
          coordinates: selectedLocation.coordinates
        })
        .eq("postId", postData?.postId)
      if (locationError) {
        console.error("Error updating location", locationError);

      }

    } catch (error) {
      console.error('Error handling submit:', error);
    }
    setIsSubmitting(false);
    formCleanup(shouldSetVerifiedFalse)
  }
  const handleNewFormSubmit = async (formData: CardProps) => {
    const noErrors = handleFormErrors(formData, { selectedLocation: selectedLocation.postcode })
    if (!noErrors) {
      return
    }
    setIsSubmitting(true)
    try {
      const postId = nanoid()
      const { error: insertError } = await supabase
        .from('posts')
        .insert({ ...formData, postId: postId, id: user?.id, selectedTags: selectedTags, isVerified: false, openingHours: formData.openingHours, email: user?.email, updated_at: new Date().toISOString() })

      if (insertError) {
        console.error('Error inserting post:', insertError);
        return;
      }

      // Use cropped image if available, otherwise use original file
      if (croppedImage || selectedFile) {
        let fileToUpload: Blob;

        if (croppedImage) {
          // Convert blob URL to Blob
          const response = await fetch(croppedImage);
          fileToUpload = await response.blob();
        } else {
          fileToUpload = selectedFile!;
        }

        const imageUrl = await uploadNewImage(postId, fileToUpload)
        if (imageUrl !== null) {

          const { error: updateError } = await supabase
            .from('posts')
            .update({ imgUrl: imageUrl })
            .eq('id', user?.id)
            .eq('postId', postId);

          if (updateError) {
            console.error('Error updating imgUrl:', updateError);
            return;
          }
        }
      }
      const { error: locationError } = await supabase
        .from('locations')
        .insert({
          country: selectedLocation.country,
          state: selectedLocation.state,
          suburb: selectedLocation.suburb,
          postcode: selectedLocation.postcode,
          streetAddress: selectedLocation.address,
          formatted_address: `${selectedLocation.address}, ${selectedLocation.suburb} ${selectedLocation.state}, ${selectedLocation.country}`,
          postId: postId,
          coordinates: selectedLocation.coordinates
        })
      if (locationError) {
        console.error("Error updating location table", locationError);
        return

      }



    } catch (error) {
      console.error('Error handling submit:', error);
    }
    formCleanup(false)
  }
  const submitChooser = (formData: CardProps) => {
    if (postData) {
      return handleEditFormSubmit(formData)
    } else {
      return handleNewFormSubmit(formData)
    }
  }
  useEffect(() => {
    if (postData) {
      setValue('name', postData.name)
      setSelectedLocation({
        coordinates: postData.coordinates,
        address: postData.streetAddress,
        suburb: postData.suburb,
        state: postData.state,
        country: postData.country,
        postcode: postData.postcode
      })
      setValue('adminEmail', postData.adminEmail)
      setValue('type', postData.type)
      setValue('description', postData.description || null)
      setValue('pickUp', postData.pickUp);
      setValue('delivery', postData.delivery);
      setValue('openingHours', postData.openingHours);
      setValue('dineIn', postData.dineIn);
      setValue('contact', postData.contact);
      setValue('website', postData.website);
      setValue('selectedTags', postData.selectedTags)
      setSelectedTags(postData?.selectedTags)
      setPreviewUrl(`${postData.imgUrl}?${new Date().getTime()}`)
    }
  }, [postData]);
  useEffect(() => {
    const allChecked = Object.values(checkboxes).every(checkbox => checkbox);
    setAllChecked(allChecked);
  }, [checkboxes]);

  const handleRuleCheckboxChange = (checkboxName: string) => {
    setCheckboxes(prevState => ({
      ...prevState,
      [checkboxName]: !prevState[checkboxName]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {postData ? "Edit Business Listing" : "Register Your Business"}
          </h1>
          <p className="text-lg text-gray-600">
            {postData ? "Update your business information" : "Share your business with the community"}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Main Form */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <form onSubmit={handleSubmit((data) => submitChooser(data as CardProps))} className="space-y-8">

                {/* Business Rules Checkboxes - Only show for new registrations */}
                {!postData && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Business Requirements
                    </h2>
                    <div className="space-y-4">
                      <p className="text-gray-700">Before we get started, please confirm the following about your business:</p>
                      <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-accent checkbox-sm mt-1"
                            checked={checkboxes.checkbox1}
                            onChange={() => handleRuleCheckboxChange('checkbox1')}
                          />
                          <span className="text-sm text-gray-700">Food and/or drinks are your <span className="font-semibold underline">primary</span> product offering.</span>
                        </div>
                        <div className="flex gap-3 items-start">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-accent checkbox-sm mt-1"
                            checked={checkboxes.checkbox2}
                            onChange={() => handleRuleCheckboxChange('checkbox2')}
                          />
                          <span className="text-sm text-gray-700">You have a <span className="font-semibold underline">genuine and permanent</span> physical retail location.</span>
                        </div>
                        <div className="flex gap-3 items-start">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-accent checkbox-sm mt-1"
                            checked={checkboxes.checkbox3}
                            onChange={() => handleRuleCheckboxChange('checkbox3')}
                          />
                          <span className="text-sm text-gray-700">You do <span className="font-semibold underline">NOT</span> operate or derive financial benefit from electronic gaming machines.</span>
                        </div>
                        <div className="flex gap-3 items-start">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-accent checkbox-sm mt-1"
                            checked={checkboxes.checkbox4}
                            onChange={() => handleRuleCheckboxChange('checkbox4')}
                          />
                          <span className="text-sm text-gray-700">You are not part of a franchise organisation, owned by a publicly listed entity, wholly or majority owned by non-Australian interests.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Photo Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Cover Photo
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Upload Cover Photo *
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full file-input file-input-bordered"
                          disabled={!allChecked}
                        />
                      </div>
                    </div>

                    {previewUrl && !croppedImage && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Crop Your Image</h3>
                        <ImageUpload file={previewUrl} setCroppedImage={setCroppedImage} />
                      </div>
                    )}



                    {errors.imgUrl && (
                      <p className="text-red-600 text-sm">{errors.imgUrl.message?.toString()}</p>
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
                        Business Name *
                      </label>
                      <Input
                        {...register("name", { required: "Business name is required" })}
                        placeholder="Enter business name"
                        className="w-full"
                        disabled={!allChecked}
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm">{errors.name.message?.toString()}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Business Type *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e9da8] focus:border-transparent"
                        {...register("type", { required: "Type of business is required" })}
                        disabled={!allChecked}
                      >
                        <option value="">Select Type</option>
                        {businessType.map(item => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                      {errors.type && (
                        <p className="text-red-600 text-sm">{errors.type.message?.toString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Contact Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Author Email
                      </label>
                      <Input
                        type="email"
                        value={user?.email}
                        className="w-full"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Admin Email (Optional)
                        </label>
                        <Toggle>
                          <ToggleButton className="cursor-pointer">
                            <FaInfoCircle className="w-4 h-4" />
                          </ToggleButton>
                          <ToggleOn>
                            <SimpleModal title="Admin Email">Add an admin who can edit the post on the author's behalf.</SimpleModal>
                          </ToggleOn>
                        </Toggle>
                      </div>
                      <Input
                        {...register("adminEmail")}
                        type="email"
                        placeholder="admin@example.com"
                        className="w-full"
                        disabled={!allChecked}
                      />
                      {watch('adminEmail') && (
                        <button
                          type="button"
                          className="btn btn-error btn-xs"
                          onClick={() => setValue("adminEmail", null)}
                        >
                          Remove admin
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Website (Optional)
                      </label>
                      <Input
                        {...register("website")}
                        type="url"
                        placeholder="https://example.com"
                        className="w-full"
                        disabled={!allChecked}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Contact Number (Optional)
                      </label>
                      <Input
                        {...register("contact")}
                        type="tel"
                        placeholder="Phone number"
                        className="w-full"
                        disabled={!allChecked}
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    About Your Business
                  </h2>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Business Description *
                    </label>
                    <textarea
                      {...register("description", {
                        required: "A description is required",
                      })}
                      rows={4}
                      placeholder="Tell us about your business. What makes it unique, special, or just plain awesome at what you do. Maybe you have a signature dish or award-winning tipple… maybe there's a brilliant back story or maybe it's home to a cast of lovable, colourful characters. Remember we're all about community so it's ok to be friendly and its ok to be personal."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e9da8] focus:border-transparent resize-none"
                      disabled={!allChecked}
                      maxLength={500}
                      style={{ whiteSpace: 'pre-wrap' }}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {countChars(getValues("description")) || 0}/500 characters
                      </span>
                    </div>
                    {errors.description && (
                      <p className="text-red-600 text-sm">{errors.description.message?.toString()}</p>
                    )}
                  </div>
                </div>

                {/* Services & Hours */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Services & Hours
                  </h2>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-700">
                        Delivery Methods *
                      </label>
                      {deliveryMethodError && <p className="text-red-600 text-sm">Please select at least one option.</p>}
                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <input
                            {...register("pickUp")}
                            type="checkbox"
                            className="checkbox checkbox-accent"
                            disabled={!allChecked}
                          />
                          <label className="text-sm text-gray-700">Pick-Up</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            {...register("delivery")}
                            type="checkbox"
                            className="checkbox checkbox-accent"
                            disabled={!allChecked}
                          />
                          <label className="text-sm text-gray-700">Delivery</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            {...register("dineIn")}
                            type="checkbox"
                            className="checkbox checkbox-accent"
                            disabled={!allChecked}
                          />
                          <label className="text-sm text-gray-700">Dine-In</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-700">
                        Opening Hours *
                      </label>
                      {openingHoursError && (
                        <p className="text-red-600 text-sm">{openingHoursError}</p>
                      )}
                      <OpeningHours register={register} watch={watch} errors={errors} allChecked={allChecked} />
                    </div>
                  </div>
                </div>

                {/* Business Tags */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Business Categories
                  </h2>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">
                      Choose up to 5 options that best describe your business:
                    </label>
                    <Select
                      value={selectedTags}
                      onChange={handleTagChange}
                      options={transformedTags}
                      isMulti={true}
                      isDisabled={!allChecked}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                    Business Location
                  </h2>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">
                      Business Address *
                    </label>
                    <LocationSearch
                      allChecked={allChecked}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4e9da8] focus:border-transparent"
                      onSelect={handleLocationSelect}
                      postData={postData}
                      suburbAndPostcode={true}
                      types={['address']}
                      placeholder="Start typing in an address"
                      isRequired={true}
                    />
                    {locationError && (
                      <p className="text-red-600 text-sm">Please select a business location.</p>
                    )}
                  </div>
                </div>

                {/* Terms Agreement - Only for new registrations */}
                {!postData && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isAgree}
                        disabled={!allChecked}
                        onChange={() => setIsAgree(!isAgree)}
                        className="checkbox checkbox-accent mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a
                          className="font-semibold underline cursor-pointer text-[#4e9da8]"
                          href="https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Terms%20of%20Service.pdf?t=2024-03-02T06%3A44%3A23.692Z"
                          target="_blank"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          className="font-semibold underline cursor-pointer text-[#4e9da8]"
                          href="https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Privacy%20Policy.pdf?t=2024-03-02T06%3A43%3A32.620Z"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full !bg-[#4e9da8] !hover:bg-[#3d8a94] text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !allChecked || (!postData && !isAgree)}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        {postData ? "Update Business Listing" : "Submit Business Registration"}
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section - Only show on desktop */}
          {!isMobile && (
            <div className="w-96">
              <div className="sticky top-8">
                <div className="flex items-center gap-3 mb-4">
                  <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                    <input
                      type='checkbox'
                      name='autoSaver'
                      className='sr-only'
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <span
                      className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'}`}
                    >
                      <span
                        className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''}`}
                      ></span>
                    </span>
                    <span className='label flex items-center text-sm font-medium'>
                      Show Preview
                    </span>
                  </label>
                </div>

                {isChecked && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                    <PreviewCard
                      imgUrl={croppedImage || previewUrl}
                      name={watch().name}
                      suburb={selectedLocation.suburb}
                      state={selectedLocation.state}
                      postcode={selectedLocation.postcode}
                      address={selectedLocation.address}
                      type={watch().type}
                      products={selectedTags?.map(tag => tag?.label).join(', ')}
                      description={watch().description}
                      openingHours={watch().openingHours}
                      contact={watch().contact}
                      pickUp={watch().pickUp}
                      delivery={watch().delivery}
                      dineIn={watch().dineIn}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
