import { useState, ChangeEvent, useRef, useEffect } from "react"
import tags from '../data/tags.ts'
import { useUser } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import businessType from "../data/businessTypes.json"
import { useForm } from "react-hook-form"
import supabase from "../config/supabaseClient.ts";
import { PreviewCard } from "../components/PreviewCard.tsx";

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

export default function AddPost() {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const user = useUser();
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [deliveryMethodError, setDeliveryMethodError] = useState<boolean>(false)
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isChecked, setIsChecked] = useState(true)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }
    const CDNUrl = (imgPath: imgPath) => {
        return `https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/cover_images/` + imgPath.path
    }
    const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        const isOptionSelected = selectedTags.includes(selectedOptions[0]);

        setSelectedTags((prev) => {
            if (isOptionSelected) {
                // Remove the tag from selectedTags state
                const updatedTags = prev.filter((tag) => tag !== selectedOptions[0]);
                setValue('selectedTags', updatedTags); // Update the form state
                return updatedTags;
            }
            if (prev.length + selectedOptions.length <= 5) {
                const updatedTags = [...prev, ...selectedOptions];
                setValue('selectedTags', updatedTags); // Update the form state
                return updatedTags;
            } else {
                const remainingSlots = 5 - prev.length;
                const updatedTags = [...prev, ...selectedOptions.slice(0, remainingSlots)];
                setValue('selectedTags', updatedTags); // Update the form state
                return updatedTags;
            }
        });
    };
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (formData: FormData) => {
        if (!watch().delivery && !watch().pickUp && !watch().dineIn) {
            setDeliveryMethodError(true)
            return
        }
        try {
            const postId = nanoid()
            const { error: insertError } = await supabase.from('posts').insert({ ...formData, postId: postId, id: user?.id });
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
                    .eq('id', user?.id);

                if (updateError) {
                    console.error('Error updating imgUrl:', updateError);
                    return;
                }

                console.log('Image uploaded and imgUrl updated successfully:', imageUrl);
            }

        } catch (error) {
            console.error('Error handling submit:', error);
        }
        setDeliveryMethodError(false)

    }
    const previewCardRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const previewCard = previewCardRef.current;

            if (previewCard) {
                const scrollTop = window.scrollY;

                previewCard.style.transform = `translateY(${scrollTop}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="flex justify-center">
            <div>
                <form onSubmit={handleSubmit((data) => handleFormSubmit(data as FormData))}>
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
                            // defaultValue="Select Type"
                            >
                                <option value="" selected disabled>Select Type</option>
                                {businessType.map(item => (
                                    <option key={nanoid()}>{item}</option>
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
                                        checked={watch().pickUp || false}
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                    />
                                    <label>Pick-Up</label>
                                </div>
                                <div className="flex">
                                    <input
                                        {...register("delivery")}
                                        type="checkbox"
                                        checked={watch().delivery || false}
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                    />
                                    <label>Delivery</label>
                                </div>
                                <div className="flex">
                                    <input
                                        {...register("dineIn")}
                                        type="checkbox"
                                        checked={watch().dineIn || false}
                                        className="checkbox checkbox-xs mr-2 mt-1"
                                    />
                                    <label>Dine-In</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col mb-5">
                            <label >Opening Hours</label>
                            {errors.openingHours && <p className=" text-red-600">*{errors.openingHours.message?.toString()}</p>}
                            <input
                                placeholder="eg Mon-Fri 9am-5pm"
                                type="text"
                                className="input input-bordered w-full max-w-xs "
                                {...register("openingHours", { required: "Opening hours are required" })}
                            />
                        </div>
                        <div className="flex flex-col mb-5">
                            <label>Choose up to 5 options:</label>
                            {errors.selectedTags && <p className=" text-red-600">*{errors.selectedTags.message?.toString()}</p>}
                            <select
                                multiple
                                {...register('selectedTags', { required: "Business tags are required" })}
                                className="select select-bordered"
                                onChange={handleTagChange}
                                value={selectedTags}
                            >
                                {tags.map((tag, index) => (
                                    <option key={index} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            {selectedTags.length > 0 && (
                                <div className="flex mt-5">
                                    <div className="mt-3">
                                        Selected options: {selectedTags.join(", ")}
                                    </div>
                                    <button
                                        className="btn ml-5 btn-error"
                                        onClick={() => {
                                            setSelectedTags([])
                                            setValue('selectedTags', [])
                                        }}
                                    >
                                        Clear Selection
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex mt-7 gap-4">
                            <div className="flex flex-col w-1/2">
                                <label>Website (optional)</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register("website")}
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Contact Number (optional)</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register("contact")}
                                />
                            </div>
                        </div>
                        <div className="cover-photo">
                            <h2 className="mt-7">Add Cover Photo</h2>
                            {errors.imgUrl && <p className=" text-red-600">*{errors.imgUrl.message?.toString()}</p>}
                            <input
                                type="file"
                                className="file-input file-input-bordered w-full"
                                {...register("imgUrl", { required: "Cover photo is required" })}
                                onChange={handleFileChange}
                            />
                        </div>
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
                            <button className="btn btn-primary w-full">Submit</button>
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
                    <span className='label flex items-center text-sm font-medium text-black'>
                        Show Preview
                    </span>
                </label>
                {isChecked && (
                    <div ref={previewCardRef} style={{ width: '50%' }}>

                        <PreviewCard
                            imgUrl={previewUrl}
                            name={watch().name}
                            suburb={watch().suburb}
                            state={watch().state}
                            postcode={watch().postcode}
                            address={watch().address}
                            type={watch().type}
                            products={watch().selectedTags?.join(', ')}
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
        </div >
    )
}
