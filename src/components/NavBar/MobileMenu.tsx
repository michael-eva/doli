import { NavLink } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { ReferFriend } from "../NavBar";
import { useState } from "react";

interface MobileMenuProps {
    isMobile: boolean;
}

export default function MobileMenu({ isMobile }: MobileMenuProps) {
    const [currentMenu, setCurrentMenu] = useState<'main' | 'gigGuide' | 'register'>('main');

    const goBack = () => setCurrentMenu('main');

    if (currentMenu === 'gigGuide') {
        return (
            <div className="dropdown dropdown-bottom dropdown-end md:hidden">
                <div tabIndex={1} role="button" className="text-2xl"><CiMenuBurger /></div>
                <ul tabIndex={1} className="dropdown-content z-[2] menu shadow bg-base-100 rounded-box w-[200px]">
                    <li>
                        <div className="flex items-center cursor-pointer" onClick={goBack}>
                            <span className="mr-2">←</span>
                            <span>Back</span>
                        </div>
                    </li>
                    <div className="divider" style={{ margin: '0' }}></div>
                    <li><NavLink to='/gig-guide/artists'>Artists</NavLink></li>
                    <li><NavLink to='/gig-guide/gigs'>Gigs</NavLink></li>
                </ul>
            </div>
        );
    }

    if (currentMenu === 'register') {
        return (
            <div className="dropdown dropdown-bottom dropdown-end md:hidden">
                <div tabIndex={1} role="button" className="text-2xl"><CiMenuBurger /></div>
                <ul tabIndex={1} className="dropdown-content z-[2] menu shadow bg-base-100 rounded-box w-[200px]">
                    <li>
                        <div className="flex items-center cursor-pointer" onClick={goBack}>
                            <span className="mr-2">←</span>
                            <span>Back</span>
                        </div>
                    </li>
                    <div className="divider" style={{ margin: '0' }}></div>
                    <li><NavLink to='/register/artist'>Artist</NavLink></li>
                    <li><NavLink to='/register/business'>Business</NavLink></li>
                </ul>
            </div>
        );
    }

    return (
        <div className="dropdown dropdown-bottom dropdown-end md:hidden">
            <div tabIndex={1} role="button" className="text-2xl"><CiMenuBurger /></div>
            <ul tabIndex={1} className="dropdown-content z-[2] menu shadow bg-base-100 rounded-box w-[200px]">
                <li><NavLink to='/'>Home</NavLink></li>
                <li><NavLink to='/about'>About</NavLink></li>
                <li>
                    <div
                        className="cursor-pointer"
                        onClick={() => setCurrentMenu('gigGuide')}
                    >
                        Gig Guide →
                    </div>
                </li>
                <li>
                    <div
                        className="cursor-pointer"
                        onClick={() => setCurrentMenu('register')}
                    >
                        Register →
                    </div>
                </li>
                <li><NavLink to={"https://noggins.deco-apparel.com"} target="_blank">Merch</NavLink></li>
                <li><NavLink to={'contact-us'}>Contact Us</NavLink></li>
                <div className="divider" style={{ margin: '0' }}></div>
                <li className="ml-[-5px]"><ReferFriend isMobile={isMobile} /></li>
            </ul>
        </div>
    );
} 