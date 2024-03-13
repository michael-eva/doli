import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { Card } from "../components/Card"
import CustomModal from "../components/Modals/CustomModal"
import { useForm } from "react-hook-form"
import { getCombinedData } from "./utils/getCombinedData"
import { sendVerification, sendRejection } from "./utils/resend"
import { rejectPost, validatePost } from "./utils/utils"
type CardProps = {
    locationData: {
        altCountry: string,
        altFormatted_address: string,
        altPostcode: string,
        altState: string,
        altSuburb: string,
        coordinates: {
            latitude: number,
            longitude: number,
        },
        country: string,
        formatted_address: string,
        state: string,
        suburb: string,
        streetAddress: string,
        postcode: string
    },
    id: string,
    postId: string,
    imgUrl: string | null,
    name: string,
    locality: string,
    state: string,
    postcode: string,
    address: string,
    type: string,
    selectedTags: [{
        value: string,
        label: string
    }],
    description: string,
    openingHours: [{
        id: string,
        day: string,
        isOpen: string,
        fromTime: string,
        toTime: string
    }],
    pickUp: boolean,
    delivery: boolean,
    dineIn: boolean,
    contact: string,
    website: string,
    [key: string]: any;
}
export default function Validation() {
    const [posts, setPosts] = useState<CardProps[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [postId, setPostId] = useState<string>("")
    const { register, handleSubmit, formState: { errors } } = useForm()

    async function getData() {
        const post = await getCombinedData()
        setPosts(post)
    }
    useEffect(() => {
        getData()
    }, [])
    async function handleAcceptSubmit(postId: string) {
        const post = posts.find(post => post.postId === postId)
        const userEmail = post?.email
        const isSent = await validatePost(postId)
        if (!isSent) return
        sendVerification(userEmail)
        getData()
    }
    async function handleReject(postId: string) {
        setShowModal(true)
        setPostId(postId)
    }
    async function onRejectSubmit(data: any) {
        const post = posts.find(post => post.postId === postId)
        const userEmail = post?.email
        const isSent = await rejectPost(postId)
        if (!isSent) return
        getData()
        sendRejection(userEmail, data.reason)
        setShowModal(false)
    };
    function modalEl() {
        return (
            <CustomModal setShowModal={setShowModal}>
                <header>
                    <p className="text-xl font-bold">Enter reason for rejection:</p>
                </header>
                {errors.reason && (
                    <p className=" text-red-600">*{errors.reason.message?.toString()}</p>
                )}
                <form onSubmit={handleSubmit(onRejectSubmit)} className="pt-5">
                    <textarea
                        className="textarea textarea-bordered w-full"
                        style={{ height: "80px" }}
                        {...register("reason", { required: "Please enter a reason why it's being rejected." })}
                    ></textarea>
                    <button className="btn btn-success" >Submit</button>
                    {/* <button className="btn btn-success" onSubmit={() => sendRejection("evamichael100@gmail.com", `${reason}`)}>Submit</button> */}
                </form>
            </CustomModal>
        )
    }

    return (
        <>
            <div className=" flex justify-center gap-10">
                {posts.length > 0 ? posts.length : <h1 className=" text-xl italic">No posts to be validated</h1>}
            </div>
            <div className=" max-w-7xl m-auto">
                <div className="flex flex-wrap justify-evenly h-full">
                    {posts.map((item: CardProps) => {
                        return (
                            <div key={item.postId} className="mt-10">
                                <Card {...item} isJod={true} handleSubmit={handleAcceptSubmit} handleReject={handleReject} />
                            </div>
                        );
                    })}
                </div>
            </div>
            {showModal && modalEl()}
        </>
    )

}
