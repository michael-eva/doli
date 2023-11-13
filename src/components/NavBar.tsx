import { Link } from "react-router-dom"

export default function NavBar() {
    return (
        <div className="navbar bg-base-100 shadow-md mb-10">
            <div className="navbar-start">
                <p className=" p-5 normal-case text-xl">doli</p>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 ">
                    <li className="text-xl"><Link to='/'>Listings</Link></li>
                    <li className="text-xl"><Link to='/register'>Post a Listing</Link></li>
                    <li className="text-xl"><Link to='/about'>About</Link></li>
                </ul>
            </div>
            <div className="navbar-end">

            </div>
        </div>
    )
}
