import { NavLink } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { ReferFriend } from "../NavBar";

interface MobileMenuProps {
    isMobile: boolean;
}

export default function MobileMenu({ isMobile }: MobileMenuProps) {
    return (
        <div className="dropdown dropdown-bottom dropdown-end md:hidden">
            <div tabIndex={1} role="button" className="text-2xl"><CiMenuBurger /></div>
            <ul tabIndex={1} className="dropdown-content z-[2] menu shadow bg-base-100 rounded-box w-[165px]">
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/about'>About</NavLink></li>
                <li><NavLink to={'/gig-guide'}>Gig Guide</NavLink></li>
                <li><NavLink to={'post-listing'}>Register</NavLink></li>
                <li><NavLink to={"https://noggins.deco-apparel.com"} target="_blank">Merch</NavLink></li>
                <li><NavLink to={'contact-us'}>Contact Us</NavLink></li>
                <div className="divider" style={{ margin: '0' }}></div>
                <li className="ml-[-5px]"><ReferFriend isMobile={isMobile} /></li>
            </ul>
        </div>
    );
} 