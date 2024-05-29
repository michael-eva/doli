import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import LocationSearch from "../Location/LocationSearch";
import { Input } from "../ui/input";
import { useFilters } from "@/pages/Home/utils/Filter/filterFunctions";
import businessType from "../../data/businessTypes.json"
import { useMediaQuery } from "react-responsive";
import { isFilterApplied } from "@/pages/Home/utils/Filter/filterFunctions";

export default function HomeFilters({ isChecked, handleCheckboxChange, inputClear, setInputClear, clearFilters }: FilterFieldsType) {
    const { typeFilter, searchFilter, decodedTypeFilter, deliveryFilter, decodedSearchFilter, decodedLocationFilter, locationFilter, genNewSearchParams } = useFilters()
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const isFilter = isFilterApplied()
    const handleLocationSelect = (_address: string, postcode: string, _locality: string, _state: string, _country: string, coordinates: any) => {

        if (isChecked) {
            genNewSearchParams('coordinates', `${coordinates.latitude} + ${coordinates.longitude}`)
        } else if (!isChecked) {
            genNewSearchParams('location', postcode)
        }
    };

    return (
        <>
            {!isMobile ?
                <>
                    <div className="flex gap-10 justify-center mt-14">
                        <div className="flex flex-col">
                            <div className="">
                                <LocationSearch className="border-2 p-2 rounded-lg max-h-11" setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} types={['locality']} placeholder="Search by suburb" suburbAndPostcode={false} />
                            </div>
                            <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                                <input
                                    type='checkbox'
                                    name='autoSaver'
                                    className='sr-only'
                                    checked={isChecked}
                                    onChange={handleCheckboxChange}
                                />
                                <span
                                    className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'
                                        }`}
                                >
                                    <span
                                        className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''
                                            }`}
                                    ></span>
                                </span>
                                <span className='label flex items-center text-sm font-medium text-black'>
                                    Include Nearby Locations
                                </span>
                            </label>
                        </div>
                        <div >
                            <Select value={typeFilter ? decodedTypeFilter : ""} onValueChange={(selectedOption) => genNewSearchParams('type', selectedOption)}>
                                <SelectTrigger className=" border-2 border-black h-11 w-52">
                                    <div className={`${typeFilter ? "" : "text-gray-500"}`}>
                                        <SelectValue placeholder="All Business Types" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {businessType.map(item => (
                                            <SelectItem key={item} value={item}>{item}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>
                        <div className="flex flex-col dropdown-bottom">
                            <Select value={deliveryFilter || ""} onValueChange={(selectedOption) => genNewSearchParams('deliveryMethod', selectedOption)}>
                                <SelectTrigger className=" border-2 border-black h-11 w-52">
                                    <div className={`${deliveryFilter ? "" : "text-gray-500"}`}>
                                        <SelectValue placeholder="Select Delivery Method" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="delivery">Delivery</SelectItem>
                                        <SelectItem value="dineIn">Dine-In</SelectItem>
                                        <SelectItem value="pickUp">Pick-Up</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col">
                            {/* <label htmlFor="">Enter Search Term:</label> */}
                            <Input
                                type="text"
                                placeholder="General Search"
                                className="border-2 border-black h-11"
                                value={searchFilter ? decodedSearchFilter : ""}
                                onChange={(e) => genNewSearchParams("search", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className=" flex justify-center">
                        {isFilter ? <button className="btn btn-md btn-error w-36" onClick={clearFilters}>Clear filters</button> : ""}
                    </div>
                    <div className="divider "></div>
                </>
                :
                <div className="collapse bg-white collapse-arrow border-[#4f9ea8] border-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-black bg-[#e0f3f6]">
                        Filters
                    </div>
                    <div className="collapse-content text-base-content bg-[#e0f3f67c] ">
                        <div className="flex flex-wrap justify-between md:hidden">
                            <div className="flex flex-col">
                                <div className="flex flex-col mt-4 w-72">
                                    <LocationSearch className="input input-bordered" setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} types={['locality']} placeholder="Start typing in a suburb" suburbAndPostcode={false} />
                                </div>
                                <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                                    <input
                                        type='checkbox'
                                        name='autoSaver'
                                        className='sr-only'
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span
                                        className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-[#3d86f2]' : 'bg-[#CCCCCE]'
                                            }`}
                                    >
                                        <span
                                            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''
                                                }`}
                                        ></span>
                                    </span>
                                    <span className='label flex items-center text-sm font-medium text-black'>
                                        Include Nearby Locations
                                    </span>
                                </label>
                            </div>
                            <div className=' bg-white rounded-lg mt-4'>
                                <Select value={typeFilter ? decodedTypeFilter : ""} onValueChange={(selectedOption) => genNewSearchParams('type', selectedOption)}>
                                    <SelectTrigger className=" h-11 w-72 ">
                                        <div className={`${typeFilter ? "" : "text-gray-500"}`}>
                                            <SelectValue placeholder="All Business Types" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {/* <SelectLabel>Type of Business</SelectLabel> */}
                                            {businessType?.map(item => (
                                                <SelectItem key={item} value={item}>{item}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col mt-4">
                                <Input
                                    type="text"
                                    placeholder="General Search"
                                    className=" w-72 h-11"
                                    value={searchFilter ? decodedSearchFilter : ""}
                                    onChange={(e) => genNewSearchParams("search", e.target.value)}
                                />
                            </div>
                            {decodedLocationFilter || searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? <button className="btn btn-sm btn-error w-36 m-auto mt-4" onClick={clearFilters}>Clear filters</button> : ""}
                        </div >
                    </div>
                </div>
            }
        </>
    )
}
