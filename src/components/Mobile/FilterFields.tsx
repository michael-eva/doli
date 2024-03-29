import LocationSearch from '../Location/LocationSearch';
import { FilterFieldsType } from '../../Types/index';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../ui/select';

export default function FilterFields({ clearFilters, genNewSearchParams, typeFilter, businessType, searchFilter, locationFilter, setInputClear, inputClear, isChecked, onSelect, handleCheckboxChange, nearbyFilter }: FilterFieldsType) {

    return (
        <>
            <div className="collapse bg-white collapse-arrow border-[#4f9ea8] border-2">
                <input type="checkbox" />
                <div className="collapse-title text-black bg-[#e0f3f6]">
                    Filters
                </div>
                <div className="collapse-content text-base-content bg-[#e0f3f67c] ">
                    <div className="flex flex-wrap justify-between md:hidden">
                        <div className="flex flex-col">
                            <div className="flex flex-col mt-4 w-72">
                                <LocationSearch className="input input-bordered" setInputClear={setInputClear} inputClear={inputClear} onSelect={onSelect} types={['locality']} placeholder="Start typing in a suburb" suburbAndPostcode={false} />
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
                            <Select value={typeFilter || ""} onValueChange={(selectedOption) => genNewSearchParams('type', selectedOption)}>
                                <SelectTrigger className=" h-11 w-72 ">
                                    <div className={`${typeFilter ? "" : "text-gray-500"}`}>
                                        <SelectValue placeholder="Select Type of Business" />
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
                            <input type="text"
                                className="input input-bordered w-72"
                                placeholder='General Search'
                                onChange={(e) => genNewSearchParams("search", e.target.value)}
                                value={searchFilter || ""}
                            />
                        </div>

                        {nearbyFilter || searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? <button className="btn btn-sm btn-error w-36 m-auto mt-4" onClick={clearFilters}>Clear filters</button> : ""}
                    </div >
                </div>
            </div>
        </>
    );
}