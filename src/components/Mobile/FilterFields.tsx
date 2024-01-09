import { useState } from 'react';

export default function FilterFields({ register, genNewSearchParams, typeFilter, deliveryFilter, businessType, searchFilter, locationFilter }) {
    const [isChecked, setIsChecked] = useState(true)
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <>

            <div className="collapse bg-base-200 collapse-arrow">
                <input type="checkbox" className="peer" />
                <div className="collapse-title bg-primary text-primary-content peer-checked:text-primary-content">
                    Filters
                </div>
                <div className="collapse-content bg-primary text-base-content peer-checked:bg-slate-300 ">
                    <div className="flex flex-wrap justify-between md:hidden">
                        <div className="flex flex-col">
                            {/* <LocationSearch /> */}
                            <div className="flex flex-col mt-4">
                                <label htmlFor="">Location:</label>
                                <input type="text"
                                    className="input input-bordered w-72"
                                    {...register("location")}
                                    onChange={(e) => genNewSearchParams("location", e.target.value)}
                                    value={locationFilter || ""}
                                />
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
                            >
                                <option value="all" selected>All Types</option>
                                {businessType.map(item => (
                                    <option
                                        key={item}
                                        value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col mt-4 dropdown-bottom w-64">
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
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="">Enter Search Term:</label>
                            <input type="text"
                                className="input input-bordered w-72"
                                {...register("search")}
                                onChange={(e) => genNewSearchParams("search", e.target.value)}
                                value={searchFilter || ""}
                            />
                        </div>
                    </div >
                </div>
            </div>
        </>
    );
}