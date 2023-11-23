import { NavLink, useNavigate } from "react-router-dom"
import supabase from "../config/supabaseClient";
import { Toaster, toast } from "react-hot-toast"


export default function NavBar({ session }: any) {
    const navigate = useNavigate()


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

        if (session) {
            return <NavLink to='/business-register'>Post a Listing</NavLink>;
        } else {
            return <button onClick={() => navigate('/login', { state: { message: 'Please login or signup to post a listing', location: "/member-register" } })}>Post a Listing</button>;
        }
    }

    function specialsEl() {
        if (session) {
            return <NavLink to='/specials'>Specials</NavLink>;
        } else {
            return <button onClick={() => navigate('/login', { state: { message: 'Please login or signup to view specials' } })}>Specials</button>;
        }
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
                    {/* {!session ? <li className="text-xl"><NavLink to='/member-register'>Become a Member</NavLink></li>
                        : <li className="text-xl"><NavLink to='/manage-listings'>Manage Listings</NavLink></li>
                    } */}
                    <li className="text-xl">{specialsEl()}</li>
                </ul>
            </div>
            <div className="navbar-end">
                <ul className="menu menu-horizontal ">
                    {session ?
                        <li className="text-xl"><button onClick={handleLogout}>Logout</button></li>
                        :
                        <li className="text-xl"><NavLink to='/login'>Login / Signup</NavLink></li>
                    }
                </ul>

            </div>
            <Toaster />
        </div>
    )
}
