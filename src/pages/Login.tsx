import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate, useLocation } from "react-router"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import ForgotPassword from "../components/ForgotPassword"
import Toggle from "../components/Toggle/Toggle"
import ToggleButton from "../components/Toggle/ToggleButton"
import ToggleOn from "../components/Toggle/ToggleOn"
import { MemberType } from "../Types"
import SEO from "@/lib/SEO"


type LoginData = {
    email: string,
    password: string
}

type LoginProps = {
    title?: string
}

export default function Login({ title }: LoginProps) {
    let navigate = useNavigate()
    const [isUser, setIsUser] = useState<string>("")
    const location = useLocation()
    const [members, setMembers] = useState<MemberType[]>([])
    const [loginError, setLoginError] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [isAgree, setIsAgree] = useState<boolean>(true)
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

    async function handleFormSubmit(data: LoginData) {
        setLoginError("");
        setIsUser("");
        const existingUser = members.find(member => member.email === data.email);
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

    return (
        <>
            <SEO
                title="doli | Sign In"
                description="Sign In | doli, the home-grown service that makes it easy for you to find and support the hospitality businesses that positively contribute to the fabric of your community."
                name="doli"
                type="website" />
            <div className="shadow-2xl max-w-xl px-10 md:px-24 pb-12 pt-12 m-auto rounded-lg">
                {location.state && (
                    <p className=" mb-5 text-red-600 italic">*{location.state.message}</p>
                )}
                <div className="flex flex-col items-center mb-6">
                    <img src="/images/noggins_logo.png" alt="doli" className="w-24 h-24 mb-5" />
                    <p className="text-lg font-semibold text-center">Powered by noggins.co</p>
                </div>
                <form onSubmit={handleSubmit((data) => handleFormSubmit(data as LoginData))}>
                    <div className="  gap-2 md:gap-5 flex flex-col ">
                        {/* <p className=" text-lg font-semibold text-center">{`${title ? title : "Please enter your login details:"}`}</p> */}
                        {loginError && (<p className=" text-red-600 italic">*An account with that email address doesn't exist</p>)}
                        <div className="md:flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="input input-bordered w-full"
                                style={{ backgroundColor: "white", color: "black" }}
                                {...register('email', { required: "Please enter your email address" })}
                            />
                        </div>
                        {errors.email && <p className=" text-red-600">*{errors.email.message?.toString()}</p>}
                        {isUser.length > 0 && <p className=" text-red-600 italic">Password is incorrect</p>}
                        <div className="md:flex">
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full"
                                {...register('password', { required: "Please enter your password" })}
                            />
                        </div>
                        {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                        <div className="flex flex-col gap-3">
                            {isSubmitting ? <button className="btn w-full btn-disabled">Signing in...<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                                :
                                <button className={`btn !bg-[#0866ff] w-full !text-white ${!isAgree ? "!bg-blue-300" : ""}`} disabled={!isAgree}>Sign In</button>
                            }
                            <Toggle>
                                <ToggleButton className=" text-sm text-blue-500 cursor-pointer text-center">
                                    Forgot Password?
                                </ToggleButton>
                                <ToggleOn>
                                    <ForgotPassword />
                                </ToggleOn>
                            </Toggle>
                        </div>
                    </div>
                </form>
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 w-full">
                        <div className="w-1/2 h-[1px] bg-gray-300 "></div>
                        <p className="text-gray-400">or</p>
                        <div className="w-1/2 h-[1px] bg-gray-300 "></div>
                    </div>
                    <Link to="/member-register" className="btn w-48 btn-success !bg-[#42b72a] !text-white">Sign Up</Link>
                </div>
                <div className=" flex items-center gap-3 mt-5">
                    <label className="cursor-pointer label">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={isAgree}
                                onChange={() => setIsAgree(!isAgree)}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded transition-colors duration-200 ${isAgree
                                ? 'bg-white border-gray-500'
                                : 'bg-white border-gray-300'
                                }`}>
                                {isAgree && (
                                    <svg
                                        className="absolute inset-0 w-5 h-5 text-black pointer-events-none"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </label>
                    <span className="label-text">I agree to the <span></span>
                        <a className=" text-bold underline cursor-pointer" href="https://www.noggins.co/_files/ugd/15a67b_d209eac9e13549748f1108d909bcf2f9.pdf" target="_blank">Policies, Terms & Conditions</a>
                    </span>
                </div>
            </div>
        </>
    )
}
