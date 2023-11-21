import { Link, useNavigate } from "react-router-dom"
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
            return <Link to='/business-register'>Post a Listing</Link>;
        } else {
            return <>
                <button onClick={() => document.getElementById('my_modal_1').showModal()}>Post a Listing</button>
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4">Become a member to post a listing:</p>
                        <div className="modal-action">
                            <form method="dialog" className="flex gap-8">
                                <button onClick={() => navigate("/member-register")} className="btn btn-primary">Become a Member</button>
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </>
        }
    }



    return (
        <div className="navbar bg-base-100 shadow-md mb-10">
            <div className="navbar-start">
                <p className=" p-5 normal-case text-xl">doli</p>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 ">
                    <li className="text-xl"><Link to='/'>Listings</Link></li>
                    <li className="text-xl">{postListingEl()}</li>
                    {!session ? <li className="text-xl"><Link to='/member-register'>Become a Member</Link></li>
                        : <li className="text-xl"><Link to='/manage-listings'>Manage Listings</Link></li>
                    }
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
            <Toaster />
        </div>
    )
}
