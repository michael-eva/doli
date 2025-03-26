import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { sendEnquiry } from "@/Jod/utils/resend";
import toast from "react-hot-toast";

export function ContactUsDialog() {
    const [message, setMessage] = useState('');
    const [open, setOpen] = useState(false);
    const user = useUser()
    const navigate = useNavigate();

    async function SendEmail() {
        try {
            if (!user?.email) {
                throw new Error("No user email found");
            }
            await sendEnquiry(user.email, message, "New Enquiry");
            toast.success("Email sent successfully");
            setMessage('');
            setOpen(false);
        } catch (error) {
            console.error("Error in SendEmail:", error);
            toast.error("Failed to send email. Please try again later.");
            setMessage('');
            setOpen(false);
        }
    }

    const handleClick = () => {
        if (!user) {
            navigate('/login', {
                state: { message: "Please log in to contact us" }
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className=""
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