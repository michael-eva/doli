import { NavLink } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";
import { ReferFriend } from "../NavBar";
import { ContactUsDialog } from "../ContactUsDialog";


interface ProfileMenuProps {
    isJod: boolean;
    isMobile: boolean;
    handleLogout: () => void;
    userHasBusiness: boolean;
}

export default function ProfileMenu({ isJod, isMobile, handleLogout, userHasBusiness }: ProfileMenuProps) {
    return (
        <div className="dropdown dropdown-end dropdown-hover">
            <div tabIndex={0} role="button" className="text-xl">
                <div className="flex items-center gap-2">
                    <p className="hidden md:flex">Profile</p>
                    <RxAvatar />
                </div>
            </div>
            <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-[165px]">
                <li><NavLink to={'update-details'}>My Profile</NavLink></li>
                <li><NavLink to={'manage-listings'}>My Businesses</NavLink></li>
                {!isMobile && <li><NavLink to={'post-listing'}>Register Business</NavLink></li>}
                {isJod && <li><NavLink to={'dashboard'}>Dashboard</NavLink></li>}
                {!userHasBusiness && <li><NavLink to={'add-gigs'}>Add Gigs</NavLink></li>}
                <div className="divider" style={{ margin: '0' }}></div>
                {!isMobile && <li><ReferFriend /></li>}
                {isMobile && <li><ContactUsDialog /></li>}
                <div className="divider" style={{ margin: '0' }}></div>
                <li className="text-red-600"><a onClick={handleLogout}><IoIosLogOut />Logout</a></li>
            </ul>
        </div>
    );
} 