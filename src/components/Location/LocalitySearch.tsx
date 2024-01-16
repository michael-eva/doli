import usePlacesAutocomplete from "use-places-autocomplete";
import { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

export default function LocalitySearch({ onSelect, postData }) {
    const [userLocation, setUserLocation] = useState(null);

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
            locationBias: new google.maps.Circle({
                center: new google.maps.LatLng(userLocation?.latitude, userLocation?.longitude),
                radius: 2000
            }),
            types: ['locality'] // Search for localities only
        },
        debounce: 300,
    });

    const ref = useOnclickOutside(() => {
        clearSuggestions();
    });

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = ({ description }) => () => {
        setValue(description, false);
        clearSuggestions();
        onSelect(description); // Pass the selected locality to the onSelect function
    };

    const renderSuggestions = () =>
        data.map((suggestion) => {
            const {
                place_id,
                structured_formatting: { main_text, secondary_text },
            } = suggestion;
            if (suggestion.types.includes('locality')) {

                return (
                    <li key={place_id} onClick={handleSelect(suggestion)} className="mt-2 ml-2 cursor-pointer">
                        <strong>{main_text}</strong> <small>{secondary_text}</small>
                    </li>
                );
            }
        })

    useEffect(() => {
        setValue(postData?.address);
    }, [postData]);

    return (
        <div ref={ref} className="flex flex-col gap-5">
            <div className=" flex flex-col w-full">
                <label htmlFor="">Location</label>
                <input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Start typing in a location"
                    className="input input-bordered "
                />
            </div>
            {status === "OK" && <ul className=" bg-gray-100 rounded-lg">{renderSuggestions()}</ul>}
        </div>
    );
}
