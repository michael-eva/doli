import { NavLink } from "react-router-dom";
import { ContactUsDialog } from "../ContactUsDialog";


export default function DesktopNavLinks() {

    return (
        <div className="navbar-center hidden md:flex">
            <ul className="menu menu-horizontal px-1">
                <li className="text-xl"><NavLink to='/'>Home</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><NavLink to='/about'>About</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><NavLink to={'post-listing'}>Register Business</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><NavLink to={'https://noggins.deco-apparel.com'} target="_blank">Merchandise</NavLink></li>
                <li className="text-xl w-0.5 h-8 bg-gray-300"></li>
                <li className="text-xl"><ContactUsDialog /></li>
            </ul>
        </div>
    );
} 