import { IoFastFoodOutline } from "react-icons/io5";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { GiPokerHand } from "react-icons/gi";
import { LiaBuildingSolid } from "react-icons/lia";
import userData from "../seed/userData.json"
import { processUserArray } from "../seed/SeedUser";
import testUserData from "../seed/testUserData.json"

export default function About() {

    return (
        <>
            <div className=" flex gap-10 p-4 justify-center">
                {/* <div>
                <img src="/images/about-pic.jpeg" alt="" width={650} />
            </div> */}
                <div className="md:max-w-xl flex flex-col">
                    <header className=" ">
                        <p><span className=" text-xl font-semibold text" style={{ color: "#53a1aa" }}>Community</span> is at the heart of our guiding principles, and we have some simple criteria by which we manage our listings:</p>
                    </header>
                    <div className="">
                        <ul className="list-none py-10">
                            <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                                <div className=" flex items-center">
                                    <div className=" text-4xl p-3 bg-primary rounded-l-md text-white" style={{ backgroundColor: "#4f9ea8" }}>
                                        <IoFastFoodOutline />
                                    </div>
                                    <p className=" pl-4">Food and/or drinks must be the primary offering.</p>
                                </div>
                            </li>
                            <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                                <div className=" flex items-center">
                                    <div className=" text-4xl p-3 rounded-l-md bg-primary text-white" style={{ backgroundColor: "#cd413f" }}>
                                        <MdOutlineTableRestaurant />
                                    </div>
                                    <p className=" pl-4">Must have a permanent physical location.</p>
                                </div>
                            </li>
                            <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                                <div className=" flex items-center">
                                    <div className=" text-4xl p-3 rounded-l-md bg-primary text-white" style={{ backgroundColor: "#f2c829" }}>
                                        <GiPokerHand />
                                    </div>
                                    <p className=" pl-4">Must NOT own, operate or derive financial gain from pokies.</p>
                                </div>
                            </li>
                            <li className="flex items-center mb-2 border max-w-xl shadow-lg rounded-md">
                                <div className=" flex items-center">
                                    <div className=" text-4xl p-3 rounded-l-md bg-primary text-white" style={{ backgroundColor: "#eba55a" }}>
                                        <LiaBuildingSolid />
                                    </div>
                                    <p className=" pl-4">Must NOT be publicly listed, a franchise, or majority foreign-owned.</p>
                                </div>
                            </li>

                        </ul>
                    </div>
                    <p>And, we only request the personal information from our Members required to deliver the services you want - rest assured you are <span className=" border-b-2 pb-1" style={{ color: "#53a1aa" }}>NOT our product</span></p>

                </div>
            </div>
        </>
    )
}
