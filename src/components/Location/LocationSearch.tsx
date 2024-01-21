import { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, {
    getGeocode,
    Suggestion,
} from "use-places-autocomplete";
import { LatLngLiteral } from "leaflet";
import { IoLocationOutline } from "react-icons/io5";

type PostData = {
    imgUrl: string;
    name: string;
    suburb: string;
    country: string,
    state: string;
    postcode: string;
    address: string;
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

type UserLocation = {
    latitude: number | LatLngLiteral;
    longitude: number | null;
};

type AddressComponent = {
    long_name: string;
    short_name: string;
    types: string[];
};

type LocationSearchProps = {
    onSelect?: (
        address: string,
        postcode: string,
        suburb: string,
        state: string,
        country: string
    ) => void;
    postData?: PostData;
    fullAddress?: boolean;
    types: string[];
    label: string;
    placeholder: string;
    inputClear?: boolean,
    setInputClear?: any,
    infoModal?: any
    suburbAndPostcode: boolean
};

export default function LocationSearch({
    onSelect,
    postData,
    fullAddress,
    types,
    placeholder,
    inputClear,
    setInputClear,
    suburbAndPostcode
}: LocationSearchProps) {
    const [userLocation, setUserLocation] = useState<UserLocation>({
        latitude: 0,
        longitude: 0,
    });
    const [postcode, setPostcode] = useState<string>("");
    const [suburb, setSuburb] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [country, setCountry] = useState<string>("");
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Error getting user location:", error.message);
                }
            );
        } else {
            console.error("Geolocation is not supported by your browser.");
        }
    }, []);
    console.log(postData);

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            locationBias: new google.maps.Circle({
                center: new google.maps.LatLng(userLocation?.latitude, userLocation?.longitude),
                radius: 2000
            }),
            componentRestrictions: {
                country: ["au",]
            },
            types: types,
        },
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSuburb("");
        setPostcode("");
        setCountry("");
        setValue(e.target.value);
    };
    // console.log(postData);


    useEffect(() => {
        if (inputClear) {
            setValue("")
            setInputClear(false)
        }
    }, [inputClear])

    const extractStreetAddress = (input: string): string => {
        const parts = input.split(",");
        const result = parts[0].trim();
        return result;
    };

    const handleSelect = (suggestion: Suggestion) => () => {
        setValue(suggestion.description, false);
        clearSuggestions();


        getGeocode({ address: suggestion.description }).then((results) => {
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
            setSuburb(suburbComponent?.long_name || "");

            const stateComponent = addressComponents.find(
                (component: AddressComponent) =>
                    component.types.includes("administrative_area_level_1")
            );
            setState(stateComponent?.short_name || "");

            const countryComponent = addressComponents.find(
                (component: AddressComponent) => component.types.includes("country")
            );
            setCountry(countryComponent?.long_name || "");
            // onSelect(extractStreetAddress(description), postalCodeComponent ? postalCodeComponent.long_name : '', localityComponent ? localityComponent.long_name : "", stateComponent?.short_name, countryComponent?.long_name);
            onSelect(
                extractStreetAddress(suggestion.description),
                postalCodeComponent ? postalCodeComponent.long_name : '',
                suburbComponent ? suburbComponent.long_name : "",
                stateComponent ? stateComponent?.short_name : "",
                countryComponent ? countryComponent?.long_name : "",
            );
        });
    };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            return (<li key={suggestion.place_id} onClick={handleSelect(suggestion)} className="gap-2 flex items-center cursor-pointer hover:text-indigo-600 p-2 border-t border-gray-300 hover:bg-indigo-50" >
                <IoLocationOutline />
                <p className=" text-md font-bold">{suggestion.structured_formatting.main_text},</p>
                <p className=" text-sm">{suggestion.structured_formatting.secondary_text}</p>
            </li >)
        });

    useEffect(() => {
        setValue(postData?.locationData?.formatted_address || "");
        setPostcode(postData?.locationData?.postcode || "");
        setState(postData?.state || "");
        setCountry(postData?.country || "");
        setSuburb(postData?.suburb || "");

    }, [postData]);

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
            {status === "OK" && <ul className=" border-2 border-gray-300 rounded-md bg-gray-50">{renderSuggestions()}</ul>}
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
            {/* {fullAddress && (
                <>
                    <div className="flex gap-2">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="">Suburb</label>
                            <div
                                className={`input input-bordered cursor-not-allowed flex items-center ${!suburb ? "text-gray-400" : ""
                                    }`}
                            >
                                {suburb ? suburb : "Suburb"}
                            </div>
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="">Postcode</label>
                            <div
                                className={`input input-bordered cursor-not-allowed flex items-center ${!postcode ? "text-gray-400" : ""
                                    }`}
                            >
                                {postcode ? postcode : "Postcode"}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-2/3">
                        <label htmlFor="">Country</label>
                        <div
                            className={`input input-bordered cursor-not-allowed flex items-center ${!country ? "text-gray-400" : ""
                                }`}
                        >
                            {country ? country : "Country"}
                        </div>
                    </div>
                </>
            )} */}
        </div>
    );
}
