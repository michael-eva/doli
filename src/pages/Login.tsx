import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate, useLocation } from "react-router"
import toast, { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"

type Members = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    postcode: string,
    suburb: string
}

type LoginData = {
    email: string,
    password: string
}
export default function Login() {
    let navigate = useNavigate()
    const [isUser, setIsUser] = useState<string>("")
    const location = useLocation()
    const [members, setMembers] = useState<Members[]>([])
    const [loginError, setLoginError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isRecoverySubmitting, setIsRecoverySubmitting] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)
    const [resetPasswordEmail, setResetPasswordEmail] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { register, formState: { errors }, handleSubmit, reset } = useForm()

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

    async function handleFormSubmit(data: LoginData) {
        setLoginError("");
        setIsUser("");
        const existingUser = members.find(member => member.email === data.email);
        console.log(existingUser);

        if (!existingUser) {
            setLoginError("An account with that email address doesn't exist");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ ...data });
        setIsSubmitting(true)

        if (error) {
            console.log(error);
            setIsUser("Password is incorrect");
            setLoginError("");
            setIsSubmitting(false)
            return;
        }

        setIsSubmitting(false)
        toast.success("Logged in successfully");

        setTimeout(() => {
            navigate("/");
        }, 1000);

        reset()
        setLoginError("");
        setIsUser("");
    }
    const handleResetPassword = async (event: any) => {
        event.preventDefault()
        const isMember = members.some(member => member.email === email);
        if (isMember) {
            setIsRecoverySubmitting(true)
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://doli-app.netlify.app/reset-password" })
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
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="shadow-2xl max-w-xl px-24 pb-20 pt-12 m-auto mt-24 rounded-lg">
            {location.state && (
                <p className=" mb-5 text-red-600 italic">*{location.state.message}</p>
            )}
            <form onSubmit={handleSubmit((data) => handleFormSubmit(data as LoginData))}>
                <div className="  gap-9 flex flex-col ">
                    <p className=" text-lg font-semibold pb-5">Please enter your login details:</p>
                    {loginError && (<p className=" text-red-600 italic">*An account with that email address doesn't exist</p>)}
                    <div className="flex">
                        <label className="label">
                            <span className="label-text w-24">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            {...register('email', { required: "Please enter your email address" })}
                        />
                    </div>
                    {errors.email && <p className=" text-red-600">*{errors.email.message?.toString()}</p>}
                    {isUser.length > 0 && <p className=" text-red-600 italic">Password is incorrect</p>}
                    <div className="flex">
                        <label className="label">
                            <span className="label-text w-24">Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            {...register('password', { required: "Please enter your password" })}
                        />
                    </div>
                    {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                    <div>
                        {isSubmitting ? <button className="btn w-full btn-disabled mt-7">Loggin in...<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                            :
                            <button className="btn btn-primary mt-7 w-full">Login</button>
                        }
                        <button onClick={openModal} className=" text-sm underline italic">Forgot password?</button>
                        {isModalOpen && <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                            <div className="modal-box ">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
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
                        </div>}
                    </div>
                </div>
            </form>
            <div className="flex flex-col items-center gap-5 mt-9">
                <p>Not yet a member?</p>
                <Link to="/member-register" className="btn w-48 btn-success">Sign up here</Link>
            </div>
            <Toaster />
        </div>
    )
}
