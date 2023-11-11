export default function BusinessRegister() {

    return (
        <>
            <div className="max-w-3xl m-auto shadow-lg px-24">
                <header className="mb-7">
                    <h1 className=" text-lg font-bold ">Profile</h1>
                    <p>This information will be displayed publicly.</p>
                </header>
                <div className="flex flex-col mb-5">
                    <label htmlFor="">Business Name</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" />
                </div>
                <div className="flex flex-col mb-5">
                    <label >Business Type</label>
                    <input placeholder="Distillery, Restaurant, etc" type="text" className="input input-bordered w-full max-w-xs italic" />
                </div>
                <h2>About</h2>
                <textarea className="textarea textarea-bordered w-full italic" placeholder="Write a few detailed sentences about your business."></textarea>

                <div className="flex flex-col mb-5 mt-5">
                    <label >Opening Hours</label>
                    <input placeholder="eg Mon-Fri 9am-5pm" type="text" className="input input-bordered w-full max-w-xs italic" />
                </div>

                <div className="flex mt-7 gap-4">
                    <div className="flex flex-col w-1/2">
                        <label>Contact Email (optional)</label>
                        <input type="text" className="input input-bordered " />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label>Contact Number (optional)</label>
                        <input type="text" className="input input-bordered " />
                    </div>
                </div>

                <h2 className="mt-7">Add Cover Photo</h2>
                <div className="flex items-center justify-center w-full mb-7">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-white border-solid rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>
                <div className="divider"></div>
                <div className="flex flex-col mt-7 mb-7">
                    <label>Country</label>
                    <select className="select select-bordered w-full max-w-xs">
                        <option disabled selected>- Select Country -</option>
                        <option>Han Solo</option>
                        <option>Greedo</option>
                    </select>
                </div>
                <h2>Street Address</h2>
                <input type="text" className="input input-bordered w-full" />

                <div className="container flex gap-2 mt-7">
                    <div className="flex flex-col">
                        <label>Suburb</label>
                        <input type="text" className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label>State</label>
                        <input type="text" className="input input-bordered w-full" />
                    </div>
                    <div className="flex flex-col">
                        <label>Postcode</label>
                        <input type="text" className="input input-bordered w-full" />
                    </div>
                </div>
                <div className=" flex gap-2 mt-7">
                    <button className="btn btn-primary w-2/3">Submit</button>
                    <button className=" rounded-md bg-red-600 w-1/3 hover:bg-red-800 text-white">Cancel</button>
                </div>
            </div >
        </>

    )
}
