import supabase from "../config/supabaseClient";
import { useState, useEffect, useContext } from "react";
import { ToggleContext } from "./Toggle/Toggle";
import { MemberType } from "../Types";

export default function ForgotPassword() {
    const { toggle }: any = useContext(ToggleContext)
    const [isRecoverySubmitting, setIsRecoverySubmitting] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)
    const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("")
    const [members, setMembers] = useState<MemberType[]>([])

    useEffect(() => {
        const getUsers = async () => {
            try {
                const { data, error } = await supabase
                    .from("members")
                    .select("*")
                if (error) {
                    throw error
                }
                if (data) {
                    setMembers(data)
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                throw error
            }
        }
        getUsers()
    }, [])
    console.log(members);

    const handleResetPassword = async (event: any) => {
        event.preventDefault()
        const isMember = members.some(member => member.email === email);
        if (isMember) {
            setIsRecoverySubmitting(true)
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://doli.com.au/reset-password" })
                if (error) throw error
                setSuccess(true)
            } catch (error) {
                console.error('Error resetting password:', error)
                setSuccess(false)
            }
        } else {
            setResetPasswordEmail('No member with that email address exists');
            setSuccess(false);
            return
        }
        setResetPasswordEmail("")
        setIsRecoverySubmitting(false)
    }

    const recoveryBtnEl = () => {
        if (success) {
            return null
        } else {
            return <button className="btn btn-primary mt-7 w-full" onClick={handleResetPassword}>Send recovery email</button>
        }
    }
    return (
        <>

            <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                Forgot Password?
            </div>
            <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                <div className="modal-box ">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={toggle}>✕</button>
                    <div className="flex gap-4 flex-col">
                        <label className="label">
                            <span className="label-text w-24">Email</span>
                        </label>
                        {success ?
                            <p>Check your email for a password reset link.</p>
                            :
                            <input
                                type="email"
                                placeholder="Type here"
                                className="input input-bordered"
                                value={email}
                                name="email"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        }
                        {isRecoverySubmitting ? <button className="btn w-full btn-disabled mt-7">Sending...<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                            :
                            recoveryBtnEl()
                        }
                        {resetPasswordEmail && <p>{resetPasswordEmail}</p>}
                    </div>
                </div>

            </div>
        </>
    )
}
