import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import DeleteModal from "./Modals/DeleteModal";
import Toggle from "./Toggle/Toggle";
import ToggleOn from "./Toggle/ToggleOn";
import ToggleButton from "./Toggle/ToggleButton";
import { useNavigate } from "react-router";
import RatingComp from "./Rating/Rating";
import DispOpeningHours from "./Opening-Hours/DispOpeningHours";
import { useMediaQuery } from "react-responsive";
import { CardProps } from "../Types";
import { HiBuildingStorefront } from "react-icons/hi2";
import { FaInfoCircle } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { FaClock } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { PiBowlFoodFill } from "react-icons/pi";
import { CiLink } from "react-icons/ci";



export function Card({ handleSubmit, ...props }: CardProps) {
    // export function Card({ isVerified, handleSubmit, isJod, onDelete, postId, id, imgUrl, name, locationData, type, selectedTags, description, openingHours, contact, pickUp, delivery, dineIn, website }: CardProps) {

    const maxDescriptionHeight = 160;
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const [showOpeningHours, setShowOpeningHours] = useState<boolean>(false)
    const user = useUser()
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const truncatedDescription = props.description.slice(0, maxDescriptionHeight);
    const shouldShowSeeMoreButton = props.description.length > maxDescriptionHeight;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    const isManageListingsPage = location.pathname === '/manage-listings'
    const badgePicker = () => {
        if (props.isVerified) {
            return <div className="badge badge-success badge-outline">Verified</div>
        } else {
            return <div className="badge badge-warning badge-outline">Pending Verification</div>
        }
    }

    const navigate = useNavigate()

    const handleEditSubmit = (postId: string) => {
        navigate(`/edit-post/${postId}`)
    }
    const selectedTags = () => {
        if (props.selectedTags && props.selectedTags.length > 0) {
            return <span className="">{props.selectedTags.map(tag => tag?.label).join(', ')}</span>
        }

    }
    return (
        <div className="card card-compact bg-white shadow-xl " style={!isMobile ? { width: '300px' } : { width: "330px" }}>

            < img src={`${props.imgUrl}?${new Date().getTime()}`} alt="Cover Image" style={{ height: '225px' }} className=" rounded-t-lg" />
            <div className="card-body p-4">

                {isManageListingsPage && badgePicker()}

                <h2 className="card-title">{props.name}</h2>
                <h2 className="text-blue-600 font-semibold">{props.locationData?.suburb}, {props.locationData?.state} {props.locationData?.postcode}</h2>
                <h3 className="">{props.locationData?.streetAddress}</h3>



                <div className=" flex gap-3 mt-3 -mb-3">
                    <span className="mt-0.5">
                        <HiBuildingStorefront />
                    </span>
                    <span className=" flex">
                        <h2 className="font-bold">{props.type} - <span className=" font-normal">{selectedTags()}</span></h2>
                    </span>
                </div>
                <RatingComp name={props.name} postId={props.postId!} user={user} coordinates={props.locationData?.coordinates} />

                <p className={`${showFullDescription ? '' : 'line-clamp-4'} flex gap-3`}>
                    <span className="mt-1 font-extrabold ">
                        <FaInfoCircle />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: showFullDescription ? props.description.replace(/\n/g, '<br>') : truncatedDescription.replace(/\n/g, '<br>') }} />
                </p>

                {shouldShowSeeMoreButton && (
                    <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                        {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                )}

                {/* <RatingComp name={props.name} postId={props.postId!} user={user} coordinates={props.locationData?.coordinates} /> */}

                <div className=" flex gap-3 items-center">
                    <div className="flex items-center gap-3 ml-0.5">
                        <FaClock />
                        <p className=" text-md">Opening hours:</p>
                    </div>
                    <p className=" text-xs text-blue-600 underline italic cursor-pointer" onClick={() => setShowOpeningHours(!showOpeningHours)}>Show</p>
                </div>
                {showOpeningHours && <DispOpeningHours openingHours={props.openingHours!} />}
                <div className=" flex items-center gap-3">
                    <span className="text-lg">
                        <PiBowlFoodFill />
                    </span>
                    <p className="">{[props.pickUp && "Pick-Up", props.delivery && "Delivery", props.dineIn && "Dine-In"].filter(Boolean).join(", ")}</p>
                </div>

                <div className=" flex mt-4 gap-1 flex-col">
                    {props.contact!.length > 0 &&
                        <div>
                            <span className="flex items-center gap-4">
                                <FaPhone />
                                {/* <label>Contact: </label> */}
                                <p className=" text-blue-600">{props.contact}</p>
                            </span>
                        </div>}
                    {props.website!.length > 0 && (
                        <a href={props.website!.startsWith('http') ? props.website : `http://${props.website}`} target="_blank" rel="noopener noreferrer" className=" flex items-center text-blue-600 gap-3">
                            <span className=" text-xl text-black font-extrabold">
                                <CiLink />
                            </span>
                            <span>
                                Visit Website
                            </span>
                        </a>
                    )}
                </div>
            </div>
            {
                (user?.id === props.id || user?.email === props.adminEmail) ? <div className="flex items-center justify-around bg-gray-100">
                    <button
                        onClick={() => handleEditSubmit(props.postId!)}
                        className="m-2 px-5 py-2 rounded-lg  bg-gray-400 text-xs hover:bg-gray-500 hover:text-white">
                        Edit
                    </button>

                    <Toggle>
                        <ToggleButton className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white">Delete</ToggleButton>
                        <ToggleOn>
                            <DeleteModal title="Delete Post" btnText="Delete" clickFunction={props.onDelete} id={props.postId!}>Are you sure you want to delete this listing? </DeleteModal>
                        </ToggleOn>
                    </Toggle>
                </div> : null
            }
            {
                props.isJod && <div className="flex items-center justify-around bg-gray-100">
                    <button
                        className=" m-2 px-5 py-2 rounded-lg bg-green-400 text-xs hover:bg-gray-500 hover:text-white"
                        onClick={() => handleSubmit(props.postId)}
                    >Verify</button>
                    <button className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white">Reject</button>

                </div>
            }
        </div >
    )
}
