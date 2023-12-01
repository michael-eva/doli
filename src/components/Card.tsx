import { useState } from "react";

type CardProps = {
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

export function Card({ imgUrl, name, suburb, state, postcode, address, type, selectedTags, description, openingHours, contact, pickUp, delivery, dineIn, website }: CardProps) {
    const maxDescriptionHeight = 80;
    const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

    const truncatedDescription = description.slice(0, maxDescriptionHeight);
    const shouldShowSeeMoreButton = description.length > maxDescriptionHeight;

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div className="card card-compact w-72 bg-base-100 shadow-xl">
            <img src={imgUrl!} alt="Cover Image" style={{ width: '288px', height: '211.13px' }} />
            <div className="card-body p-4">
                <h2 className="card-title">{name}</h2>
                <h2 className="text-blue-600 font-semibold">{suburb}, {state} {postcode}</h2>
                <h3 className="font-light">{address}</h3>

                <h2 className="font-bold mt-4 mb-3 text-b">{type}</h2>

                {selectedTags && selectedTags.length > 0 &&
                    <div className="mb-4">
                        <p>{selectedTags.join(', ')}</p>
                    </div>
                }

                <p className={`mb-4 ${showFullDescription ? '' : 'line-clamp-4'}`}>
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
                <div className="card-actions mt-5">
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
