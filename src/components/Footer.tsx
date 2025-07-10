import { SocialIcon } from "react-social-icons"
import 'react-social-icons/instagram'
import 'react-social-icons/facebook'
import { NavLink } from "react-router-dom"
export default function Footer() {
    return (
        <footer className=" shadow-inner" style={{ backgroundColor: "#4f9ea8" }}>
            <div className=" p-2 md:p-2 flex items-center justify-evenly">
                <p className=" text-center hidden md:block text-white">©️ All Rights Reserved 2025</p>
                <div>
                    <div className=" cursor-pointer flex gap-3 text-white">
                        <p className="hidden md:block">|</p>
                        <NavLink className=" hover:text-orange-400" to={"https://www.noggins.co/_files/ugd/15a67b_d209eac9e13549748f1108d909bcf2f9.pdf"} target="_blank">Policies, Terms & Conditions</NavLink>
                        {/* <p className="hidden md:block">|</p> */}
                        {/* <NavLink className=" hover:text-orange-400" to={"https://yagpsuctumdlmcazzeuv.supabase.co/storage/v1/object/public/website_documents/Terms%20of%20Service.pdf?t=2024-03-02T06%3A44%3A23.692Z"} target="_blank">Terms of Service</NavLink> */}
                        <p className="hidden md:block">|</p>
                    </div>
                </div>
                <div className=" gap-2 pl-2 rounded-xl hidden md:flex">
                    <SocialIcon url="https://www.instagram.com/doli.com.au/" target="_blank" bgColor="#4f9ea8" fgColor="white" />
                    <SocialIcon url="https://www.facebook.com/stillserving.com.au" target="_blank" bgColor="#4f9ea8" fgColor="white" />
                </div>
            </div>
            <div className=" flex p-2 rounded-xl items-center md:hidden justify-evenly">
                <div className="flex gap-2">
                    <SocialIcon url="https://www.instagram.com/doli.com.au/" target="_blank" style={{ width: "30px", height: "30px" }} />
                    <SocialIcon url="https://www.facebook.com/stillserving.com.au" target="_blank" style={{ width: "30px", height: "30px" }} />
                </div>
                <p className=" text-center md:hidden text-white">©️ All Rights Reserved 2025</p>
            </div>

        </footer>
    )

}
