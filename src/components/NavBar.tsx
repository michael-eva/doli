import { NavLink, useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient";
import { Toaster, toast } from "react-hot-toast"
import { useUser } from "@supabase/auth-helpers-react";
import { IoIosLogOut } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import SearchComp from "./SearchComp";
import { useMediaQuery } from "react-responsive"

export default function NavBar() {
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const navigate = useNavigate()
    const user = useUser()
    const location = useLocation()
    const isResetPasswordPage = location.pathname === '/reset-password'
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
    function postListingEl() {

        if (user) {
            return <NavLink to='/post-listing'>Post a Listing</NavLink>;
        } else {
            return <button onClick={() => navigate('/login', { state: { message: 'Please login or signup to post a listing', location: "/member-register" } })}>Post a Listing</button>;
        }
    }
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
    function profileEl() {
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

                    {isJod && <li><NavLink to={'validate-updates'}>Validate Updates</NavLink></li>
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
        <div className="navbar bg-base-100 shadow-md md:mb-10 z-[3]">

            <div className="navbar-start">
                <NavLink to='/'>
                    <img src="images/IMG_20231227_130328.jpg" alt="" width={80} />
                </NavLink>
            </div>
            <div className="navbar-center hidden md:flex">
                <ul className="menu menu-horizontal px-1 ">
                    <li className="text-xl"><NavLink to='/'>Home</NavLink></li>
                    <li className="text-xl ">{postListingEl()}</li>
                    <li className="text-xl"><NavLink to='/about'>About</NavLink></li>
                    <li className="text-xl">{specialsEl()}</li>
                    <li className="text-xl">{wholesaleEl()}</li>
                </ul>
            </div>
            <div className={`${isMobile ? "navbar-center" : "navbar-end"} m-auto flex items-center`}>
                <div className="menu menu-horizontal flex items-center md:gap-10 gap-5">
                    <SearchComp />
                    {user ?
                        <>
                            <div className="text-xl md:ml-10 md:mr-5">{profileEl()}</div>
                            <div className="md:hidden text-2xl">
                                <div className="dropdown dropdown-bottom dropdown-end">
                                    <div tabIndex={1} role="button"><CiMenuBurger /></div>
                                    <ul tabIndex={1} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><NavLink to='/'>Home</NavLink></li>
                                        <li>{postListingEl()}</li>
                                        <li ><NavLink to='/about'>About</NavLink></li>
                                        <li>{specialsEl()}</li>
                                        <li>{wholesaleEl()}</li>
                                    </ul>
                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="dropdown dropdown-bottom dropdown-end md:hidden">
                                <div tabIndex={1} role="button"><CiMenuBurger /></div>
                                <ul tabIndex={1} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><NavLink to='/'>Home</NavLink></li>
                                    <li>{postListingEl()}</li>
                                    <li ><NavLink to='/about'>About</NavLink></li>
                                    <li>{specialsEl()}</li>
                                    <li>{wholesaleEl()}</li>
                                </ul>
                            </div>
                            <div className=" flex items-center">
                                <div className="md:text-xl md:ml-10 md:mr-5"><NavLink to='/login'>Login / Signup</NavLink></div>
                            </div>
                        </>
                    }
                </div>

            </div>
            <Toaster />
        </div>
    )
}
