import { useEffect, useState } from "react";
import DispOpeningHours from "./Opening-Hours/DispOpeningHours";
import { CardProps } from "../Types";
import { HiBuildingStorefront } from "react-icons/hi2";
import RatingComp from "./Rating/Rating";
import { FaInfoCircle, FaPhone } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { PiBowlFoodFill } from "react-icons/pi";
import { CiLink } from "react-icons/ci";

export function PreviewCard({ imgUrl, name, suburb, state, postcode, address, type, products, description, openingHours, contact, pickUp, delivery, dineIn }: CardProps) {
    const maxDescriptionHeight = 160; // Set your desired max height in pixels
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<boolean>(false)
    const [showOpeningHours, setShowOpeningHours] = useState<boolean>(false)
    const truncatedDescription = description?.slice(0, maxDescriptionHeight);
    const shouldShowSeeMoreButton = description?.length > maxDescriptionHeight;


    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    useEffect(() => {
        if (delivery || pickUp || dineIn) {
            setDeliveryMethod(true)
        } else {
            setDeliveryMethod(false)
        }
    }, [dineIn, delivery, pickUp])
    return (

        <div className="card card-compact w-72 bg-base-100 shadow-xl">
            <img src={imgUrl ? imgUrl : "/images/placeholder.jpeg"} alt="Cover Image" style={{ width: '288px', height: '211.13px' }} className="w-full h-full object-contain" />
            <div className="card-body p-4">
                <h2 className="card-title">{name?.length > 0 ? name : 'Business Name'}</h2>
                <h2 className=" text-blue-600">{suburb?.length > 0 ? suburb : `Suburb`}, {state?.length > 0 ? state : "State"}, {postcode?.length > 0 ? postcode : "Postcode"}</h2>
                <h3 className="">{address?.length > 0 ? address : "Street Address"}</h3>


                <div className=" flex gap-3 mt-3 -mb-3">
                    <span className="mt-0.5">
                        <HiBuildingStorefront />
                    </span>
                    <span className=" flex">
                        <h2 className=" font-bold">{type?.length > 0 ? type : "Type of business"} - <span className=" font-normal">{products?.length > 0 ? products : "Products offered"}</span></h2>
                        {/* <h2 className="font-bold">{props.type} - <span className=" font-normal">{selectedTags()}</span></h2> */}
                    </span>
                </div>
                <RatingComp />
                {/* <p className="mb-4">{products?.length > 0 ? products : "Products offered"}</p> */}
                {description?.length > 0 ? (
                    <>
                        <p className={` ${showFullDescription ? '' : 'line-clamp-4'} flex gap-3`}>
                            <span className="mt-1 font-extrabold ">
                                <FaInfoCircle />
                            </span>
                            <span dangerouslySetInnerHTML={{ __html: showFullDescription ? description.replace(/\n/g, '<br>') : truncatedDescription.replace(/\n/g, '<br>') }} />
                        </p>
                        {shouldShowSeeMoreButton && (
                            <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                                {showFullDescription ? 'See Less' : 'See More'}
                            </button>
                        )}
                    </>
                ) :
                    <div className=" flex gap-3">
                        <span className="mt-1 font-extrabold ">
                            <FaInfoCircle />
                        </span>
                        <p>Description of your business</p>
                    </div>}
                <div className=" flex gap-3 items-center">
                    <div className="flex items-center gap-3">
                        <FaClock />
                        <p className=" text-md">Opening hours:</p>
                    </div>
                    <p className=" text-xs text-blue-600 underline italic cursor-pointer" onClick={() => setShowOpeningHours(!showOpeningHours)}>Show</p>
                </div>
                {showOpeningHours && <DispOpeningHours openingHours={openingHours} />}
                {/* <DispOpeningHours openingHours={openingHours} /> */}
                {!deliveryMethod ?
                    <div className="flex items-center gap-3">
                        <span className="text-lg -ml-0.5">
                            <PiBowlFoodFill />
                        </span>
                        <p >Delivery methods</p>
                    </div>
                    :
                    <div className="flex items-center gap-3">
                        <span className="text-lg -ml-0.5">
                            <PiBowlFoodFill />
                        </span>
                        <p>{[pickUp && "Pick-Up", delivery && "Delivery", dineIn && "Dine-In"].filter(Boolean).join(", ")}</p>
                    </div>
                }


                <div className="flex mt-4 gap-1 flex-col">
                    <div className="flex items-center gap-4">
                        {/* <label>Contact: </label> */}
                        <FaPhone />
                        <p className="text-blue-600">{contact?.length > 0 ? contact : "Contact Number"}</p>
                    </div>

                    {/* <button className="btn btn-primary">Visit Website</button> */}
                    <div className="flex items-center text-blue-600 gap-3">
                        <span className=" text-xl text-black font-extrabold">
                            <CiLink />
                        </span>
                        <span>
                            Visit Website
                        </span>
                    </div>
                </div>
            </div>
        </div >

    )
}
