import { useState } from "react"
import tags from '../data/tags.ts'


type FormData = {
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
export default function BusinessRegister() {

    const [formData, setFormData] = useState<FormData>({
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


    function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()
        console.log(formData);
        setFormData({
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

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="max-w-3xl m-auto shadow-lg px-24">
                    <header className="mb-7">
                        <h1 className=" text-lg font-bold ">Profile</h1>
                        <p>This information will be displayed publicly.</p>
                    </header>
                    <div className="flex flex-col mb-5">
                        <label htmlFor="">Business Name</label>
                        <input
                            type="text"
                            name='name'
                            className="input input-bordered w-full max-w-xs"
                            onChange={handleChange} />
                    </div>

                    <div className="flex flex-col mb-5">
                        <label >Business Type</label>
                        <input
                            name="type"
                            placeholder="Distillery, Restaurant, etc"
                            type="text"
                            className="input input-bordered w-full max-w-xs "
                            onChange={handleChange} />
                    </div>
                    <h2>About</h2>
                    <textarea
                        className="textarea textarea-bordered w-full "
                        placeholder="Write a few detailed sentences about your business."
                        onChange={handleChange}
                        name="description">
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
                            name="openingHours" />
                    </div>

                    <div className="flex flex-col mb-5 mt-5">
                        <label>Choose up to 5 options:</label>
                        <select multiple value={formData.selectedTags} onChange={handleTagChange} className="select select-bordered">
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

                    <h2 className="mt-7">Add Cover Photo</h2>
                    <div className="flex items-center justify-center w-full mb-7">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-white border-solid rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" name="imgUrl" />
                        </label>
                    </div>

                    <div className="divider"></div>
                    <h2>Street Address</h2>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        onChange={handleChange}
                        name="address" />

                    <div className="container flex gap-2 mt-7">
                        <div className="flex flex-col">
                            <label>Suburb</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                name="suburb" />
                        </div>
                        <div className="flex flex-col">
                            <label>State</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                name="state" />
                        </div>
                        <div className="flex flex-col">
                            <label>Postcode</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                onChange={handleChange}
                                name="postcode" />
                        </div>
                    </div>
                    <div className=" flex gap-2 mt-7">
                        <button className="btn btn-primary w-full">Submit</button>
                        {/* <button className=" rounded-md bg-red-600 w-1/3 hover:bg-red-800 text-white">Cancel</button> */}
                    </div>
                </div >
            </form>
        </>

    )
}
