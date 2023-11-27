import { useState } from "react"
import tags from '../data/tags.ts'
import supabase from "../config/supabaseClient.ts";
import { useUser } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";
import businessType from "../data/businessTypes.json"

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
    deliveryMethod: string[];
    website: string;
    contact: string;
}
type imgPath = {
    path: string
}
export default function BusinessRegister() {
    const user = useUser()
    const [selectedFile, setSelectedFile] = useState(null)
    const postId = nanoid()
    const CDNUrl = (imgPath: imgPath) => {
        return `https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/cover_images/` + imgPath.path
    }
    const [formData, setFormData] = useState<FormData>({
        postId: postId,
        id: user?.id,
        imgUrl: "",
        name: "",
        suburb: "",
        state: "",
        postcode: "",
        address: "",
        type: "",
        selectedTags: [],
        description: "",
        openingHours: "",
        deliveryMethod: [],
        website: "",
        contact: ""
    })
    const [isChecked, setIsChecked] = useState({
        pickUp: false,
        delivery: false,
        dineIn: false
    });

    console.log(formData);



    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();

        try {
            const { error: insertError } = await supabase.from('posts').insert(formData);

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

            setFormData({
                postId: "",
                id: user?.id,
                imgUrl: "",
                name: "",
                suburb: "",
                state: "",
                postcode: "",
                address: "",
                type: "",
                selectedTags: [],
                description: "",
                openingHours: "",
                deliveryMethod: [],
                website: "",
                contact: ""
            });

        } catch (error) {
            console.error('Error handling submit:', error);
        }
    }

    function handleChange(e: { target: { name: string; value: string | string[]; }; }) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleCheckboxChange = (e: any) => {
        const { name, checked } = e.target;

        setIsChecked((prev) => ({
            ...prev,
            [name]: checked,
        }));

        setFormData((prev) => ({
            ...prev,
            deliveryMethod: checked
                ? [...prev.deliveryMethod, name]
                : prev.deliveryMethod.filter((method) => method !== name),
        }));
    };


    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = e.target.value;

        setFormData((prev) => {
            const isAlreadySelected = prev.selectedTags.includes(selectedOption);

            if (isAlreadySelected) {
                const updatedTags = prev.selectedTags.filter((tag) => tag !== selectedOption);
                return { ...prev, selectedTags: updatedTags };
            } else {
                const updatedTags = [...prev.selectedTags, selectedOption].slice(0, 5);
                return { ...prev, selectedTags: updatedTags };
            }
        });
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };


    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10">
                    <header className="mb-7">
                        <h1 className=" text-xl font-bold ">Profile</h1>
                        <p>This information will be displayed publicly.</p>
                    </header>
                    <div className="flex flex-col mb-5">
                        <label htmlFor="">Business Name</label>
                        <input
                            type="text"
                            name='name'
                            className="input input-bordered w-full max-w-xs"
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="flex flex-col mb-5">
                        <label> Select Type:</label>
                        <select
                            name="type"
                            className="select select-bordered w-full max-w-xs"
                            onChange={handleChange}
                            required
                        >
                            <option selected disabled>Select Type</option>
                            {businessType.map(item => (
                                <option>{item}</option>
                            ))}

                        </select>
                    </div>
                    <h2>About</h2>
                    <textarea
                        className="textarea textarea-bordered w-full "
                        placeholder="Write a few detailed sentences about your business."
                        onChange={handleChange}
                        name="description"
                        required
                    >
                    </textarea>

                    <div className="flex flex-col mb-5 mt-5">
                        <p >Delivery Method</p>
                        <div className="flex gap-3">
                            <div className="flex">
                                <input
                                    name="pickUp"
                                    type="checkbox"
                                    checked={isChecked.pickUp}
                                    className="checkbox checkbox-xs mr-2 mt-1"
                                    onChange={handleCheckboxChange} />
                                <label>Pick-Up</label>
                            </div>
                            <div className="flex">
                                <input
                                    name="delivery"
                                    type="checkbox"
                                    checked={isChecked.delivery}
                                    className="checkbox checkbox-xs mr-2 mt-1"
                                    onChange={handleCheckboxChange} />
                                <label>Delivery</label>
                            </div>
                            <div className="flex">
                                <input
                                    name="dineIn"
                                    type="checkbox"
                                    checked={isChecked.dineIn}
                                    className="checkbox checkbox-xs mr-2 mt-1"
                                    onChange={handleCheckboxChange} />
                                <label>Dine-In</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col mb-5 mt-5">
                        <label >Opening Hours</label>
                        <input
                            placeholder="eg Mon-Fri 9am-5pm"
                            type="text"
                            className="input input-bordered w-full max-w-xs "
                            onChange={handleChange}
                            name="openingHours"
                            required />
                    </div>

                    <div className="flex flex-col mb-5 mt-5">
                        <label>Choose up to 5 options:</label>
                        <select multiple value={formData.selectedTags} onChange={handleTagChange} className="select select-bordered"
                            required>
                            {tags.map((tag, index) => (
                                <option key={index} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                        {formData.selectedTags.length > 0 &&
                            <div className="flex mt-5">
                                <div className="mt-3">Selected options: {formData.selectedTags.join(', ')}</div>
                                <button className="btn ml-5 btn-error" onClick={() => setFormData(prev => ({ ...prev, selectedTags: [] }))}>Clear Selection</button>
                            </div>}
                    </div>

                    <div className="flex mt-7 gap-4">
                        <div className="flex flex-col w-1/2">
                            <label>Website (optional)</label>
                            <input
                                type="text"
                                className="input input-bordered "
                                onChange={handleChange}
                                name="website" />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label>Contact Number (optional)</label>
                            <input
                                type="text"
                                className="input input-bordered "
                                onChange={handleChange}
                                name="contact" />
                        </div>
                    </div>
                    <div className="cover-photo">
                        <h2 className="mt-7">Add Cover Photo</h2>
                        <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange}
                            required />
                    </div>
                    {/* <ImageUpload postId={postId} /> */}

                    <div className="divider"></div>
                    <h2>Street Address</h2>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        onChange={handleChange}
                        name="address"
                        required />

                    <div className="container flex gap-2 mt-7">
                        <div className="flex flex-col">
                            <label>Suburb</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                name="suburb"
                                required />
                        </div>
                        <div className="flex flex-col">
                            <label>State</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                name="state"
                                required />
                        </div>
                        <div className="flex flex-col">
                            <label>Postcode</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                name="postcode"
                                required />
                        </div>
                    </div>
                    <div className=" flex gap-2 mt-7">
                        <button className="btn btn-primary w-full">Submit</button>
                        {/* <button className=" rounded-md bg-red-600 w-1/3 hover:bg-red-800 text-white">Cancel</button> */}
                    </div>
                </div >
            </form >
        </>

    )
}
