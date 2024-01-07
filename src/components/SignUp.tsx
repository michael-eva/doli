import { ChangeEvent, useEffect, useState } from "react"
import months from "../data/months.json"
import { nanoid } from "nanoid"
import supabase from "../config/supabaseClient"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@supabase/auth-helpers-react"
import toast, { Toaster } from "react-hot-toast"
import { FaInfoCircle } from "react-icons/fa";
import SimpleModal from "./Modals/SimpleModal"
import Toggle from "./Toggle/Toggle"
import ToggleOn from "./Toggle/ToggleOn"
import ToggleButton from "./Toggle/ToggleButton"
import ForgotPassword from "./ForgotPassword"
import { IoCheckmarkCircleOutline } from "react-icons/io5";


type FormData = {
    gender: string,
    email: string,
    password: string,
    confirmPassword: string,
    birthMonth: string,
    birthYear: string,
    suburb: string,
    altSuburb: string
    country: string
}
const initialFormState = {
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthMonth: "",
    birthYear: "",
    suburb: "",
    altSuburb: "",
    country: ""
};

export default function SignUp() {
    const [emailError, setEmailError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const [formData, setFormData] = useState<FormData>(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
    const user = useUser()
    const navigate = useNavigate()

    const signUpAndInsertData = async () => {
        setIsSubmitting(true)
        try {
            const signUpResponse = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });
            if (signUpResponse.error) {
                if (signUpResponse.error.message === "User already registered") {
                    setEmailError("User already exists")
                    return
                }
                if (signUpResponse.error.message === "Unable to validate email address: invalid format") {
                    setEmailError("Invalid email format")
                    return
                }
                if (signUpResponse.error.message === "Password should be at least 6 characters") {
                    setPasswordError("Password should be at least 6 characters")
                    return
                }
                setPasswordError("")
                setEmailError("")
                return;
            }
            // const signInResponse = await supabase.auth.signInWithPassword({
            //     email: formData.email,
            //     password: formData.password,
            // });

            // if (signInResponse.error) {
            //     console.log(signInResponse.error);
            //     return;
            // }
            // const sessionData = signInResponse.data;

            // return sessionData;

            return signUpResponse
        } catch (error: any) {
            console.error('Error:', error.message);
        }
        setIsSubmitting(false)
    };


    const handleUpdateDetailsSubmit = async (e: any) => {
        setIsSubmitting(true)
        e.preventDefault()

        const { error } = await supabase
            .from("members")
            .update({
                gender: formData.gender,
                email: formData.email,
                birthMonth: formData.birthMonth,
                birthYear: formData.birthYear,
                suburb: formData.suburb,
                altSuburb: formData.altSuburb,
            })
            .eq('id', user?.id)

        if (error) {
            console.error(error);
        }



        setIsSubmitting(false)
        toast.success("Details updated successfully")
        navigate("/")

    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.password != formData.confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }
        setPasswordError("");
        const signUpResponse = await signUpAndInsertData();

        if (signUpResponse && !signUpResponse.error) {
            supabase
                .from("members")
                .insert({
                    id: signUpResponse?.data?.user?.id,
                    gender: formData.gender,
                    email: formData.email,
                    birthMonth: formData.birthMonth,
                    birthYear: formData.birthYear,
                    suburb: formData.suburb,
                    altSuburb: formData.altSuburb,
                    isJod: false
                })
                .single()
                .then(
                    ({ error }) => {
                        if (error) {
                            console.log(error);
                        }
                        setFormData(initialFormState);
                        setPasswordError("")
                        setEmailError("");
                    },
                )
            setHasSubmitted(true)
            // toast.success("Signed up successfully, please check your email")
            // navigate("/")
            // }
        };
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);
    const getMembers = async () => {
        try {
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq('id', user?.id);

            if (error) {
                return console.error(error);
            }

            if (data && data.length > 0) {
                const memberData = data[0];

                const {
                    gender,
                    email,
                    birthMonth,
                    birthYear,
                    suburb,
                    altSuburb,
                } = memberData;

                setFormData({
                    ...formData,
                    gender: gender || "",
                    email: email || "",
                    birthMonth: birthMonth || "",
                    birthYear: birthYear || "",
                    suburb: suburb || "",
                    altSuburb: altSuburb || "",
                });
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }

    };

    useEffect(() => {
        if (user?.id) {
            getMembers();
        }
    }, [user?.id]);

    const getSubmitFunction = () => {
        if (user) {
            return handleUpdateDetailsSubmit
        } else {
            return handleSubmit
        }
    }

    return (
        <>
            {hasSubmitted ?
                <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10 h-96 mt-36">
                    <div className="flex items-center flex-col gap-5">
                        <div style={{ fontSize: "50px" }}>

                            <IoCheckmarkCircleOutline style={{ color: 'green' }} />
                        </div>


                        <h2 className=" text-xl">Submitted.</h2>
                        <h2 className=" text-md">Please check your email inbox for a confirmation link.</h2>
                    </div>
                </div>
                :
                <form onSubmit={getSubmitFunction()}>
                    <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10">
                        <div className="mb-6">
                            <h3 className=" text-xl font-semibold mb-3">
                                {!user ? `Please enter your details:` : `Update user details:`}
                            </h3>
                            {!user && <p className=" text-red-600 italic">Enter description on what it means to be a member</p>}
                        </div>
                        <div className=" flex mt-7 items-center gap-3">
                            {emailError && <p className=" text-lg text-red-600 italic">*{emailError}</p>}
                            {user ? <div className="flex flex-col w-full">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    name="email"
                                    onChange={handleChange}
                                    required
                                    value={formData.email}
                                    disabled
                                />
                            </div>
                                :
                                <div className="flex flex-col w-full">
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        className="input input-bordered "
                                        name="email"
                                        onChange={handleChange}
                                        required
                                        value={formData.email}

                                    />
                                </div>}
                        </div>

                        {passwordError && <p className=" mt-7 text-lg text-red-600 italic">*{passwordError}</p>}
                        {!user && <div className="flex gap-3 mt-7 w-full mb-2">

                            <div className="flex flex-col w-1/2">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input input-bordered "
                                    onChange={handleChange}
                                    name="password"
                                    required
                                    value={formData.password}
                                />
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="input input-bordered "
                                    onChange={handleChange}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                />
                            </div>
                        </div>}
                        <div className="flex gap-3 mt-7 w-full mb-2">
                            <div className="flex flex-col w-1/2">
                                <label>Birth Month</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    name="birthMonth"
                                    onChange={handleChange}
                                    required
                                    value={formData.birthMonth}
                                >
                                    <option value="" disabled selected>- Select Month -</option>
                                    {months.map(month => (
                                        <option key={nanoid()} value={month}>{month}</option>
                                    ))}

                                </select>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Birth Year</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    name="birthYear"
                                    onChange={handleChange}
                                    value={formData.birthYear}
                                    required
                                >
                                    <option value="" disabled selected>- Select Year -</option>
                                    {years.map(year => (
                                        <option value={year} key={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="flex gap-3 mt-7 w-full mb-2">

                            <div className="flex flex-col w-1/2">
                                <label>Gender</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    name="gender"
                                    onChange={handleChange}
                                    value={formData.gender}
                                    required
                                >
                                    <option value="" disabled selected>- Select Gender -</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="female">Non-binary</option>
                                    <option value="other">Other</option>

                                </select>
                            </div>
                            <div className="flex flex-col w-1/2">
                                <div className="flex justify-between">
                                    <p>Country</p>
                                    <Toggle>
                                        <ToggleButton className=" cursor-pointer"> <FaInfoCircle /></ToggleButton>
                                        <ToggleOn>
                                            <SimpleModal title="doli" >Limited to Australia for the time being.</SimpleModal>
                                        </ToggleOn>
                                    </Toggle>
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    name="country"
                                    value="Australia"
                                    disabled
                                />
                            </div>
                        </div>
                        <div className=" flex gap-3 mt-7 w-full mb-2">
                            <div className="flex flex-col w-1/2 mt-4">
                                <label>Suburb</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    name="suburb"
                                    onChange={handleChange}
                                    required
                                    value={formData.suburb}
                                />
                            </div>
                            <div className="flex flex-col w-1/2 mt-4">
                                <div className="flex justify-between">
                                    <label>Alternative suburb</label>
                                    <Toggle>
                                        <ToggleButton className=" cursor-pointer"> <FaInfoCircle /></ToggleButton>
                                        <ToggleOn>
                                            <SimpleModal title="doli">An area you know as well as you know your own neighbourhood.</SimpleModal>
                                        </ToggleOn>
                                    </Toggle>
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    name="altSuburb"
                                    placeholder="Home away from home"
                                    onChange={handleChange}
                                    value={formData.altSuburb}
                                />
                            </div>
                        </div>
                        <Toggle>
                            <ToggleButton className=" text-sm underline italic cursor-pointer">
                                Forgot Password?
                            </ToggleButton>
                            <ToggleOn>
                                <ForgotPassword />
                            </ToggleOn>
                        </Toggle>
                        {isSubmitting ? <button className="btn w-full btn-disabled mt-7">Submitting<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                            :
                            <button className="btn btn-primary mt-7 w-full">Submit</button>
                        }

                        {!user && <div className="mt-5">Already a member? <Link to="/login" className=" italic underline">Log in</Link></div>}
                    </div>
                </form>
            }
            {/* <Toaster /> */}
        </>
    )
}
