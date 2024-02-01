import { useEffect, useState } from "react";
import DispOpeningHours from "./Opening-Hours/DispOpeningHours";
import { CardProps } from "../Types";

export function PreviewCard({ imgUrl, name, suburb, state, postcode, address, type, products, description, openingHours, contact, pickUp, delivery, dineIn }: CardProps) {
    const maxDescriptionHeight = 80; // Set your desired max height in pixels
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<boolean>(false)

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
    const buttonEl = () => {
        return (
            <>
                {shouldShowSeeMoreButton && (
                    <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                        {showFullDescription ? 'See Less' : 'See More'}
                    </button>
                )}
            </>)
    }

    return (

        <div className="card card-compact w-72 bg-base-100 shadow-xl">
            <img src={imgUrl ? imgUrl : "/images/placeholder.jpeg"} alt="Cover Image" style={{ width: '288px', height: '211.13px' }} />
            <div className="card-body p-4">
                <h2 className="card-title">{name?.length > 0 ? name : 'Business Name'}</h2>
                <h2 className=" text-blue-600 font-semibold">{suburb?.length > 0 ? suburb : `Suburb`}, {state?.length > 0 ? state : "State"}, {postcode?.length > 0 ? postcode : "Postcode"}</h2>
                <h3 className=" font-light font">{address?.length > 0 ? address : "Street Address"}</h3>

                <h2 className=" font-bold mt-4 mb-3 text-b">{type?.length > 0 ? type : "Type of business"}</h2>

                <p className="mb-4">{products?.length > 0 ? products : "Products offered"}</p>

                {description?.length > 0 ? (
                    <>
                        <p className={` ${showFullDescription ? '' : 'line-clamp-4'}`}>
                            <span dangerouslySetInnerHTML={{ __html: showFullDescription ? description.replace(/\n/g, '<br>') : truncatedDescription.replace(/\n/g, '<br>') }} />
                        </p>
                        {buttonEl()}
                    </>
                ) : <p>Description of your business</p>}


                <DispOpeningHours openingHours={openingHours} />
                {!deliveryMethod ? <p >Delivery methods</p>
                    :
                    <p>{[pickUp && "Pick-Up", delivery && "Delivery", dineIn && "Dine-In"].filter(Boolean).join(", ")}</p>
                }


                <div className="card-actions mt-5">
                    <div>
                        <label>Contact: </label>
                        <p>{contact?.length > 0 ? contact : "Contact Number"}</p>
                    </div>

                    <button className="btn btn-primary">Visit Website</button>

                </div>
            </div>
        </div>

    )
}
