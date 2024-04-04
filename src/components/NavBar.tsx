import { NavLink, useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient";
import { Toaster, toast } from "react-hot-toast"
import { useUser } from "@supabase/auth-helpers-react";
import { IoIosLogOut } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { useMediaQuery } from "react-responsive"
import { FaFacebookMessenger, FaUserFriends, FaWhatsapp } from "react-icons/fa";
import Toggle from "./Toggle/Toggle";
import ToggleButton from "./Toggle/ToggleButton";
import { FacebookMessengerShareButton, WhatsappShareButton } from "react-share";
import CustomModal from "./Modals/CustomModal";
import ToggleOn from "./Toggle/ToggleOn";

export default function NavBar() {
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const navigate = useNavigate()
    const user = useUser()
    const [isJod, setIsJod] = useState<boolean | null>(null)


    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
            } else {
                toast.success("Logged out successfully")
                console.log('User logged out successfully');
                navigate("/")
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    };
    function specialsEl() {
        if (user) {
            return <NavLink to='/specials'>Specials</NavLink>;
        } else {
            return <button onClick={() => navigate('/login', { state: { message: 'Please login or signup to view specials' } })}>Specials</button>;
        }
    }
    function wholesaleEl() {
        if (user) {
            return <NavLink to='/wholesale'>Wholesale</NavLink>;
        } else {
            return <button onClick={() => navigate('/login', { state: { message: 'Please login or signup to view wholesales' } })}>Wholesale</button>;
        }
    }
    function ProfileEl() {
        return (
            <div className="dropdown dropdown-end dropdown-hover ">
                <div tabIndex={0} role="button" className="text-xl">
                    <div className="flex items-center gap-2 ">
                        <p className=" hidden md:flex" >Profile</p>
                        <RxAvatar />
                    </div>
                </div>
                <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><NavLink to={'update-details'}>Update Details</NavLink></li>
                    <li><NavLink to={'manage-listings'}>Manage Listings</NavLink></li>
                    <li><NavLink to={'post-listing'}>Register Business</NavLink></li>
                    {isJod && <li><NavLink to={'dashboard'}>Dashboard</NavLink></li>
                    }
                    <div className="divider" style={{ margin: '0' }}></div>
                    <li className=" text-red-600"><a onClick={handleLogout}><IoIosLogOut />Logout</a></li>
                </ul>
            </div >
        )
    }
    useEffect(() => {
        const getMembers = async () => {
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq('id', user?.id)
                .eq('isJod', true) // Filter for 'isJod' property being true

            if (error) {
                return console.error("Error:", error);
            }
            if (data && data.length > 0) {
                setIsJod(true);
            }
        }
        if (user?.id) {
            getMembers();
        }
        if (!user) {
            setIsJod(false)
        }
    }, [user?.id]);

    return (
        <div className="navbar shadow-md md:mb-10 z-[3] bg-white">

            <div className="navbar-start">
                <NavLink to='/'>
                    <img src="images/IMG_20231227_130328.jpg" alt="" width={80} />
                </NavLink>
            </div>
            <div className="navbar-center hidden md:flex">

                <ul className="menu menu-horizontal px-1 ">
                    <li className="text-xl"><NavLink to='/'>Home</NavLink></li>
                    {/* <li className="text-xl ">{postListingEl()}</li> */}
                    <li className="text-xl"><NavLink to='/about'>About</NavLink></li>
                    <li className="text-xl">{specialsEl()}</li>
                    <li className="text-xl">{wholesaleEl()}</li>
                </ul>
            </div>
            <div className={`${isMobile ? "navbar-center" : "navbar-end"} m-auto flex items-center`}>
                <ReferFriend isMobile={isMobile} />
                <div className="menu menu-horizontal flex items-center md:gap-10 gap-5">
                    {user ?
                        <>
                            <div className="md:hidden text-2xl">
                                <div className="dropdown dropdown-bottom dropdown-end">
                                    <div tabIndex={1} role="button" className=" text-2xl"><CiMenuBurger /></div>
                                    <ul tabIndex={1} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><NavLink to='/'>Home</NavLink></li>
                                        {/* <li>{postListingEl()}</li> */}
                                        <li ><NavLink to='/about'>About</NavLink></li>
                                        <li>{specialsEl()}</li>
                                        <li>{wholesaleEl()}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="text-xl md:ml-10 md:mr-5"><ProfileEl /></div>
                        </>
                        :
                        <>
                            <div className="dropdown dropdown-bottom dropdown-end md:hidden">
                                <div tabIndex={1} role="button" className=" text-2xl"><CiMenuBurger /></div>
                                <ul tabIndex={1} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><NavLink to='/'>Home</NavLink></li>
                                    {/* <li>{postListingEl()}</li> */}
                                    <li ><NavLink to='/about'>About</NavLink></li>
                                    <li>{specialsEl()}</li>
                                    <li>{wholesaleEl()}</li>
                                </ul>
                            </div>
                            <div className=" flex items-center">
                                <div className="md:text-xl md:ml-10 md:mr-5"><NavLink to='/login'>Sign In</NavLink></div>
                                {/* <div className="md:text-xl md:ml-10 md:mr-5"><NavLink to='/login'>Login / Signup</NavLink></div> */}
                            </div>
                        </>
                    }
                </div>

            </div>
            <Toaster />
        </div>
    )
}
function ReferFriend() {
    return (
        <Toggle>
            <ToggleButton className="px-4 py-2 border-white border-2 text-white mr-4 rounded-lg bg-[#4e9da8] flex items-center gap-2">
                <h2>Tell a Friend</h2>
                <FaUserFriends />
            </ToggleButton>
            <ToggleOn>
                <CustomModal>
                    <h1 className=" text-xl">Tell a friend via:</h1>
                    <section className="mt-4 flex gap-5 justify-center">
                        <div className="flex text-3xl text-blue-500">
                            <FacebookMessengerShareButton
                                title="test tickles"
                                url="https://doli.com.au/member-register"
                                appId="785444670112157"
                            >
                                <FaFacebookMessenger />
                            </FacebookMessengerShareButton>
                        </div>
                        <WhatsappShareButton url={`https://doli.com.au/member-register`} title={"Support YOUR community, become a member!"}>
                            <div className=" text-4xl text-green-500"><FaWhatsapp /></div>
                        </WhatsappShareButton>
                    </section>
                </CustomModal>
            </ToggleOn>
        </Toggle>
    )
}