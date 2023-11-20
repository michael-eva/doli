import { Link } from "react-router-dom"
import supabase from "../config/supabaseClient";


export default function NavBar({ session }: any) {

    console.log("navbar session:", session);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Error logging out:', error.message);
            } else {
                console.log('User logged out successfully');

            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-md mb-10">
            <div className="navbar-start">
                <p className=" p-5 normal-case text-xl">doli</p>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 ">
                    <li className="text-xl"><Link to='/'>Listings</Link></li>
                    <li className="text-xl"><Link to='/business-register'>Post a Listing</Link></li>
                    {!session && <li className="text-xl"><Link to='/member-register'>Become a Member</Link></li>}
                    <li className="text-xl"><Link to='/about'>About</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <ul className="menu menu-horizontal ">
                    {session ?
                        <li className="text-xl"><button onClick={handleLogout}>Logout</button></li>
                        :
                        <li className="text-xl"><Link to='/login'>Login</Link></li>
                    }
                </ul>

            </div>
        </div>
    )
}
