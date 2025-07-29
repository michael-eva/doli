import { useEffect, useState } from "react"
import CustomModal from "../components/Modals/CustomModal"
import { useForm } from "react-hook-form"
import { getCombinedData } from "./utils/getCombinedData"
import { sendVerification, sendRejection } from "./utils/resend"
import { rejectArtist, validateArtist } from "./utils/utils"
import ArtistValidationCard from "../components/ArtistValidationCard"

type ArtistProps = {
    id: string,
    name: string,
    admin_one_email: string,
    admin_two_email?: string,
    image_url: string,
    type: string,
    music_type?: string,
    genre?: string,
    about: string,
    is_verified?: boolean,
    is_rejected?: boolean,
    itemType: 'artist',
    postId: string,
    email: string,
    [key: string]: any;
}

export default function ValidateArtists() {
    const [artists, setArtists] = useState<ArtistProps[]>([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [artistId, setArtistId] = useState<string>("")
    const { register, handleSubmit, formState: { errors } } = useForm()

    async function getData() {
        const artists: any = await getCombinedData('artist')
        setArtists(artists)
    }
    
    useEffect(() => {
        getData()
    }, [])
    
    async function handleAcceptSubmit(artistId: string) {
        const artist = artists.find(artist => artist.id === artistId)
        const userEmail = artist?.admin_one_email
        
        const isSent = await validateArtist(artistId)
        if (!isSent) return
        sendVerification(userEmail)
        getData()
    }
    
    async function handleReject(artistId: string) {
        setShowModal(true)
        setArtistId(artistId)
    }
    
    async function onRejectSubmit(data: any) {
        const artist = artists.find(artist => artist.id === artistId)
        const userEmail = artist?.admin_one_email
        
        const isSent = await rejectArtist(artistId)
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
                        placeholder="Please provide a clear reason for rejecting this artist registration..."
                        {...register("reason", { required: "Please enter a reason why it's being rejected." })}
                    ></textarea>
                    <button className="btn btn-success" >Submit</button>
                </form>
            </CustomModal>
        )
    }

    return (
        <>
            <div className="flex justify-center gap-10 mb-6">
                <h1 className="text-3xl font-bold">Artist Registration Validations</h1>
            </div>
            <div className="flex justify-center gap-10">
                {artists.length > 0 ? `${artists.length} artist registrations to validate` : <h1 className="text-xl italic">No artist registrations to be validated</h1>}
            </div>
            <div className="max-w-7xl m-auto">
                <div className="flex flex-wrap justify-evenly h-full">
                    {artists.map((artist: ArtistProps) => {
                        return (
                            <div key={artist.id} className="mt-10">
                                <ArtistValidationCard 
                                    {...artist}
                                    handleSubmit={handleAcceptSubmit} 
                                    handleReject={handleReject} 
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            {showModal && modalEl()}
        </>
    )
}