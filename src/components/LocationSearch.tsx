import { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

export default function LocationSearch() {
    const [address, setAddress] = useState("")
    const [coordinates, setCoordinates] = useState("")

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value)
        const latlong = await getLatLng(results[0])
        setAddress(results)
        setCoordinates(latlong)
    }
    console.log(address);
    console.log(coordinates);

    return (
        <PlacesAutocomplete
            value={address[0]?.formatted_address || address}
            onChange={setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                    <input
                        {...getInputProps({
                            placeholder: 'Search Places ...',
                            className: "input input-bordered w-full",
                        })}
                    />
                    <div className="mt-2">
                        {loading && <div>Loading...</div>}
                        <div className='mt-2 bg-gray-50 rounded-lg curs'>
                            {suggestions.map(suggestion => {
                                const className =
                                    `p-4 ${suggestion.active ? " text-primary cursor-pointer border-t border-b" : " cursor-pointer"}`
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    )
}


// import { useState, useEffect } from "react";
// import AsyncSelect from 'react-select/async';

// function useDebounce(value, delay) {
//     const [debouncedValue, setDebouncedValue] = useState(value);

//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);

//         return () => {
//             clearTimeout(timeoutId);
//         };
//     }, [value, delay]);

//     return debouncedValue;
// }

// export default function LocationSearch() {
//     const apiKey = 'cf811112d4a54108b5e64e8c4f2b33a3';
//     const [selectedResult, setSelectedResult] = useState(null);
//     const debouncedUserInput = useDebounce(selectedResult, 500);

//     const loadOptions = (inputValue, callback) => {
//         const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(inputValue)}&countrycode=au&key=${apiKey}&pretty=1`;

//         fetch(apiUrl)
//             .then(response => response.json())
//             .then(data => {
//                 const searchResults = data.results;

//                 if (searchResults.length > 0) {
//                     const formattedResults = searchResults.map(result => ({
//                         value: result.formatted,
//                         label: result.formatted,
//                         data: result,
//                     }));

//                     callback(formattedResults);
//                 } else {
//                     callback([]);
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//     };

//     const handleResultSelect = (selectedOption) => {
//         setSelectedResult(selectedOption ? selectedOption.label : "");
//     };

//     const handleClear = () => {
//         setSelectedResult(null);
//     };

//     return (
//         <div>
//             <AsyncSelect
//                 loadOptions={(inputValue, callback) => loadOptions(inputValue, callback)}
//                 defaultOptions
//                 value={selectedResult}
//                 onChange={handleResultSelect}
//                 placeholder="Type to search..."
//             />
//         </div>
//     );
// }

// import { useState, useEffect } from "react";

// function useDebounce(value, delay) {
//     const [debouncedValue, setDebouncedValue] = useState(value);

//     useEffect(() => {
//         const timeoutId = setTimeout(() => {
//             setDebouncedValue(value);
//         }, delay);

//         return () => {
//             clearTimeout(timeoutId);
//         };
//     }, [value, delay]);

//     return debouncedValue;
// }

// export default function LocationSearch() {
//     const apiKey = 'cf811112d4a54108b5e64e8c4f2b33a3';
//     const [userInput, setUserInput] = useState("");
//     const [selectedResult, setSelectedResult] = useState(null);
//     const debouncedUserInput = useDebounce(userInput, 500); // Adjust the delay as needed
//     const [options, setOptions] = useState([]);

//     const handleInputChange = (e) => {
//         setUserInput(e.target.value);
//     };

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
//                     debouncedUserInput
//                 )}&countrycode=au&key=${apiKey}&pretty=1`;

//                 const response = await fetch(apiUrl);
//                 const data = await response.json();

//                 const searchResults = data.results;

//                 if (searchResults.length > 0) {
//                     const formattedResults = searchResults.map((result) => result.formatted);
//                     setOptions(formattedResults);
//                 } else {
//                     setOptions([]);
//                 }
//             } catch (error) {
//                 console.error('Error:', error);
//             }
//         };

//         fetchData();
//     }, [debouncedUserInput, apiKey]);

//     const handleResultSelect = (selectedOption) => {
//         setUserInput(selectedOption);
//         setSelectedResult(selectedOption);
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 value={userInput}
//                 onChange={handleInputChange}
//                 placeholder="Type to search..."
//                 list="search-results"
//             />
//             <datalist id="search-results">
//                 {options.map((result, index) => (
//                     <option key={index} value={result} />
//                 ))}
//             </datalist>

//             {selectedResult && (
//                 <div>
//                     <p>Formatted Address: {selectedResult}</p>
//                     {/* Include additional details as needed */}
//                 </div>
//             )}
//         </div>
//     );
// }
