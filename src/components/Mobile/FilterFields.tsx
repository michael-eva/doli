import { Dispatch, SetStateAction } from 'react';
import LocationSearch from '../Location/LocationSearch';
type FilterFields = {
    register: any
    genNewSearchParams: (key: string, value: string) => void
    typeFilter: string | null
    businessType: string[] | null
    searchFilter: string | null
    locationFilter: string | null
    clearFilters: () => void
    setInputClear: Dispatch<SetStateAction<boolean>>
    inputClear: boolean
    isChecked: boolean
    onSelect?: (
        address: string,
        postcode: string,
        suburb: string,
        state: string,
        country: string,
        coordinates: any
    ) => void;
    handleCheckboxChange: () => void
    nearbyFilter: string | null

}

export default function FilterFields({ clearFilters, register, genNewSearchParams, typeFilter, businessType, searchFilter, locationFilter, setInputClear, inputClear, isChecked, onSelect, handleCheckboxChange, nearbyFilter }: FilterFields) {

    return (
        <>

            <div className="collapse bg-base-200 collapse-arrow mt-10">
                <input type="checkbox" className="peer" />
                <div className="collapse-title bg-primary text-primary-content peer-checked:text-primary-content">
                    Filters
                </div>
                <div className="collapse-content bg-primary text-base-content peer-checked:bg-slate-300 ">
                    <div className="flex flex-wrap justify-between md:hidden">
                        <div className="flex flex-col">
                            <div className="flex flex-col mt-4 w-72">
                                <LocationSearch setInputClear={setInputClear} inputClear={inputClear} onSelect={onSelect} types={['locality']} placeholder="Start typing in a suburb" includeNearby={isChecked} suburbAndPostcode={false} />
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

                        <div className="flex flex-col mt-4 dropdown-bottom w-64">
                            <label> Select Type:</label>
                            <select
                                {...register('type')}
                                className="select select-bordered w-72"
                                onChange={(e) => genNewSearchParams('type', e.target.value)}
                                value={typeFilter || ""}
                                defaultChecked="All Types"
                            >
                                <option value="all">All Types</option>
                                {businessType?.map(item => (
                                    <option
                                        key={item}
                                        value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        {/* <div className="flex flex-col mt-4 dropdown-bottom w-64">
                            <label htmlFor="">Select Delivery Method:</label>
                            <select
                                name="deliveryMethod"
                                className="select select-bordered w-72"
                                onChange={(e) => genNewSearchParams("deliveryMethod", e.target.value)}
                                value={deliveryFilter || ""}
                            >
                                <option value="all" selected>All Methods</option>
                                <option value="delivery" >Delivery</option>
                                <option value="dineIn" >Dine-In</option>
                                <option value="pickUp" >Pick-Up</option>
                            </select>
                        </div> */}
                        <div className="flex flex-col mt-4">
                            <label htmlFor="">Enter Search Term:</label>
                            <input type="text"
                                className="input input-bordered w-72"
                                placeholder='eg: Beer'
                                {...register("search")}
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