import { useEffect, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import usePlacesAutocomplete, {
    getGeocode,
    Suggestion,
} from "use-places-autocomplete";
import { IoLocationOutline } from "react-icons/io5";
import { LocationSearchProps } from "../../Types";
import Select from "./Select";

type AddressComponent = {
    long_name: string;
    short_name: string;
    types: string[];
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
    className,
    allChecked
}: LocationSearchProps) {
    const [postcode, setPostcode] = useState<string>("");
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } =
        usePlacesAutocomplete(
            {
                callbackName: "initMap",
                requestOptions: {
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
    const handleInput = (val: string) => {

        setValue(val)
    };
    useEffect(() => {
        if (inputClear) {
            setValue("")
            setInputClear(false)
        }
    }, [inputClear])

    const handleSelect = (suggestion: Suggestion) => () => {
        console.log(suggestion);

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
                    // suggestion.description,
                    suggestion.structured_formatting.main_text,
                    postalCodeComponent ? postalCodeComponent.long_name : "",
                    suburbComponent ? suburbComponent.long_name : "",
                    stateComponent ? stateComponent?.short_name : "",
                    countryComponent ? countryComponent?.long_name : "",
                    { latitude: lat(), longitude: lng() }
                );
            }

        });
    };

    const renderTestSuggestions = () =>
        data.map((suggestion) => ({
            label: `${suggestion.structured_formatting.main_text}, ${suggestion.structured_formatting.secondary_text}`,
            value: suggestion.description,
        }));


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
            {/* <div className=" flex flex-col w-full">

                <input
                    value={value || ""}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder={placeholder}
                    className={className}
                />
            </div>
            {displaySuggestions()} */}
            <div className="border-2 rounded-lg">

                <Select value={value} options={renderTestSuggestions()} setValue={setValue} handleSelect={handleSelect} handleInput={handleInput} />
            </div>
            {suburbAndPostcode &&
                <div className="flex flex-col w-1/2">
                    <label htmlFor="">Postcode</label>
                    <div
                        className={`input input-bordered cursor-not-allowed flex items-center ${!postcode ? "text-gray-400" : ""} `}
                        style={!allChecked ? { backgroundColor: "#f2f2f2", borderColor: "#f2f2f2" } : {}}
                    >
                        {postcode ? postcode : "Postcode"}
                    </div>
                </div>}
        </div>
    );
}

