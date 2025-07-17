import { NavLink } from "react-router-dom";


export default function DesktopNavLinks() {

    return (
        <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal px-1">
                <li className="text-xl"><NavLink to='/'>Home</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><NavLink to='/about'>About</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl dropdown dropdown-hover">
                    <div tabIndex={0} role="button" className="text-xl">
                        Gig Guide
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-[165px] !text-xl">
                        <li><NavLink to='/gig-guide/artists'>Artists</NavLink></li>
                        <li><NavLink to='/gig-guide/gigs'>Gigs</NavLink></li>
                    </ul>
                </li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl dropdown dropdown-hover">
                    <div tabIndex={0} role="button" className="text-xl">
                        Register
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[2] menu p-2 shadow bg-base-100 rounded-box w-[165px] !text-xl">
                        <li><NavLink to={'register/artist'}>Artist</NavLink></li>
                        <li><NavLink to={'register/business'}>Business</NavLink></li>
                    </ul>
                </li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><NavLink to={'https://noggins.deco-apparel.com'} target="_blank">Merch</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><NavLink to={'contact-us'}>Contact Us</NavLink></li>
            </ul>
        </div>
    );
} 