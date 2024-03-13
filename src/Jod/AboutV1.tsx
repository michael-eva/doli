import { GiPokerHand } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBuildingSolid } from "react-icons/lia";
import { MdOutlineTableRestaurant } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaRegStar } from "react-icons/fa";

const rating = () => {
    return (

        <FaRegStar />

    )
}

export default function AboutV1() {
    return (
        <>
            <header></header>
            <body className="container max-w-3xl">
                <section className="space-y-8 my-10">
                    <p><span className=" text-3xl text-[#4d9da8] font-bold">doli</span> <span className="text-[#4d9da8] text-xl">(directory of local independents) -</span> is the home-grown service that makes it easy for you to find and support the hospitality businesses that positively contribute to the fabric of your community.  </p>
                    <div>
                        <p className=" text-2xl text-[#4d9da8]"><strong>Great food and drink are central to all healthy communities </strong></p>
                        <p >but not all businesses are the same, so before you part with your hard earned, use the mobile friendly doli website or look for our doli logo in a business’s window, to confirm it’s going into the pockets of owners and neighbours that are as invested in your community as you are.</p>
                    </div>
                </section>
                <section className="space-y-4 my-10">
                    <p><strong className=" text-2xl text-[#4d9da8]">Yes, doli businesses are special,</strong> and to differentiate we asked ourselves one simple question… “what’s good for our community?” …and applied the following criteria whereby businesses must…</p>
                    <ul className=" space-y-4">
                        <li className=" flex gap-4">
                            <div className=" text-3xl mt-1.5">
                                <MdOutlineTableRestaurant />
                            </div>
                            <div>
                                <span className=" font-bold">have a permanent physical & genuine retail outlet</span> because in an increasingly online world, local favourites provide colour and variety that helps shape the unique character of your community.
                            </div>
                        </li>
                        <li className=" flex gap-4">
                            <div className=" text-3xl mt-1.5">
                                <GiPokerHand />
                            </div>
                            <div>
                                <span className=" font-bold">not own, operate, or derive financial gain from poker machines</span> because the arts… live music, comedy, et al… is entertainment that nourishes a communities soul… pokies play you.
                            </div>
                        </li>
                        <li className=" flex gap-4">
                            <div className=" text-3xl mt-1.5">
                                <LiaBuildingSolid />
                            </div>
                            <div><span className=" font-bold">not be a franchise, publicly or majority foreign owned </span>because your community is an independent business owners community as well, and their products and service reflect their vision and passion… not those of a boardroom’s…
                            </div>
                        </li>
                        <li className=" flex gap-4">
                            <div className=" text-3xl mt-1.5">
                                <BsPencilSquare />
                            </div>
                            <div className="p-0">
                                <span className=" font-bold">self-register and maintain their own trading details</span> because any meaningful relationship is reciprocal and there has been a conscious decision and positive action by every doli business to be part of our virtual community.
                            </div>
                        </li>
                    </ul>
                </section>
                <section className="space-y-4 my-10">
                    <p>So, whether you’re in your own neighbourhood looking to try something new, or out and about in someone else’s, <span className=" font-bold text-[#4d9da8]">if you’re hungry or thirsty, ask a local and doli it.</span> </p>
                    <p>And whilst you don’t have to be a Member to doli it,<span className=" font-bold text-[#4d9da8]"> community requires participation to truly thrive… </span>so c’mon, become a Member and give your favourite local ⭐️⭐️⭐️⭐️⭐️</p>
                </section>
                <section className="text-3xl font-bold">
                    <p>Cheers, Team doli</p>
                </section>
            </body >
        </>

    )
}
