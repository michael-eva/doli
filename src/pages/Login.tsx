import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate, useLocation } from "react-router"
import toast, { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import ForgotPassword from "../components/ForgotPassword"
import Toggle from "../components/Toggle/Toggle"
import ToggleButton from "../components/Toggle/ToggleButton"
import ToggleOn from "../components/Toggle/ToggleOn"
import { MemberType } from "../Types"
import { Helmet } from 'react-helmet'
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
            {/* <Helmet>
                <title>doli | Sign In</title>
                <meta name="description" content="Login to doli - description" />
                <meta name="title" content="Login to doli - title" />

                <meta name="og:title" content="Login to doli - OG title" />
                <meta name="og:description" content="Login to doli - OG description" />
            </Helmet> */}
            <SEO
                title="doli"
                description="Sign In | doli, the home-grown service that makes it easy for you to find and support the hospitality businesses that positively contribute to the fabric of your community."
                name="doli"
                type="website" />
            <div className="shadow-2xl max-w-xl px-10 md:px-24 pb-12 pt-12 m-auto rounded-lg">
                {location.state && (
                    <p className=" mb-5 text-red-600 italic">*{location.state.message}</p>
                )}
                <form onSubmit={handleSubmit((data) => handleFormSubmit(data as LoginData))}>
                    <div className="  gap-2 md:gap-5 flex flex-col ">
                        <p className=" text-lg font-semibold text-center">{`${title ? title : "Please enter your login details:"}`}</p>
                        {loginError && (<p className=" text-red-600 italic">*An account with that email address doesn't exist</p>)}
                        <div className="md:flex">
                            <label className="label">
                                <span className="label-text w-24">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Type here"
                                className="input input-bordered w-full"
                                style={{ backgroundColor: "white", color: "black" }}
                                {...register('email', { required: "Please enter your email address" })}
                            />
                        </div>
                        {errors.email && <p className=" text-red-600">*{errors.email.message?.toString()}</p>}
                        {isUser.length > 0 && <p className=" text-red-600 italic">Password is incorrect</p>}
                        <div className="md:flex">
                            <label className="label">
                                <span className="label-text w-24">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Type here"
                                className="input input-bordered w-full"
                                {...register('password', { required: "Please enter your password" })}
                            />
                        </div>
                        {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                        <div>
                            {isSubmitting ? <button className="btn w-full btn-disabled mt-4">Loggin in...<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                                :
                                <button className="btn btn-primary w-full mt-4">Login</button>
                            }
                            <Toggle>
                                <ToggleButton className=" text-sm underline italic cursor-pointer">
                                    Forgot Password?
                                </ToggleButton>
                                <ToggleOn>
                                    <ForgotPassword />
                                </ToggleOn>
                            </Toggle>
                        </div>
                    </div>
                </form>
                <div className="flex flex-col items-center gap-2 mt-4">
                    <p>Not yet a member?</p>
                    <Link to="/member-register" className="btn w-48 btn-success">Sign up here</Link>
                </div>
                <Toaster />
            </div>
        </>
    )
}
