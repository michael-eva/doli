import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { Rating } from 'flowbite-react';
import SimpleModal from "./Modals/SimpleModal";
import DeleteModal from "./Modals/DeleteModal";
import Toggle from "./Toggle/Toggle";
import ToggleOn from "./Toggle/ToggleOn";
import ToggleButton from "./Toggle/ToggleButton";


type CardProps = {
    onDelete: any
    postId: string,
    id: string,
    imgUrl: string | null,
    name: string,
    suburb: string,
    state: string,
    postcode: string,
    address: string,
    type: string,
    selectedTags?: string[] | undefined,
    description: string,
    openingHours: string,
    pickUp: boolean,
    delivery: boolean,
    dineIn: boolean,
    contact: string,
    website: string,
}

export function Card({ onDelete, postId, id, imgUrl, name, suburb, state, postcode, address, type, selectedTags, description, openingHours, contact, pickUp, delivery, dineIn, website }: CardProps) {
    const maxDescriptionHeight = 80;
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
    const user = useUser()

    const truncatedDescription = description.slice(0, maxDescriptionHeight);
    const shouldShowSeeMoreButton = description.length > maxDescriptionHeight;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    return (
        <div className="card card-compact bg-base-100 shadow-xl" style={{ width: '300px' }}>
            <img src={imgUrl!} alt="Cover Image" style={{ height: '225px' }} className=" rounded-t-lg" />
            <div className="card-body p-4">
                <h2 className="card-title">{name}</h2>
                <h2 className="text-blue-600 font-semibold">{suburb}, {state} {postcode}</h2>
                <h3 className="font-light">{address}</h3>

                <h2 className="font-bold mt-4 mb-3 text-b">{type}</h2>

                {selectedTags && selectedTags.length > 0 &&
                    <div className="mb-4" style={{ height: '40px' }}>
                        <p>{selectedTags.join(', ')}</p>
                    </div>
                }

                <p className={`mb-4 ${showFullDescription ? '' : 'line-clamp-4'}`} style={{ minHeight: '80px' }}>
                    {showFullDescription ? (
                        <span dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br>') }} />
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: truncatedDescription.replace(/\n/g, '<br>') }} />
                    )}
                    {shouldShowSeeMoreButton && (
                        <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                            {showFullDescription ? 'See Less' : 'See More'}
                        </button>
                    )}
                </p>

                <p className="mb-4 italic">{openingHours}</p>
                <p>{[pickUp && "Pick-Up", delivery && "Delivery", dineIn && "Dine-In"].filter(Boolean).join(", ")}</p>
                <div className="rating flex flex-col mt-3">
                    <p className=" text-xs">Local rating:</p>
                    <Rating size="md">
                        <Rating.Star />
                        <Rating.Star />
                        <Rating.Star />
                        <Rating.Star />
                        <Rating.Star filled={false} />
                    </Rating>
                    <p className=" text-xs">Travellers rating:</p>
                    <Rating>
                        <Rating.Star />
                        <Rating.Star />
                        <Rating.Star />
                        <Rating.Star />
                        <Rating.Star filled={false} />
                    </Rating>
                </div>
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
                    {/* <button className=" m-2 px-5 py-2 rounded-lg  bg-gray-400 text-xs hover:bg-gray-500 hover:text-white" onClick={openModal}>Edit</button> */}
                    {/* <button className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white" onClick={openModal}>Delete</button> */}
                    {/* {isModalOpen && <SimpleModal closeModal={closeModal} title="Hello!"> This button is still under construction.</SimpleModal>} */}
                    {/* {isModalOpen && <DeleteModal closeModal={closeModal} clickFunction={onDelete} id={postId} btnText="Delete" title="Delete Post"> Are you sure you want to delete this listing? </DeleteModal>} */}
                    <Toggle>
                        <ToggleButton className=" m-2 px-5 py-2 rounded-lg  bg-gray-400 text-xs hover:bg-gray-500 hover:text-white">Edit</ToggleButton>
                        <ToggleOn>
                            <SimpleModal title="doli">This button is still under construction.</SimpleModal >
                        </ToggleOn>
                    </Toggle>

                    <Toggle>
                        <ToggleButton className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white">Delete</ToggleButton>
                        <ToggleOn>
                            <DeleteModal title="Delete Post" btnText="Delete" clickFunction={onDelete} id={postId}>Are you sure you want to delete this listing? </DeleteModal>
                        </ToggleOn>
                    </Toggle>
                </div> : null
            }
        </div>
    )
}
