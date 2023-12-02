import { NavLink, useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient";
import { Toaster, toast } from "react-hot-toast"
import { useUser } from "@supabase/auth-helpers-react";


export default function NavBar() {
    const navigate = useNavigate()
    const user = useUser()

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
    function profileEl() {
        return (
            <div className="dropdown dropdown-end dropdown-hover">
                <div tabIndex={0} role="button" className="text-xl">Profile</div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Update Details</a></li>
                    <li><a>Manage Listings</a></li>
                    <div className="divider" style={{ margin: '0' }}></div>
                    <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
            </div>
        )
    }



    return (
        <div className="navbar bg-base-100 shadow-md mb-10">
            <div className="navbar-start">
                <p className=" p-5 normal-case text-xl"><a href="/">doli</a> </p>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 ">
                    <li className="text-xl"><NavLink to='/'>Home</NavLink></li>
                    <li className="text-xl">{postListingEl()}</li>
                    <li className="text-xl">{specialsEl()}</li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="menu menu-horizontal ">
                    {user ?
                        <div className="text-xl mr-5">{profileEl()}</div>
                        :
                        <div className="text-xl mr-5"><NavLink to='/login'>Login / Signup</NavLink></div>
                    }
                </div>

            </div>
            <Toaster />
        </div>
    )
}
