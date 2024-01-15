import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

export default function LocationSearch({ onSelect, postData }) {
    const [userLocation, setUserLocation] = useState(null);
    const [postcode, setPostcode] = useState("")
    const [locality, setLocality] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by your browser.');
        }
    }, []);

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        callbackName: "YOUR_CALLBACK_NAME",
        requestOptions: {
            /* Define search scope here */
            locationBias: new google.maps.Circle({
                center: new google.maps.LatLng(userLocation?.latitude, userLocation?.longitude),
                radius: 2000
            }),
            types: ['address']
        },
        debounce: 300,
    });
    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e) => {
        setLocality("")
        setPostcode("")
        setCountry("")
        setValue(e.target.value);
    };

    const extractStreetAddress = (input: string) => {
        const parts = input.split(','); // Split the string using commas
        const result = parts[0].trim(); // Get the first part and remove leading/trailing whitespaces
        return result;
    }
    const handleSelect =
        ({ description }) =>
            () => {
                setValue(description, false);
                clearSuggestions();

                getGeocode({ address: description }).then((results) => {
                    const postalCodeComponent = results[0].address_components.find(
                        (component) => component.types.includes('postal_code')
                    );
                    const localityComponent = results[0].address_components.find(
                        (component) => component.types.includes('locality')
                    );
                    const stateComponent = results[0].address_components.find(
                        (component) => component.types.includes('administrative_area_level_1')
                    );
                    const countryComponent = results[0].address_components.find(
                        (component) => component.types.includes('country')
                    );
                    setLocality(localityComponent?.long_name)
                    setPostcode(postalCodeComponent?.long_name)
                    setState(stateComponent?.short_name)
                    setCountry(countryComponent?.long_name)
                    onSelect(extractStreetAddress(description), postalCodeComponent ? postalCodeComponent.long_name : '', localityComponent ? localityComponent.long_name : "", stateComponent?.short_name, countryComponent?.long_name);
                    const { lat, lng } = getLatLng(results[0]);
                    console.log("📍 Coordinates: ", { lat, lng });
                });
            };
    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
                <li key={place_id} onClick={handleSelect(suggestion)}>
                    <strong>{main_text}</strong> <small>{secondary_text}</small>
                </li>
            );
        });
    useEffect(() => {
        setValue(postData?.address)
        setPostcode(postData?.postcode)
        setState(postData?.state)
        setCountry(postData?.country)
        setLocality(postData?.locality)
    }, [postData])

    return (
        <div ref={ref} className="flex flex-col gap-5">
            <div className=" flex flex-col w-full">
                <label htmlFor="">Address</label>
                <input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Start typing in your address"
                    className="input input-bordered "
                    required
                />
            </div>
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
            <div className="flex gap-2">
                <div className="flex flex-col w-1/2">
                    <label htmlFor="">Suburb</label>
                    <div className={`input input-bordered cursor-not-allowed flex items-center ${!locality ? "text-gray-400" : ""}`}>
                        {locality ? locality : "Suburb"}
                    </div>
                </div>
                <div className="flex flex-col w-1/2">
                    <label htmlFor="">Postcode</label>
                    <div className={`input input-bordered cursor-not-allowed flex items-center ${!postcode ? "text-gray-400" : ""}`}>
                        {postcode ? postcode : "Postcode"}
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-2/3">
                <label htmlFor="">Country</label>
                <div className={`input input-bordered cursor-not-allowed flex items-center ${!country ? "text-gray-400" : ""}`}>
                    {country ? country : "Country"}
                </div>
            </div>
        </div>
    );
}

