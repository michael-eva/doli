// import React, { useState } from 'react';

// interface SuburbAutofillProps {
//     // Additional props can be added here based on your requirements
// }

// const SuburbAutofill: React.FC<SuburbAutofillProps> = () => {
//     const [suburbInput, setSuburbInput] = useState<string>('');
//     const [suggestedSuburbs, setSuggestedSuburbs] = useState<string[]>([]);
//     const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

//     const fetchSuburbs = async (input: string) => {
//         if (input.trim() !== '') {
//             try {
//                 const response = await fetch(
//                     // `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
//                     //     input
//                     // )}&key=cf811112d4a54108b5e64e8c4f2b33a3&countrycode=au&limit=5&no_annotations=1`
//                     `https://api.opencagedata.com/geocode/v1/json?q=${searchTerm}&key=ae0f6e814d2445cf8b497c690eb9a37f&countrycode=au&language=en&pretty=1`
//                 );


//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log(data);

//                     if (data.results) {
//                         const suburbs = data.results.map(
//                             (result: any) => result.components.suburb
//                         );
//                         setSuggestedSuburbs(suburbs);
//                         setShowSuggestions(true); // Show suggestions when available
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error fetching suburbs:', error);
//             }
//         } else {
//             setSuggestedSuburbs([]);
//             setShowSuggestions(false);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const userInput = e.target.value;
//         setSuburbInput(userInput);
//         fetchSuburbs(userInput);
//     };

//     const handleSuggestionClick = (suburb: string) => {
//         setSuburbInput(suburb);
//         setShowSuggestions(false);
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 value={suburbInput}
//                 onChange={handleInputChange}
//                 placeholder="Type a suburb..."
//             />
//             {showSuggestions && (
//                 <ul>
//                     {suggestedSuburbs.map((suburb, index) => (
//                         <li key={index} onClick={() => handleSuggestionClick(suburb)}>
//                             {suburb}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default SuburbAutofill;

import { ChangeEvent, ReactNode, useState, useEffect } from "react";

type Location = {
    id: number;
    placeName: string;
    postalCode: string;
    adminCode1: string;
};

export default function LocationSearch(): ReactNode {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredSuggestions, setFilteredSuggestions] = useState<Location[]>([]);
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const fetchSuburbs = async (input: string) => {
        if (input.trim() !== '') {
            try {
                const response = await fetch(
                    `https://api.opencagedata.com/geocode/v1/json?q=suburb:${input},au&language=en&key=ae0f6e814d2445cf8b497c690eb9a37f&no_annotations=1&no_dedupe=1&no_record=20`
                );


                if (response.ok) {
                    const data = await response.json();
                    console.log(data.results);

                    if (data.results) {
                        const suburbs: Location[] = data.results.map((result: any, index: number) => ({
                            id: index,
                            placeName: result.components.suburb || '',
                            postalCode: result.components.postcode || '',
                            adminCode1: result.components.state_code || '',
                        }));
                        setFilteredSuggestions(suburbs);
                    }
                }
            } catch (error) {
                console.error('Error fetching suburbs:', error);
            }
        } else {
            setFilteredSuggestions([]);
        }
    };


    useEffect(() => {
        const delayedFetch = debounce(fetchSuburbs, 500);
        delayedFetch(searchTerm);
    }, [searchTerm]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value.toLowerCase();
        setSearchTerm(userInput);
    };

    return (
        <div className="flex flex-col">
            <label htmlFor="locationInput" className="label">
                Start typing in a suburb:
            </label>
            <div className="relative">
                <input
                    type="text"
                    id="locationInput"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="input input-bordered w-96"
                />
                <div
                    className={`absolute left-0 right-0 mt-1 bg-base-100 border border-base-200 shadow-md z-10 ${filteredSuggestions.length > 0 ? "block" : "hidden"
                        }`}
                >
                    {filteredSuggestions.map((location) => (
                        <div
                            key={location.id}
                            className="p-2 hover:bg-base-200 cursor-pointer"
                            onClick={() =>
                                setSearchTerm(`${location.placeName}, ${location.postalCode}, ${location.adminCode1}`)
                            }
                        >
                            {location.placeName}, {location.postalCode}, {location.adminCode1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


// export default function LocationSearch() {
//     const suburb = 'Bondi'; // Replace with user input or desired suburb name
//     const postcode = '1234'; // Replace with user input or desired postcode
//     const [data, setData] = useState()

//     const query = `[out:json];
//     area[name="Australia"]->.searchArea;
//     (
//       node["place"="${suburb}"](area.searchArea);
//       way["place"="${suburb}"](area.searchArea);
//       relation["place"="${suburb}"](area.searchArea);
//     );
//     out body;
//     >;
//     out skel qt;
//     `;

//     const apiUrl = 'https://overpass-api.de/api/interpreter';
//     const options = {
//         method: 'POST',
//         body: query,
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     };

//     fetch(apiUrl, options)
//         .then(response => response.json())
//         .then(data => {
//             // Handle the data received from the Overpass API
//             console.log(data);
//             setData(data)
//         })
//         .catch(error => {
//             // Handle any errors that occurred during the fetch
//             console.error('Error fetching data:', error);
//         });

// }

