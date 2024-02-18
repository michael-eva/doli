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

export function Card({ handleSubmit, ...props }: CardProps) {
    // export function Card({ isVerified, handleSubmit, isJod, onDelete, postId, id, imgUrl, name, locationData, type, selectedTags, description, openingHours, contact, pickUp, delivery, dineIn, website }: CardProps) {

    const maxDescriptionHeight = 80;
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
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

    return (
        <div className="card card-compact bg-white shadow-xl " style={!isMobile ? { width: '300px' } : { width: "330px" }}>

            < img src={`${props.imgUrl}?${new Date().getTime()}`} alt="Cover Image" style={{ height: '225px' }} className=" rounded-t-lg" />
            <div className="card-body p-4">

                {isManageListingsPage && badgePicker()}

                <h2 className="card-title">{props.name}</h2>
                <h2 className="text-blue-600 font-semibold">{props.locationData?.suburb}, {props.locationData?.state} {props.locationData?.postcode}</h2>
                <h3 className="font-light">{props.locationData?.streetAddress}</h3>



                <h2 className="font-bold mt-4 mb-3">{props.type}</h2>

                {props.selectedTags && props.selectedTags.length > 0 &&
                    <div className="mb-3">
                        <p>{props.selectedTags.map(tag => tag?.label).join(', ')}</p>
                    </div>
                }
                <p className={` ${showFullDescription ? '' : 'line-clamp-4'}`}>
                    <span dangerouslySetInnerHTML={{ __html: showFullDescription ? props.description.replace(/\n/g, '<br>') : truncatedDescription.replace(/\n/g, '<br>') }} />
                </p>

                {shouldShowSeeMoreButton && (
                    <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                        {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                )}
                <div className="pb-3">
                    <RatingComp name={props.name} postId={props.postId!} user={user} coordinates={props.locationData?.coordinates} />
                </div>
                <p className=" text-md font-bold">Operating hours:</p>
                <DispOpeningHours openingHours={props.openingHours!} />

                <p className=" mt-5">{[props.pickUp && "Pick-Up", props.delivery && "Delivery", props.dineIn && "Dine-In"].filter(Boolean).join(", ")}</p>

                <div className="card-actions mt-4" style={{ height: '48px' }}>
                    {props.contact!.length > 0 &&
                        <div>
                            <label>Contact: </label>
                            <p>{props.contact}</p>
                        </div>}
                    {props.website!.length > 0 && (
                        <a href={props.website!.startsWith('http') ? props.website : `http://${props.website}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            Visit Website
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
