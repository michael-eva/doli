import { ChangeEvent, ReactNode, useState } from "react";
import locationData from "../data/locationData.json";
import { nanoid } from "nanoid";

type Location = {
    id: number,
    postcode: string;
    locality: string;
    state: string;
    lat: number,
    long: number
};

export default function LocationSearch(): ReactNode {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const userInput = e.target.value.toLowerCase();
        setSearchTerm(userInput);


        const filtered = (locationData as Location[]).filter((location) => {
            return (
                location.postcode.includes(userInput) ||
                location.locality.toLowerCase().includes(userInput)
            );
        });

        setFilteredLocations(filtered);
    };

    const handleOptionClick = (value: string) => {
        setSearchTerm(value);
    };
    const closeDropdown = () => {
        setTimeout(() => {
            setDropdownVisible(false);
        }, 200);
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
                    onFocus={() => setDropdownVisible(true)}
                    className="input input-bordered w-96"
                    onBlur={() => closeDropdown()}
                />
                <div
                    className={`absolute left-0 right-0 mt-1 bg-base-100 border border-base-200 shadow-md z-10 ${dropdownVisible ? "block" : "hidden"
                        }`}
                >
                    {searchTerm.length > 0 && filteredLocations.map((location) => (
                        <>
                            <div
                                key={nanoid()}
                                className="p-2 hover:bg-base-200 cursor-pointer"
                                onClick={() =>
                                    handleOptionClick(
                                        `${location.locality}, ${location.postcode}, ${location.state}`
                                    )
                                }
                            >
                                {location.locality}, {location.postcode}, {location.state}
                            </div>

                        </>
                    ))}
                </div>
            </div>
        </div>
    )
}
