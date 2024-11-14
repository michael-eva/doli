import { NavLink } from "react-router-dom";

export default function DesktopNavLinks() {

    return (
        <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal px-1">
                <li className="text-xl"><NavLink to='/'>Home</NavLink></li>
                <li className="text-xl"><NavLink to='/about'>About</NavLink></li>
                <li className="text-xl"><NavLink to={'post-listing'}>Register Business</NavLink></li>
            </ul>
        </div>
    );
} 