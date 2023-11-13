import { useState } from "react";

type CardProps = {
    imgUrl: string,
    name: string,
    suburb: string,
    state: string,
    postcode: number,
    address: string,
    type: string,
    products: string,
    description: string,
    openingHours: string,
    deliveryMethod: string,
    website: string,
    contact: string
}

export function Card({ imgUrl, name, suburb, state, postcode, address, type, products, description, openingHours, deliveryMethod, website, contact }: CardProps) {
    const maxDescriptionHeight = 80; // Set your desired max height in pixels
    const [showFullDescription, setShowFullDescription] = useState(false);

    const truncatedDescription = description.slice(0, maxDescriptionHeight);
    const shouldShowSeeMoreButton = description.length > maxDescriptionHeight;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    console.log(website);

    return (

        <div className="card card-compact w-80 bg-base-100 shadow-xl p-4">
            <figure><img src={imgUrl} alt="Shoes" /></figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <h2 className=" text-blue-600 font-semibold">{suburb}, {state} {postcode}</h2>
                <h3 className=" font-light font">{address}</h3>

                <h2 className=" font-bold mt-4 mb-3 text-b">{type}</h2>

                <p className="mb-4">{products}</p>

                <p className={`mb-4 ${showFullDescription ? '' : 'line-clamp-4'}`}>
                    {showFullDescription ? description : truncatedDescription}
                    {shouldShowSeeMoreButton && (
                        <button className="text-blue-500 hover:underline" onClick={toggleDescription}>
                            {showFullDescription ? 'See Less' : 'See More'}
                        </button>
                    )}
                </p>

                <p className=" mb-4 italic">{openingHours}</p>
                <p >{deliveryMethod}</p>
                <div className="card-actions mt-5">
                    {/* {contact.length > 0 && <button className="btn btn-primary">Contact</button>} */}
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
        </div>

    )
}
