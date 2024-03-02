import { SocialIcon } from "react-social-icons"
import 'react-social-icons/instagram'
import 'react-social-icons/facebook'
import { NavLink } from "react-router-dom"
export default function Footer() {
    return (
        <footer className=" shadow-inner" style={{ backgroundColor: "#4f9ea8" }}>
            <div className=" p-2 md:p-2 flex items-center justify-evenly">
                <p className=" text-center hidden md:block text-white">©️ All Rights Reserved 2024</p>
                <div>
                    <div className=" cursor-pointer flex gap-3 text-white">
                        <NavLink to={'/'} className="hidden md:block">Home</NavLink>
                        <NavLink to={"mailto:admin@doli.com.au"}>Contact</NavLink>
                        <NavLink to={"https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Privacy%20Policy.pdf?t=2024-03-02T06%3A43%3A32.620Z"} target="_blank">Privacy Policy</NavLink>
                        <NavLink to={"https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Terms%20of%20Service.pdf?t=2024-03-02T06%3A44%3A23.692Z"} target="_blank">Terms of Service</NavLink>
                    </div>
                </div>
                <div className=" gap-2 pl-2 rounded-xl hidden md:flex">
                    <SocialIcon url="https://www.instagram.com/doli.com.au/" target="_blank" bgColor="#4f9ea8" fgColor="white" />
                    <SocialIcon url="https://www.facebook.com/profile.php?id=100075729496242" target="_blank" bgColor="#4f9ea8" fgColor="white" />
                </div>
            </div>
            <div className=" flex p-2 rounded-xl items-center md:hidden justify-evenly">
                <div className="flex gap-2">
                    <SocialIcon url="https://www.instagram.com/doli.com.au/" target="_blank" style={{ width: "30px", height: "30px" }} />
                    <SocialIcon url="https://www.facebook.com/profile.php?id=100075729496242" target="_blank" style={{ width: "30px", height: "30px" }} />
                </div>
                <p className=" text-center md:hidden text-white">©️ All Rights Reserved 2024</p>
            </div>

        </footer>
    )

}
