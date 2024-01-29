import { useState } from "react"
import transformedTags from '../data/tags.ts'
import { useUser } from "@supabase/auth-helpers-react";
import businessType from "../data/businessTypes.json"
import { useForm } from "react-hook-form"
import supabase from "../config/supabaseClient.ts";
import { PreviewCard } from "../components/PreviewCard.tsx";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import OpeningHours from "../components/Opening-Hours/OpeningHours.tsx"
import Select from "react-select"
import { useMediaQuery } from "react-responsive"
import LocationSearch from "../components/Location/LocationSearch.tsx";



type imgPath = {
    path: string
}

type FormData = {
    postId: string,
    id: string | undefined
    imgUrl: string
    name: string;
    suburb: string;
    state: string;
    postcode: string;
    address: string;
    type: string;
    selectedTags: string[];
    description: string;
    openingHours: string;
    delivery: boolean,
    dineIn: boolean,
    pickUp: boolean,
    website: string;
    contact: string;
}

type PostData = {
    imgUrl: string,
    name: string,
    suburb: string,
    state: string,
    country: string
    postcode: string,
    streetAddress: string,
    formatted_address: string,
    type: string,
    selectedTags: string[],
    description: string,
    openingHours: string,
    pickUp: boolean,
    delivery: boolean,
    dineIn: boolean,
    contact: string,
    website: string,
    isVerified: boolean,
    postId: string
}

type LocationData = {
    address: string,
    postcode: string,
    suburb: string,
    state: string,
    country: string,
    coordinates: any,
}

export default function SeedForm() {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors }, setValue, reset, getValues, setError, clearErrors } = useForm();
    const user = useUser();
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [deliveryMethodError, setDeliveryMethodError] = useState<boolean>(false)
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isChecked, setIsChecked] = useState<boolean>(true)
    const [selectedLocation, setSelectedLocation] = useState<LocationData>({
        address: "",
        postcode: "",
        suburb: "",
        state: "",
        country: "",
        coordinates: ""
    })

    const MAX_FILE_SIZE_IN_BYTES = 300000;
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
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }
    const CDNUrl = (imgPath: imgPath) => {
        return `https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/cover_images/` + imgPath.path
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
    const handleTagChange = (selectedTags: string | any[] | ((prevState: string[]) => string[])) => {
        if (selectedTags.length <= 5) {
            setSelectedTags(selectedTags);
        }
    };
    const handleFileChange = (e: any) => {
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
    // const uploadNewImage = async (postId) => {
    //     const { data: imageData, error: imageError } = await supabase.storage
    //         .from('cover_images')
    //         .upload(user?.id + '/' + postId, selectedFile);
    //     if (imageError) {
    //         console.error('Error uploading image:', imageError);
    //         return null;
    //     }
    //     return CDNUrl(imageData);
    // };

    console.log(selectedLocation);


    const countChars = (name: string) => {
        const watchValue = getValues(name)
        const inputLength = watchValue?.length
        return inputLength
    }
    const handleNewFormSubmit = async (formData: FormData) => {
        console.log(formData);

        const openingHoursArray = Object.entries(formData.openingHours).map(([day, data]) => {
            return {
                day,
                ...data
            };
        });

        if (!watch().delivery && !watch().pickUp && !watch().dineIn) {
            setDeliveryMethodError(true)
            return
        }
        setIsSubmitting(true)
        try {
            const postId = nanoid()
            const { error: insertError } = await supabase
                .from('posts')
                .insert({
                    ...formData,
                    postId: postId,
                    id: user?.id,
                    selectedTags: selectedTags,
                    isVerified: true,
                    openingHours: openingHoursArray,
                    hasOwner: false,
                })

            if (insertError) {
                console.error('Error inserting post:', insertError);
                return;
            }
            if (selectedFile) {
                const { data: imageData, error: imageError } = await supabase.storage
                    .from('cover_images')
                    .upload(user?.id + '/' + postId, selectedFile);

                if (imageError) {
                    console.error('Error uploading image:', imageError);
                    return;
                }

                const imageUrl = CDNUrl(imageData);

                const { error: updateError } = await supabase
                    .from('posts')
                    .update({ imgUrl: imageUrl })
                    .eq('id', user?.id)
                    .eq('postId', postId);

                if (updateError) {
                    console.error('Error updating imgUrl:', updateError);
                    return;
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

            }

        } catch (error) {
            console.error('Error handling submit:', error);
        }
        formCleanup()
    }

    return (
        <div className="md:flex justify-center">
            <div>
                <p className=" text-lg text-red-500">This page is only for seeding the database</p>
                <form onSubmit={handleSubmit((data) => handleNewFormSubmit(data as FormData))}>
                    <div className="md:max-w-3xl md:mr-10 shadow-lg md:px-24 pb-24 pt-10">
                        <header className="mb-7">
                            <h1 className=" text-xl font-bold ">Profile</h1>
                            <p>This information will be displayed publicly.</p>
                        </header>
                        <div className="flex flex-col mb-5">
                            <label htmlFor="">Customer Email</label>
                            {errors.email && <p className=" text-red-600">*{errors.email.message?.toString()}</p>}
                            <input
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                {...register("email", { required: "Client email is required" })}
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <label htmlFor="">Business Name</label>
                            {errors.name && <p className=" text-red-600">*{errors.name.message?.toString()}</p>}
                            <input
                                type="text"
                                className="input input-bordered w-full max-w-xs"
                                {...register("name", { required: "Business name is required" })}
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <label> Select Type:</label>
                            {errors.type && <p className=" text-red-600">*{errors.type.message?.toString()}</p>}
                            <select
                                className="select select-bordered w-full max-w-xs"
                                {...register("type", { required: "Type of business is required" })}
                            >
                                <option value="" selected disabled>Select Type</option>
                                {businessType.map(item => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col mb-5">
                            <h2>About</h2>
                            {errors.description && <p className=" text-red-600">*{errors.description.message?.toString()}</p>}
                            <textarea
                                className="textarea textarea-bordered w-full "
                                placeholder="Write a few detailed sentences about your business."
                                {...register("description", {
                                    required: "A description is required",
                                })}
                                maxLength={500}
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                            </textarea>
                            <div className="label">
                                <span className="label-text-alt"></span>
                                <span className={countChars("description") >= 500 ? "text-red-500 text-xs" : "label-text-alt"}>
                                    {countChars("description") || 0}/500
                                </span>

                            </div>
                        </div>
                        <div className="flex flex-col mb-5 ">
                            <p >Delivery Method</p>
                            {deliveryMethodError && <p className="text-red-600">*Please select at least one option</p>}
                            <div className="flex gap-3">
                                <div className="flex">
                                    <input
                                        {...register("pickUp")}
                                        type="checkbox"
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                    />
                                    <label>Pick-Up</label>
                                </div>
                                <div className="flex">
                                    <input
                                        {...register("delivery")}
                                        type="checkbox"
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                    />
                                    <label>Delivery</label>
                                </div>
                                <div className="flex">
                                    <input
                                        {...register("dineIn")}
                                        type="checkbox"
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                    />
                                    <label>Dine-In</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mb-5">
                            <label >Opening Hours:</label>
                            <OpeningHours setValue={setValue} register={register} watch={watch} errors={errors} setError={setError} clearErrors={clearErrors} />
                        </div>
                        <div className="flex mb-2">
                            <label >Choose up to 5 options that best describe your business:</label>
                        </div>
                        <Select
                            value={selectedTags}
                            onChange={handleTagChange}
                            options={transformedTags}
                            isMulti={true}
                        />
                        <div className="flex mt-7 gap-4">
                            <div className="flex flex-col w-1/2">
                                <label>Website <small>(Optional)</small></label>
                                <input
                                    type="website"
                                    className="input input-bordered "
                                    {...register("website")}
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Contact Number <small>(Optional)</small></label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    {...register("contact")}
                                />
                            </div>
                        </div>

                        <div className="cover-photo">
                            <h2 className="mt-7">Add Cover Photo</h2>
                            <p className="text-xs">Max image size of 300KB</p>
                            {errors.imgUrl && (
                                <p className="text-red-600">*{errors.imgUrl.message?.toString()}</p>
                            )}
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full"
                                {...register("imgUrl", {
                                    required: "Cover photo is required",
                                    validate: {
                                        maxSize: (value) =>
                                            !value ||
                                            value[0].size <= MAX_FILE_SIZE_IN_BYTES ||
                                            "File size exceeds the limit of 300KB",
                                    },
                                })}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {previewUrl && <img
                                src={previewUrl}
                                alt="Cover"
                                style={{ height: '225px', width: '300px' }}
                                className=" mt-5 rounded-lg"
                            />}
                        </div>


                        <div className="divider"></div>
                        <label htmlFor="">Address</label>
                        <LocationSearch onSelect={handleLocationSelect} suburbAndPostcode={true} types={['address']} placeholder="Start typing in an address" />
                        <div className=" flex gap-2 mt-7">
                            {isSubmitting ? <button className="btn w-full btn-disabled">Submitting<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                                :
                                <button className="btn btn-primary w-full">Submit</button>
                            }
                        </div>
                    </div>
                </form >
            </div>
            {!isMobile && <div >
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
                            imgUrl={previewUrl}
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
            </div>}
            <Toaster />
        </div >
    )
}
