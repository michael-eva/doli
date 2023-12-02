import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Rating } from 'flowbite-react';


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
                    <button className=" m-2 px-5 py-2 rounded-lg  bg-gray-400 text-xs hover:bg-gray-500 hover:text-white" onClick={() => document.getElementById('my_modal_2').showModal()}>Edit</button>
                    <button className=" m-2 px-5 py-2 rounded-lg  bg-red-400 text-xs hover:bg-red-500  hover:text-white" onClick={() => document.getElementById('my_modal_1').showModal()}>Delete</button>
                    <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Hello!</h3>
                            <p className="py-4">These buttons are still under construction</p>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <div className="flex items-center gap-2 ">
                                <div style={{ backgroundColor: 'pink', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaExclamationTriangle style={{ color: 'red', fontSize: '18px' }} />
                                </div>
                                <h3 className="font-bold text-lg"> Delete Post</h3>
                            </div>
                            <p className="py-4">Are you sure you want to delete this listing? </p>
                            <div className="modal-action">
                                <form method="dialog">
                                    <div className="flex gap-2">
                                        <button className="btn">Cancel</button>
                                        <button className="btn btn-error" onClick={() => onDelete(postId)}>Delete</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div> : null
            }
        </div >
    )
}
