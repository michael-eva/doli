import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useUser } from "@supabase/auth-helpers-react";
import { nanoid } from "nanoid";

export default function ImageUpload({ postId }) {
    // const [selectedFile, setSelectedFile] = useState(null)
    const [url, setUrl] = useState()
    const [images, setImages] = useState([])
    const user = useUser()

    console.log("IMG upload post ID:", postId);


    const CDNUrl = (imgPath) => {
        return `https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/cover_images/` + imgPath.path
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    useEffect(() => {
        const uploadUrl = async () => {
            const { error } = await supabase
                .from("members")
                .update({ imgUrl: url })
                .eq('id', user?.id)
                .single()
        }
        uploadUrl()
    }, [url])

    // const handleUpload = async () => {
    //     if (selectedFile) {
    //         const { data, error } = await supabase.storage
    //             .from("cover_images")
    //             .upload(user?.id + "/" + nanoid(), selectedFile)
    //         if (data) {
    //             setUrl(CDNUrl(data))
    //         } else {
    //             console.log(error);

    //         }
    //     }
    // }

    return (
        <>
            {/* <h2 className="mt-7">Add Cover Photo</h2> */}
            {/* <div className="flex items-center justify-center w-full mb-7">
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
            </div> */}
            {/* <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChange} />
            <button onClick={handleUpload} className="btn ">Submit</button> */}
        </>
    )
}
