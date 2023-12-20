import { useState, useEffect, SetStateAction } from "react"
import transformedTags from '../data/tags.ts'
import { useUser } from "@supabase/auth-helpers-react";
import businessType from "../data/businessTypes.json"
import { useForm } from "react-hook-form"
import supabase from "../config/supabaseClient.ts";
import { PreviewCard } from "../components/PreviewCard.tsx";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";
import OpeningHours from "../components/OpeningHours.tsx"
import Select from "react-select"


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
    postcode: string,
    address: string,
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
type TagsType = {
    value: string,
    label: string
}

export default function PostForm({ postData }: { postData: PostData | undefined }) {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors }, setValue, reset, getValues, setError, clearErrors } = useForm();
    const user = useUser();
    const [selectedFile, setSelectedFile] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [deliveryMethodError, setDeliveryMethodError] = useState<boolean>(false)
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isChecked, setIsChecked] = useState<boolean>(true)
    const MAX_FILE_SIZE_IN_BYTES = 300000;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [show, setShow] = useState<boolean>(false)


    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }
    const CDNUrl = (imgPath: imgPath) => {
        return `https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/cover_images/` + imgPath.path
    }
    const formCleanup = () => {
        setDeliveryMethodError(false)
        setIsSubmitting(false)
        setSelectedTags([])
        reset()
        toast.success("Listing will be submitted for verification!")
        setTimeout(() => {
            navigate("/");
        }, 1000);
    }
    const handleTagChange = (selectedTags) => {
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

    const handleEditFormSubmit = async (formData: FormData) => {
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
        setIsSubmitting(true);

        try {
            const { error: insertError } = await supabase
                .from('posts')
                .update({ ...formData, selectedTags: selectedTags, isVerified: false, imgUrl: postData?.imgUrl, openingHours: openingHoursArray })
                .match({ postId: postData?.postId });

            if (insertError) {
                console.error('Error updating post details:', insertError);
                return;
            }

            if (selectedFile) {
                // Delete the current cover image from storage
                const currentImageName = user?.id + '/' + postData?.postId;
                const { error: deleteError } = await supabase.storage
                    .from('cover_images')
                    .remove([currentImageName]);

                if (deleteError) {
                    console.error('Error deleting current image:', deleteError);
                    return;
                }

                // Upload the new cover image to storage
                const { data: imageData, error: imageError } = await supabase.storage
                    .from('cover_images')
                    .upload(user?.id + '/' + postData?.postId, selectedFile);

                if (imageError) {
                    console.error('Error uploading image:', imageError);
                    return;
                }


                const imageUrl = CDNUrl(imageData);

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

            console.log('Post details updated successfully!');
        } catch (error) {
            console.error('Error handling submit:', error);
        }
        setIsSubmitting(false);
        formCleanup()
    };

    const handleNewFormSubmit = async (formData: FormData) => {
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
            // const openingHoursForDbFiltered = openingHoursArray.filter(item => item.isOpen === "open");
            const { error: insertError } = await supabase
                .from('posts')
                .insert({ ...formData, postId: postId, id: user?.id, selectedTags: selectedTags, isVerified: false, openingHours: openingHoursArray })

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

            }

        } catch (error) {
            console.error('Error handling submit:', error);
        }
        formCleanup()
    }
    const submitChooser = (formData: FormData) => {
        if (postData) {
            return handleEditFormSubmit(formData)
        } else {
            return handleNewFormSubmit(formData)
        }
    }
    useEffect(() => {
        if (postData) {
            setValue('name', postData.name)
            setValue('suburb', postData.suburb)
            setValue('address', postData.address)
            setValue('postcode', postData.postcode)
            setValue('state', postData.state)
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



    return (
        <div className="flex justify-center">
            <div>
                <form onSubmit={handleSubmit((data) => submitChooser(data as FormData))}>
                    <div className="max-w-3xl mr-10 shadow-lg px-24 pb-24 pt-10">
                        <header className="mb-7">
                            <h1 className=" text-xl font-bold ">Profile</h1>
                            <p>This information will be displayed publicly.</p>
                        </header>
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
                                {...register("description", { required: "A description is required" })}
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                            </textarea>
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
                            {errors.openingHours && <p className=" text-red-600">*{errors.openingHours.message?.toString()}</p>}
                            <OpeningHours register={register} setValue={setValue} watch={watch} getValues={getValues} errors={errors} setError={setError} clearErrors={clearErrors} postData={postData} />
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
                                <label>Website (recommended)</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register("website")}
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Contact Number (recommended)</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register("contact")}
                                />
                            </div>
                        </div>
                        {postData ?
                            <>
                                <div className="flex flex-col gap-5">
                                    {!show ? <img
                                        src={previewUrl}
                                        alt="Cover"
                                        style={{ height: '225px', width: '300px' }}
                                        className=" mt-5 rounded-lg"
                                    />
                                        :
                                        <>{previewUrl && <img
                                            src={previewUrl}
                                            alt="Cover"
                                            style={{ height: '225px', width: '300px' }}
                                            className=" mt-5 rounded-lg"
                                        />}
                                            <div className="cover-photo">
                                                <h2 className="mt-1">Update Cover Photo</h2>
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

                                            </div>
                                        </>
                                    }
                                    {!show ? <p onClick={() => setShow(!show)}
                                        className="btn btn-primary w-"
                                    >Update Cover Photo</p>
                                        :
                                        <p onClick={() => { setPreviewUrl(postData.imgUrl); setShow(!show) }}
                                            className="btn btn-primary w-"
                                        >Cancel</p>
                                    }
                                </div>
                            </>

                            :
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
                        }

                        <div className="divider"></div>
                        <h2>Street Address</h2>
                        {errors.address && <p className=" text-red-600">*{errors.address.message?.toString()}</p>}
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("address", { required: "Address is required" })}
                        />
                        <div className="container flex gap-2 mt-7">
                            <div className="flex flex-col">
                                <label>Suburb</label>
                                {errors.suburb && <p className=" text-red-600">*{errors.suburb.message?.toString()}</p>}
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("suburb", { required: "Suburb is required" })}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>State</label>
                                {errors.state && <p className=" text-red-600">*{errors.state.message?.toString()}</p>}
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("state", { required: "State is required" })}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Postcode</label>
                                {errors.postcode && <p className=" text-red-600">*{errors.postcode.message?.toString()}</p>}
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    {...register("postcode", { required: "Postcode is required" })}
                                />
                            </div>
                        </div>
                        <div className=" flex gap-2 mt-7">
                            {isSubmitting ? <button className="btn w-full btn-disabled">Submitting<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                                :
                                <button className="btn btn-primary w-full">Submit</button>
                            }
                        </div>
                    </div>
                </form >
            </div>
            <div >
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
                            suburb={watch().suburb}
                            state={watch().state}
                            postcode={watch().postcode}
                            address={watch().address}
                            type={watch().type}
                            products={selectedTags.map(tag => tag?.label).join(', ')}
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
            <Toaster />
        </div >
    )
}
