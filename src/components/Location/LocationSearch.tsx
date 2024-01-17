// import usePlacesAutocomplete, {
//     LatLng,
//     getGeocode,
// } from "use-places-autocomplete";
// import { useEffect, useState } from "react";
// import useOnclickOutside from "react-cool-onclickoutside";
// import { LatLngLiteral } from "leaflet";


// type LocationSearch = {
//     onSelect: () => void,
//     postData: PostData
//     fullAddress?: boolean
//     types: string[],
//     label: string,
//     placeholder: string
// }
// type PostData = {
//     imgUrl: string,
//     name: string,
//     locality: string,
//     state: string,
//     country: string
//     postcode: string,
//     address: string,
//     type: string,
//     selectedTags: string[],
//     description: string,
//     openingHours: string,
//     pickUp: boolean,
//     delivery: boolean,
//     dineIn: boolean,
//     contact: string,
//     website: string,
//     isVerified: boolean,
//     postId: string
// }

// type UserLocation = {
//     latitude: number | LatLng | LatLngLiteral,
//     longitude: number | null
// }

// type AddressComponent = {
//     long_name: string;
//     short_name: string;
//     types: string[];
// }

// export default function LocationSearch({ onSelect, postData, fullAddress, types, label, placeholder }: LocationSearch) {
//     const [userLocation, setUserLocation] = useState<UserLocation>({
//         latitude: 0,
//         longitude: 0
//     });
//     const [postcode, setPostcode] = useState<string>("")
//     const [locality, setLocality] = useState<string>("")
//     const [state, setState] = useState<string>("")
//     const [country, setCountry] = useState<string>("")

//     useEffect(() => {
//         if ('geolocation' in navigator) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation({ latitude, longitude });
//                 },
//                 (error) => {
//                     console.error('Error getting user location:', error.message);
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by your browser.');
//         }
//     }, []);

//     const {
//         ready,
//         value,
//         suggestions: { status, data },
//         setValue,
//         clearSuggestions,
//     } = usePlacesAutocomplete({
//         requestOptions: {
//             locationBias: new google.maps.Circle({
//                 center: new google.maps.LatLng(userLocation?.latitude, userLocation?.longitude),
//                 radius: 2000
//             }),
//             types: types
//         },
//         debounce: 300,
//     });


//     const ref = useOnclickOutside(() => {
//         clearSuggestions();
//     });
//     const handleInput = (e: { target: { value: string; }; }) => {
//         setLocality("")
//         setPostcode("")
//         setCountry("")
//         setValue(e.target.value);

//     };
//     const extractStreetAddress = (input: string) => {
//         const parts = input.split(',');
//         const result = parts[0].trim();
//         return result;
//     }
//     const handleSelect = ({ description }) =>
//         () => {
//             setValue(description, false);
//             clearSuggestions();

//             getGeocode({ address: description }).then((results) => {

//                 const postalCodeComponent = results[0].address_components.find(
//                     (component: AddressComponent) => component.types.includes('postal_code')
//                 );
//                 setPostcode(postalCodeComponent?.long_name || "")


//                 const localityComponent = results[0].address_components.find(
//                     (component: AddressComponent) => component.types.includes('locality')
//                 );
//                 setLocality(localityComponent?.long_name || "")

//                 const stateComponent = results[0].address_components.find(
//                     (component: AddressComponent) => component.types.includes('administrative_area_level_1')
//                 );
//                 setState(stateComponent?.short_name || "")
//                 const countryComponent = results[0].address_components.find(
//                     (component: AddressComponent) => component.types.includes('country')
//                 );
//                 setCountry(countryComponent?.long_name || "")

//                 onSelect(extractStreetAddress(description), postalCodeComponent ? postalCodeComponent.long_name : '', localityComponent ? localityComponent.long_name : "", stateComponent?.short_name, countryComponent?.long_name);
//             });

//         };

//     const renderSuggestions = () =>
//         data.map((suggestion) => {
//             const {
//                 place_id,
//                 structured_formatting: { main_text, secondary_text },
//             } = suggestion;

//             return (
//                 <li key={place_id} onClick={handleSelect(suggestion)}>
//                     <strong>{main_text}</strong> <small>{secondary_text}</small>
//                 </li>
//             );
//         });
//     useEffect(() => {
//         setValue(postData?.address)
//         setPostcode(postData?.postcode)
//         setState(postData?.state)
//         setCountry(postData?.country)
//         setLocality(postData?.locality)
//     }, [postData])

//     return (
//         <div ref={ref} className="flex flex-col gap-5">
//             <div className=" flex flex-col w-full">
//                 <label htmlFor="">{label}</label>
//                 <input
//                     value={value}
//                     onChange={handleInput}
//                     disabled={!ready}
//                     placeholder={placeholder}
//                     className="input input-bordered "
//                 />
//             </div>
//             {status === "OK" && <ul>{renderSuggestions()}</ul>}
//             {fullAddress &&
//                 <>
//                     <div className="flex gap-2">
//                         <div className="flex flex-col w-1/2">
//                             <label htmlFor="">Suburb</label>
//                             <div className={`input input-bordered cursor-not-allowed flex items-center ${!locality ? "text-gray-400" : ""}`}>
//                                 {locality ? locality : "Suburb"}
//                             </div>
//                         </div>
//                         <div className="flex flex-col w-1/2">
//                             <label htmlFor="">Postcode</label>
//                             <div className={`input input-bordered cursor-not-allowed flex items-center ${!postcode ? "text-gray-400" : ""}`}>
//                                 {postcode ? postcode : "Postcode"}
//                             </div>
//                         </div>
//                     </div>
//                     <div className="flex flex-col w-2/3">
//                         <label htmlFor="">Country</label>
//                         <div className={`input input-bordered cursor-not-allowed flex items-center ${!country ? "text-gray-400" : ""}`}>
//                             {country ? country : "Country"}
//                         </div>
//                     </div>
//                 </>
//             }
//         </div>
//     );
// }

import { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, {
    getGeocode,
    Suggestion,
} from "use-places-autocomplete";
import { LatLngLiteral } from "leaflet";

type PostData = {
    imgUrl: string;
    name: string;
    locality: string;
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
        locality: string,
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
    const [locality, setLocality] = useState<string>("");
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
        setLocality("");
        setPostcode("");
        setCountry("");
        setValue(e.target.value);
    };

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

            const localityComponent = addressComponents.find(
                (component: AddressComponent) => component.types.includes("locality")
            );
            setLocality(localityComponent?.long_name || "");

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
                localityComponent ? localityComponent.long_name : "",
                stateComponent ? stateComponent?.short_name : "",
                countryComponent ? countryComponent?.long_name : "",
            );
        });
    };

    const renderSuggestions = () =>
        data.map((suggestion) => (
            <li key={suggestion.place_id} onClick={handleSelect(suggestion)}>
                <strong>{suggestion.structured_formatting.main_text}</strong>{" "}
                <small>{suggestion.structured_formatting.secondary_text}</small>
            </li>
        ));

    useEffect(() => {
        setValue(postData?.address || "");
        setPostcode(postData?.postcode || "");
        setState(postData?.state || "");
        setCountry(postData?.country || "");
        setLocality(postData?.locality || "");
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
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
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
            {fullAddress && (
                <>
                    <div className="flex gap-2">
                        <div className="flex flex-col w-1/2">
                            <label htmlFor="">Suburb</label>
                            <div
                                className={`input input-bordered cursor-not-allowed flex items-center ${!locality ? "text-gray-400" : ""
                                    }`}
                            >
                                {locality ? locality : "Suburb"}
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
            )}
        </div>
    );
}
