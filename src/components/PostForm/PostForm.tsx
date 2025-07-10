import { useState, useEffect } from "react"
import transformedTags from '../../data/tags.ts'
import { useUser } from "@supabase/auth-helpers-react";
import businessType from "../../data/businessTypes.json"
import { useForm } from "react-hook-form"
import supabase from "../../config/supabaseClient.ts";
import { PreviewCard } from "../PreviewCard.tsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import OpeningHours from "../Opening-Hours/OpeningHours.tsx"
import Select from "react-select"
import { useMediaQuery } from "react-responsive"
import LocationSearch from "../Location/LocationSearch.tsx";
import { CardProps, SelectedTags } from "../../Types/index.ts"
import Toggle from "../Toggle/Toggle.tsx";
import ToggleButton from "../Toggle/ToggleButton.tsx";
import ToggleOn from "../Toggle/ToggleOn.tsx";
import SimpleModal from "../Modals/SimpleModal.tsx";
import { FaInfoCircle } from "react-icons/fa";
import { determineVerificationStatus, handleErrors, countChars, CDNUrl } from "./utils.ts";
import compress from 'compressorjs';
import ImageUpload from "../ImageUpload.tsx";

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

export default function PostForm({ postData, }: CardProps) {
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
    const [show, setShow] = useState<boolean>(false)
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
        const currentImageName = user?.id + '/' + postData?.postId;
        const { error: deleteError } = await supabase.storage
            .from('cover_images')
            .remove([currentImageName]);
        if (deleteError) {
            console.error('Error deleting current image:', deleteError);
        }
    };

    const uploadNewImage = async (postId: string, selectedFile: Blob) => {
        // Compress the selected file
        const compressedFile: Blob | MediaSource = await new Promise((resolve, reject) => {
            new compress(selectedFile, {
                maxWidth: 1024,
                maxHeight: 1024,
                quality: 0.8,
                success(result) {
                    resolve(result);
                },
                error(error) {
                    reject(error);
                }
            });
        });

        // Convert the compressed image to WebP format
        const webpBlob: any = await new Promise((resolve, reject) => {
            const image = new Image();
            image.src = URL.createObjectURL(compressedFile);

            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(image, 0, 0);
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/webp');
            };

            image.onerror = reject;
        });

        // Upload the webp image to Supabase
        const { data: imageData, error: imageError } = await supabase.storage
            .from('cover_images')
            .upload(user?.id + '/' + postId, webpBlob, {
                contentType: 'image/webp',
                upsert: false
            });

        if (imageError) {
            console.error('Error uploading image:', imageError);
            return null;
        }

        return CDNUrl(imageData);
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
        <>
            <div className="flex md:justify-center">
                <form onSubmit={handleSubmit((data) => submitChooser(data as CardProps))} className="max-w-full md:mr-10 shadow-lg md:px-10 pb-24 pt-10 p-4">
                    <header className=" max-w-md">
                        {!postData ?
                            <div className=" py-4 flex flex-col">
                                <p className=" mb-4 text-center"><span className=" font-bold">Awesome!</span> We’re super excited you decided to register. Before we get going, please confirm the following about your business.</p>
                                <div className="text-xs leading-6 list-inside flex flex-col gap-2">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-accent checkbox-sm"
                                            checked={checkboxes.checkbox1}
                                            onChange={() => handleRuleCheckboxChange('checkbox1')}
                                        />
                                        <span>Food and / or drinks are your <span className=" underline">primary</span> product offering.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-accent checkbox-sm"
                                            checked={checkboxes.checkbox2}
                                            onChange={() => handleRuleCheckboxChange('checkbox2')}
                                        />
                                        <span>You have a <span className=" underline">genuine and permanent</span> physical retail location. </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-accent checkbox-sm"
                                            checked={checkboxes.checkbox3}
                                            onChange={() => handleRuleCheckboxChange('checkbox3')}
                                        />
                                        <span>You do <span className=" underline">NOT</span> operate or derive financial benefit from electronic gaming machines.</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-accent checkbox-sm"
                                            checked={checkboxes.checkbox4}
                                            onChange={() => handleRuleCheckboxChange('checkbox4')}
                                        />
                                        <span>You are not part of a franchise organisation, owned by a publicly listed entity, wholly or majority owned by non-Australian interests.</span>
                                    </div>
                                </div>
                            </div> :
                            <p className=" mb-4 font-bold text-2xl">Edit Post:</p>
                        }
                    </header>
                    <div className={`${!allChecked && "text-gray-300"}`}>
                        {!allChecked ?
                            <div className="divider">
                            </div>
                            :
                            <div className=" my-4">
                                <p className="text-blue-500">Ok... let’s go! Make sure you complete all mandatory fields below.</p>
                            </div>

                        }
                        <div className="flex flex-col mb-5 mt-7">
                            <label htmlFor="">Business Name</label>
                            {errors.name && <p className=" text-red-600">*{errors.name.message?.toString()}</p>}
                            <input
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                {...register("name", { required: "Business name is required" })}
                                disabled={!allChecked}
                            />
                        </div>

                        <div className="flex flex-col mb-5">
                            <label htmlFor="">Author Email</label>
                            <input
                                type="text"
                                value={user?.email}
                                className="input input-bordered w-full max-w-xs"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <div className="flex items-center gap-5">
                                <label htmlFor="">Admin Email (optional)</label>
                                <Toggle>
                                    <ToggleButton className=" cursor-pointer"> <FaInfoCircle /></ToggleButton>
                                    <ToggleOn>
                                        <SimpleModal title="doli" >Add an admin who can edit the post on the authors behalf.</SimpleModal>
                                    </ToggleOn>
                                </Toggle>
                            </div>
                            {errors.adminEmail && <p className=" text-red-600">*{errors.adminEmail.message?.toString()}</p>}
                            <input
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                {...register("adminEmail")}
                                disabled={!allChecked}
                            />
                            <div>
                                {watch('adminEmail') && <button
                                    className=" btn btn-error btn-xs" onClick={() => setValue("adminEmail", null)}
                                >Remove admin</button>}
                            </div>
                        </div>

                        <div className="divider "></div>

                        <div className="flex flex-col mb-5">
                            <label> Select Type:</label>
                            {errors.type && <p className=" text-red-600">*{errors.type.message?.toString()}</p>}
                            <select
                                className="select select-bordered w-full max-w-xs"
                                {...register("type", { required: "Type of business is required" })}
                                defaultValue="Select Type"
                                disabled={!allChecked}
                            >
                                <option disabled>Select Type</option>
                                {businessType.map(item => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col mb-5">
                            <h2>About</h2>
                            {errors.description && <p className=" text-red-600">*{errors.description.message?.toString()}</p>}
                            <textarea
                                className="textarea textarea-bordered w-full h-48"
                                placeholder="Tell us about your business. What makes it unique, special, or just plain awesome at what you do. Maybe you have a signature dish or award-winning tipple… maybe there’s a brilliant back story or maybe it’s home to a cast of lovable, colourful characters. Remember we’re all about community so it's ok to be friendly and its ok to be personal."
                                {...register("description", {
                                    required: "A description is required",
                                })}
                                disabled={!allChecked}
                                maxLength={500}
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                            </textarea>
                            <div className="label">
                                <span className="label-text-alt"></span>
                                <span className={countChars(getValues("description")) >= 500 ? "text-red-500 text-xs" : "label-text-alt"}>
                                    {countChars(getValues("description")) || 0}/500
                                </span>

                            </div>
                        </div>
                        <div className="flex flex-col mb-5 ">
                            <p >Delivery Method</p>
                            {deliveryMethodError && <p className="text-red-600">*Please select at least one option.</p>}
                            <div className="flex gap-3">
                                <div className="flex">
                                    <input
                                        {...register("pickUp")}
                                        type="checkbox"
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                        disabled={!allChecked}
                                    />
                                    <label>Pick-Up</label>
                                </div>
                                <div className="flex">
                                    <input
                                        {...register("delivery")}
                                        type="checkbox"
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                        disabled={!allChecked}
                                    />
                                    <label>Delivery</label>
                                </div>
                                <div className="flex">
                                    <input
                                        {...register("dineIn")}
                                        type="checkbox"
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                        disabled={!allChecked}
                                    />
                                    <label>Dine-In</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mb-5">
                            <label >Opening Hours:</label>
                            {openingHoursError && <div className=" text-red-600 mt-5">
                                {openingHoursError}
                            </div>}
                            <OpeningHours register={register} watch={watch} errors={errors} allChecked={allChecked} />
                        </div>
                        <div className="flex mb-2">
                            <label >Choose up to 5 options that best describe your business:</label>
                        </div>
                        <Select
                            value={selectedTags}
                            onChange={handleTagChange}
                            options={transformedTags}
                            isMulti={true}
                            isDisabled={!allChecked}
                        />
                        <div className="flex flex-col md:flex-row mt-7 gap-4">
                            <div className="flex flex-col md:w-1/2">
                                <label>Website <small>(Optional)</small></label>
                                <input
                                    type="website"
                                    className="input input-bordered "
                                    {...register("website")}
                                    disabled={!allChecked}
                                />
                            </div>
                            <div className="flex flex-col md:w-1/2">
                                <label>Contact Number <small>(Optional)</small></label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    {...register("contact")}
                                    disabled={!allChecked}
                                />
                            </div>
                        </div>
                        {postData ?
                            <>
                                <div className="flex flex-col gap-5">
                                    {!selectedFile ? (
                                        <>
                                            <img
                                                src={postData.imgUrl}
                                                alt="Cover"
                                                style={{ height: '225px', width: '300px' }}
                                                className="mt-5 rounded-lg"
                                            />
                                            <div className="cover-photo">
                                                <h2 className="mt-1">Update Cover Photo</h2>
                                                <p className="text-xs">Max image size of 2MB</p>
                                                {errors.imgUrl && (
                                                    <p className="text-red-600">*{errors.imgUrl.message?.toString()}</p>
                                                )}
                                                <input
                                                    type="file"
                                                    className="file-input file-input-bordered w-full"
                                                    {...register("imgUrl", {
                                                        required: "Cover photo is required",
                                                    })}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {!croppedImage && <div className="mt-4"><ImageUpload file={previewUrl} croppedImage={croppedImage} setCroppedImage={setCroppedImage} /></div>}
                                            {croppedImage && (
                                                <div className="mt-6">
                                                    <div className="border rounded-lg overflow-hidden">
                                                        <img
                                                            src={croppedImage}
                                                            alt="Cropped"
                                                            className="w-full h-auto max-h-64 object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewUrl(postData.imgUrl);
                                                    setCroppedImage(null);
                                                    setSelectedFile(null);
                                                }}
                                                className="btn btn-gray w-full"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>

                            :
                            <div className="cover-photo">
                                <h2 className="mt-7">Add Cover Photo</h2>
                                {/* <p className="text-xs">Max image size of 2MB</p> */}
                                {errors.imgUrl && (
                                    <p className="text-red-600">*{errors.imgUrl.message?.toString()}</p>
                                )}
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full"
                                    {...register("imgUrl", {
                                        required: "Cover photo is required",
                                    })}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    disabled={!allChecked}
                                />
                                {previewUrl && !croppedImage && <div className="mt-4"><ImageUpload file={previewUrl} croppedImage={croppedImage} setCroppedImage={setCroppedImage} /></div>}
                                {croppedImage && (
                                    <div className="mt-6">
                                        <div className="border rounded-lg overflow-hidden">
                                            <img
                                                src={croppedImage}
                                                alt="Cropped"
                                                className="w-full h-auto max-h-64 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        }

                        <div className="divider"></div>
                        <label htmlFor="">Address</label>
                        <LocationSearch allChecked={allChecked} className="input input-bordered" onSelect={handleLocationSelect} postData={postData} suburbAndPostcode={true} types={['address']} placeholder="Start typing in an address" isRequired={true} />
                        {openingHoursError && <div className=" text-red-600 mt-5">
                            {openingHoursError}
                        </div>}
                        {deliveryMethodError && <p className="text-red-600 mt-5">*Please select at least one delivery method option.</p>}
                        {locationError && <p className="text-red-600 mt-5">*Please select a business location.</p>}
                        {!postData && <div className=" flex items-center gap-3 mt-5">
                            <label className="cursor-pointer label ">
                                <input type="checkbox" checked={isAgree} disabled={!allChecked} onChange={() => setIsAgree(!isAgree)} className="checkbox checkbox-info" />
                            </label>
                            <span className="label-text">I agree to the <span></span>
                                <a className=" text-bold underline cursor-pointer" href="https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Terms%20of%20Service.pdf?t=2024-03-02T06%3A44%3A23.692Z" target="_blank">Terms of Service</a>
                                <span></span> and <span></span>
                                <a className="text-bold underline cursor-pointer" href="https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Privacy%20Policy.pdf?t=2024-03-02T06%3A43%3A32.620Z" target="_blank">Privacy Policy.</a >
                            </span>
                        </div>}
                        {isAgree && allChecked ? <div className=" flex gap-2 mt-7">
                            {isSubmitting ? <button className="btn w-full btn-disabled">Submitting<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                                :
                                <button className="btn btn-primary w-full">Submit</button>
                            }
                        </div> :

                            <div className=" flex gap-2 mt-7">
                                <button className="btn w-full btn-disabled">Submit</button>
                            </div>
                        }                    </div>
                </form >
                {
                    !isMobile && <div >
                        <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                            <input
                                type='checkbox'
                                name='autoSaver'
                                className='sr-only'
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <span
                                className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'
                                    }`}
                            >
                                <span
                                    className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''
                                        }`}
                                ></span>
                            </span>
                            <span className='label flex items-center text-sm font-medium'>
                                Show Preview
                            </span>
                        </label>
                        {isChecked && (
                            <div style={{ width: '50%' }}>

                                <PreviewCard
                                    imgUrl={croppedImage}
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
                }
            </div >
        </>
    )
}
