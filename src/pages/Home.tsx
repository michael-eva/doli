// App.tsx
import listings from "../data/listings.json";
import { Card } from "../components/Card";
import businessType from "../data/businessTypes.json"
import LocationSearch from "../components/LocationSearch";
import { useState } from "react";

export default function Home() {
    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <>
            <div className=" max-w-7xl m-auto">
                <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col">
                        <LocationSearch />
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
                        <select name="type" className="select select-bordered">
                            <option value="" selected>All Types</option>
                            {businessType.map(item => (
                                <option>{item}</option>
                            ))}

                        </select>
                    </div>
                    <div className="flex flex-col mt-4 dropdown-bottom w-64">
                        <label htmlFor="">Select Delivery Method:</label>
                        <select name="deliveryMethod" className="select select-bordered">
                            <option value="" selected>All Methods</option>
                            <option value="delivery" >Delivery</option>
                            <option value="dineIn" >Dine-In</option>
                            <option value="pickUp" >Pick-Up</option>
                        </select>
                    </div>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="">Enter Search Term:</label>
                        <input type="text"
                            className="input input-bordered w-72" />
                    </div>
                </div >
                <div className="flex flex-wrap justify-center h-full">
                    {listings.map((item) => {
                        return (
                            <div key={item.id} className="mt-10 ">
                                <Card {...item} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
