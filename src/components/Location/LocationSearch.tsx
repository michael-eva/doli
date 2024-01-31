import { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, {
    getGeocode,
    Suggestion,
} from "use-places-autocomplete";
import { IoLocationOutline } from "react-icons/io5";

type PostData = {
    imgUrl: string;
    name: string;
    locationData: {
        formatted_address: string,
        postcode: string,
        state: string,
        country: string,
        suburb: string,
    }
    type: string;
    selectedTags: string[];
    description: string;
    openingHours: string;
    pickUp: boolean;
    delivery: boolean;
    dineIn: boolean;
    contact: string;
    website: string;
    isVerified: boolean;
    postId: string;
};
// type UserLocation = {
//     latitude: number;
//     longitude: number;
// };

type AddressComponent = {
    long_name: string;
    short_name: string;
    types: string[];
};
type AddressData = {
    address: string,
    suburb: string,
    postcode: string,
    country: string,
    state: string,
}
type LocationSearchProps = {
    onSelect?: (
        address: string,
        postcode: string,
        suburb: string,
        state: string,
        country: string,
        coordinates: any
    ) => void;
    postData?: PostData;
    fullAddress?: boolean;
    types: string[];
    placeholder: string;
    inputClear?: boolean,
    setInputClear?: any,
    infoModal?: any
    suburbAndPostcode: boolean
    signUpData?: AddressData,
    includeNearby?: boolean
};

export default function LocationSearch({
    onSelect,
    signUpData,
    postData,
    types,
    placeholder,
    inputClear,
    setInputClear,
    suburbAndPostcode,
}: LocationSearchProps) {
    // const [userLocation, setUserLocation] = useState<UserLocation>({
    //     latitude: 0,
    //     longitude: 0,
    // });
    const [postcode, setPostcode] = useState<string>("");
    // useEffect(() => {
    //     if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 setUserLocation({ latitude, longitude });
    //             },
    //             (error) => {
    //                 console.error("Error getting user location:", error.message);
    //             }
    //         );
    //     } else {
    //         console.error("Geolocation is not supported by your browser.");
    //     }
    // }, []);

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete(
        {
            callbackName: "initMap",
            requestOptions: {
                // locationBias: new google.maps.Circle({
                //     center: new google.maps.LatLng(0, 0),
                //     radius: 20000
                // }),
                componentRestrictions: {
                    country: ["au",]
                },
                types: types,
            },
            debounce: 300,
        }
    );

    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        setValue(e.target.value);
    };
    useEffect(() => {
        if (inputClear) {
            setValue("")
            setInputClear(false)
        }
    }, [inputClear])

    const handleSelect = (suggestion: Suggestion) => () => {

        setValue(suggestion.description, false);
        clearSuggestions();

        getGeocode({ address: suggestion.description }).then((results) => {
            const firstResult = results[0];
            const { lat, lng } = firstResult.geometry.location;

            const addressComponents: AddressComponent[] =
                results[0].address_components;

            const postalCodeComponent = addressComponents.find(
                (component: AddressComponent) =>
                    component.types.includes("postal_code")
            );
            setPostcode(postalCodeComponent?.long_name || "");

            const suburbComponent = addressComponents.find(
                (component: AddressComponent) => component.types.includes("locality")
            );

            const stateComponent = addressComponents.find(
                (component: AddressComponent) =>
                    component.types.includes("administrative_area_level_1")
            );

            const countryComponent = addressComponents.find(
                (component: AddressComponent) => component.types.includes("country")
            );
            if (onSelect) {
                onSelect(
                    suggestion.description,
                    postalCodeComponent ? postalCodeComponent.long_name : "",
                    suburbComponent ? suburbComponent.long_name : "",
                    stateComponent ? stateComponent?.short_name : "",
                    countryComponent ? countryComponent?.long_name : "",
                    { latitude: lat(), longitude: lng() } // Include coordinates in the onSelect callback
                );
            }

        });
    };
    //This function is to stop the dropdown auto appearing when there is data in being pushed to the components.
    const displaySuggestions = () => {
        if (status === "OK") {
            if (postData === undefined) {
                if (!signUpData) {
                    return (
                        <ul className=" border-2 border-gray-300 rounded-md bg-gray-50">{renderSuggestions()}</ul>
                    )
                }
            }
            if (postData && postData?.locationData?.formatted_address != value) {
                return (
                    <ul className=" border-2 border-gray-300 rounded-md bg-gray-50">{renderSuggestions()}</ul>
                )
            }
            if (signUpData && signUpData.address != value) {
                return (
                    <ul className=" border-2 border-gray-300 rounded-md bg-gray-50">{renderSuggestions()}</ul>
                )
            }
        }
    }

    const renderSuggestions = () =>
        data.map((suggestion) => {
            return (<li key={suggestion.place_id} onClick={handleSelect(suggestion)} className="gap-2 flex items-center cursor-pointer hover:text-indigo-600 p-2 border-t border-gray-300 hover:bg-indigo-50" >
                <IoLocationOutline />
                <p className=" text-md font-bold">{suggestion.structured_formatting.main_text},</p>
                <p className=" text-sm">{suggestion.structured_formatting.secondary_text}</p>
            </li >)
        })

    useEffect(() => {
        if (signUpData) {
            setValue(signUpData?.address || "");
            setPostcode(signUpData?.postcode || "");
            return
        }
        if (postData) {
            setValue(postData?.locationData?.formatted_address || "");
            setPostcode(postData?.locationData?.postcode || "");
        }

    }, [signUpData, postData]);
    return (
        <div ref={ref} className="flex flex-col gap-5">
            <div className=" flex flex-col w-full">

                <input
                    value={value || ""}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder={placeholder}
                    className="input input-bordered"
                />
            </div>
            {displaySuggestions()}
            {suburbAndPostcode &&
                <div className="flex flex-col w-1/2">
                    <label htmlFor="">Postcode</label>
                    <div
                        className={`input input-bordered cursor-not-allowed flex items-center ${!postcode ? "text-gray-400" : ""
                            }`}
                    >
                        {postcode ? postcode : "Postcode"}
                    </div>
                </div>}
        </div>
    );
}

