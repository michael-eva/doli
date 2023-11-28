import { useState, ChangeEvent } from "react"
import tags from '../data/tags.ts'
import { useUser } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import businessType from "../data/businessTypes.json"
import { useForm } from "react-hook-form"
import supabase from "../config/supabaseClient.ts";

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
    const { register, handleSubmit, watch } = useForm();
    const user = useUser();
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const CDNUrl = (imgPath: imgPath) => {
        return `https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/cover_images/` + imgPath.path
    }

    const handleTagChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        const isOptionSelected = selectedTags.includes(selectedOptions[0]);

        setSelectedTags((prev) => {
            if (isOptionSelected) {
                return prev.filter((tag) => tag !== selectedOptions[0]);
            }
            if (prev.length + selectedOptions.length <= 5) {
                return [...prev, ...selectedOptions];
            } else {
                const remainingSlots = 5 - prev.length;
                return [...prev, ...selectedOptions.slice(0, remainingSlots)];
            }
        });
    };
    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleFormSubmit = async (formData: FormData) => {
        try {
            const { error: insertError } = await supabase.from('posts').insert({ ...formData, postId: nanoid(), id: user?.id });

            if (insertError) {
                console.error('Error inserting post:', insertError);
                return;
            }
            if (selectedFile) {
                const { data: imageData, error: imageError } = await supabase.storage
                    .from('cover_images')
                    .upload(user?.id + '/' + nanoid(), selectedFile);

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

    }

    return (
        <form onSubmit={handleSubmit((data) => handleFormSubmit(data as FormData))}>
            <div className="max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10">
                <header className="mb-7">
                    <h1 className=" text-xl font-bold ">Profile</h1>
                    <p>This information will be displayed publicly.</p>
                </header>
                <div className="flex flex-col mb-5">
                    <label htmlFor="">Business Name</label>
                    <input
                        type="text"
                        className="input input-bordered w-full max-w-xs"
                        {...register("name")}
                    />
                </div>
                <div className="flex flex-col mb-5">
                    <label> Select Type:</label>
                    <select
                        className="select select-bordered w-full max-w-xs"
                        {...register("type")}
                        defaultValue="Select Type"
                    >
                        <option disabled>Select Type</option>
                        {businessType.map(item => (
                            <option key={nanoid()}>{item}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col mb-5">
                    <h2>About</h2>
                    <textarea
                        className="textarea textarea-bordered w-full "
                        placeholder="Write a few detailed sentences about your business."
                        {...register("description")}
                    >
                    </textarea>
                </div>
                <div className="flex flex-col mb-5 ">
                    <p >Delivery Method</p>
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
                    <input
                        placeholder="eg Mon-Fri 9am-5pm"
                        type="text"
                        className="input input-bordered w-full max-w-xs "
                        {...register("openingHours")}
                    />
                </div>
                <div className="flex flex-col mb-5">
                    <label>Choose up to 5 options:</label>
                    <select
                        multiple
                        {...register('selectedTags')}
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
                                onClick={() => setSelectedTags([])}
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
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full max-w-xs"
                        {...register("imgUrl")}
                        onChange={handleFileChange}
                    />
                </div>
                <div className="divider"></div>
                <h2>Street Address</h2>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    {...register("address")}
                />
                <div className="container flex gap-2 mt-7">
                    <div className="flex flex-col">
                        <label>Suburb</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("suburb")}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>State</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("state")}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>Postcode</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("postcode")}
                        />
                    </div>
                </div>
                <div className=" flex gap-2 mt-7">
                    <button className="btn btn-primary w-full">Submit</button>
                </div>
            </div>
        </form >
    )
}
