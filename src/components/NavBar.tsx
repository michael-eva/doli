import { NavLink, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useUser } from "@supabase/auth-helpers-react"
import { useMediaQuery } from "react-responsive"
import { useEffect, useState, Suspense, lazy } from "react"
import supabase from "@/config/supabaseClient"

// Import new components
// import Logo from "./Logo" // You'll need to create this simple component
import DesktopNavLinks from "./NavBar/DesktopNavLinks"
import MobileMenu from "./NavBar/MobileMenu"
const ProfileMenu = lazy(() => import('./NavBar/ProfileMenu'))
import Toggle from "./Toggle/Toggle"
import { FacebookMessengerShareButton, WhatsappShareButton } from "react-share"
import ToggleOn from "./Toggle/ToggleOn"
import ToggleButton from "./Toggle/ToggleButton"
import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa"
import { sendEnquiry } from "@/Jod/utils/resend"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
const CustomModal = lazy(() => import('./Modals/CustomModal'))

export default function NavBar() {
    const isMobile = useMediaQuery({ maxWidth: 640 })
    const navigate = useNavigate()
    const user = useUser()
    const [isJod, setIsJod] = useState<boolean | null>(null)

    useEffect(() => {
        const checkJodStatus = async () => {
            if (!user?.id) {
                setIsJod(false)
                return
            }

            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq('id', user.id)
                .eq('isJod', true)

            if (error) {
                console.error("Error:", error)
                return
            }
            setIsJod(data && data.length > 0)
        }

        checkJodStatus()
    }, [user?.id])


    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            toast.success("Logged out successfully")
            navigate("/")
        } catch (error: any) {
            console.error('Error:', error.message)
            toast.error("Failed to logout")
        }
    }

    return (
        <div className="navbar shadow-md md:mb-10 z-[3] bg-white">
            {/* Left section */}
            <NavLink to='/' className="flex-none">
                <img src="images/IMG_20231227_130328.jpg" alt="" width={80} />
            </NavLink>

            {/* Center section - Desktop Nav Links */}
            <div className="flex-1 flex justify-center">
                <DesktopNavLinks />
            </div>

            {/* Right section */}
            <div className="flex-none">
                <div className="menu menu-horizontal flex items-center gap-5">
                    {user ? (
                        <>
                            {/* Mobile Menu Button */}
                            <div className="md:hidden">
                                <MobileMenu isMobile={isMobile} />
                            </div>
                            {/* Profile Menu */}
                            <div className="text-xl">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <ProfileMenu
                                        isJod={isJod || false}
                                        isMobile={isMobile}
                                        handleLogout={handleLogout}
                                    />
                                </Suspense>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Mobile Menu for Non-authenticated Users */}
                            <div className="md:hidden">
                                <MobileMenu isMobile={isMobile} />
                            </div>
                            {/* Sign In/Up Link */}
                            <div className="text-xl">
                                <NavLink to='/login'>Sign In / Up</NavLink>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
export function ReferFriend({ isMobile }: any) {
    return (
        <Toggle >
            <ToggleButton className=" text-[#4f9ea8] font-bold">
                <h2>Tell a Friend</h2>
            </ToggleButton>
            <ToggleOn>
                <Suspense fallback={<div>Loading...</div>}>
                    <CustomModal>
                        <h1 className=" text-xl">Tell a friend via:</h1>
                        <section className="mt-4 flex gap-5 justify-center">
                            {!isMobile && <div className="flex text-3xl text-blue-500">
                                <FacebookMessengerShareButton url={`https://doli.com.au/member-register`} appId="785444670112157">
                                    <FaFacebookMessenger />
                                </FacebookMessengerShareButton>
                            </div>}
                            {isMobile &&
                                <div className="flex  items-center text-3xl text-blue-500">
                                    <a href={`fb-messenger://share?link=https://doli.com.au/member-register`} target="_blank">
                                        <FaFacebookMessenger />
                                    </a>
                                </div>
                            }
                            <WhatsappShareButton url={`https://doli.com.au/member-register`} title={"Support YOUR community, become a member!"}>
                                <div className=" text-4xl text-green-500"><FaWhatsapp /></div>
                            </WhatsappShareButton>
                        </section>
                    </CustomModal>
                </Suspense>
            </ToggleOn>
        </Toggle>
    )
}
export function ContactUsDialog() {
    const [message, setMessage] = useState('');
    const user = useUser()
    const navigate = useNavigate();

    function SendEmail() {
        sendEnquiry(user?.email, message, "New Enquiry")
    }

    const handleClick = () => {
        if (!user) {
            navigate('/login', {
                state: { message: "Please log in to contact us" }
            });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="text-[#4f9ea8] font-bold"
                    onClick={handleClick}
                >
                    Contact Us
                </button>
            </DialogTrigger>
            {user && (
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Message Us</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <textarea
                                className="col-span-4 p-2 border-2 border-gray-300 rounded-md min-h-[140px]"
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required={true}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <button
                            className="btn w-full mt-4"
                            style={{ backgroundColor: "#4f9ea8", color: "white" }}
                            onClick={SendEmail}
                            disabled={message.trim() === ""}
                        >
                            Send Message
                        </button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    )
}