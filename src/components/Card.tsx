import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import DeleteModal from "./Modals/DeleteModal";
import Toggle from "./Toggle/Toggle";
import ToggleOn from "./Toggle/ToggleOn";
import ToggleButton from "./Toggle/ToggleButton";
import { useNavigate } from "react-router";
import RatingComp from "./Rating/Rating";


type CardProps = {
    handleEditSubmit?: any
    onDelete?: any
    handleSubmit?: any,
    postId: string,
    id: string,
    imgUrl: string | null,
    name: string,
    suburb: string,
    state: string,
    postcode: string,
    address: string,
    type: string,
    selectedTags?: [{
        value: string,
        label: string
    }] | undefined,
    description: string,
    openingHours: [{
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
    isJod?: boolean
    showStatus?: boolean
    isVerified?: boolean,
}



export function Card({ isVerified, handleSubmit, isJod, onDelete, postId, id, imgUrl, name, suburb, state, postcode, address, type, selectedTags, description, openingHours, contact, pickUp, delivery, dineIn, website }: CardProps) {
    const maxDescriptionHeight = 80;
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const user = useUser()
    console.log(selectedTags);

    const truncatedDescription = description.slice(0, maxDescriptionHeight);
    const shouldShowSeeMoreButton = description.length > maxDescriptionHeight;

    const openDays = openingHours.filter((item: { isOpen: string; }) => (
        item.isOpen === 'open'
    ))

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    const isManageListingsPage = location.pathname === '/manage-listings'
    const badgePicker = () => {
        if (isVerified) {
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
        <div className="card card-compact bg-base-100 shadow-xl" style={{ width: '300px' }}>
            <img src={`${imgUrl}?${new Date().getTime()}`} alt="Cover Image" style={{ height: '225px' }} className=" rounded-t-lg" />
            <div className="card-body p-4">

                {isManageListingsPage && badgePicker()}

                <h2 className="card-title">{name}</h2>
                <h2 className="text-blue-600 font-semibold">{suburb}, {state} {postcode}</h2>
                <h3 className="font-light">{address}</h3>



                <h2 className="font-bold mt-4 mb-3">{type}</h2>

                {selectedTags && selectedTags.length > 0 &&
                    <div className="mb-3">
                        <p>{selectedTags.map(tag => tag?.label).join(', ')}</p>
                    </div>
                }
                <p className={` ${showFullDescription ? '' : 'line-clamp-4'}`}>
                    <span dangerouslySetInnerHTML={{ __html: showFullDescription ? description.replace(/\n/g, '<br>') : truncatedDescription.replace(/\n/g, '<br>') }} />
                </p>

                {shouldShowSeeMoreButton && (
                    <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                        {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                )}
                <div className="pb-3">
                    <RatingComp name={name} postId={postId} user={user} />
                </div>
                <p className=" text-md font-bold">Operating hours:</p>
                {openDays?.map((item: { day: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; fromTime: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; toTime: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => {
                    return (
                        <div className="flex">
                            <p className=" italic">
                                {item.day}
                            </p>
                            <p className=" italic">
                                {item.fromTime}
                            </p>
                            <p className=" italic">
                                {item.toTime}
                            </p>
                        </div>
                    )
                })}

                <p>{[pickUp && "Pick-Up", delivery && "Delivery", dineIn && "Dine-In"].filter(Boolean).join(", ")}</p>

                <div className="card-actions mt-5" style={{ height: '48px' }}>
                    {contact.length > 0 &&
                        <div>
                            <label>Contact: </label>
                            <p>{contact}</p>
                        </div>}
                    {website.length > 0 && (
                        <a href={website.startsWith('http') ? website : `http://${website}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            Visit Website
                        </a>
                    )}
                </div>
            </div>
            {
                user?.id === id ? <div className="flex items-center justify-around bg-gray-100">
                    <button
                        onClick={() => handleEditSubmit(postId)}
                        className="m-2 px-5 py-2 rounded-lg  bg-gray-400 text-xs hover:bg-gray-500 hover:text-white">
                        Edit
                    </button>

                    <Toggle>
                        <ToggleButton className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white">Delete</ToggleButton>
                        <ToggleOn>
                            <DeleteModal title="Delete Post" btnText="Delete" clickFunction={onDelete} id={postId}>Are you sure you want to delete this listing? </DeleteModal>
                        </ToggleOn>
                    </Toggle>
                </div> : null
            }
            {isJod && <div className="flex items-center justify-around bg-gray-100">
                <button
                    className=" m-2 px-5 py-2 rounded-lg bg-green-400 text-xs hover:bg-gray-500 hover:text-white"
                    onClick={() => handleSubmit(postId)}
                >Verify</button>
                <button className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white">Reject</button>

            </div>}
        </div>
    )
}
