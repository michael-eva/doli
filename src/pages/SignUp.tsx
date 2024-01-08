import { useEffect, useState } from "react"
import months from "../data/months.json"
import { nanoid } from "nanoid"
import supabase from "../config/supabaseClient"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@supabase/auth-helpers-react"
import toast, { Toaster } from "react-hot-toast"
import { FaInfoCircle } from "react-icons/fa";
import SimpleModal from "../components/Modals/SimpleModal"
import Toggle from "../components/Toggle/Toggle"
import ToggleOn from "../components/Toggle/ToggleOn"
import ToggleButton from "../components/Toggle/ToggleButton"
import ForgotPassword from "../components/ForgotPassword"
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useForm } from "react-hook-form"


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
// const initialFormState = {
//     gender: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     birthMonth: "",
//     birthYear: "",
//     suburb: "",
//     altSuburb: "",
//     country: ""
// };

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
    const { register, setValue, handleSubmit, formState: { errors }, setError, watch, clearErrors, reset } = useForm()
    const user = useUser()
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);

    const signUpAndInsertData = async (data: FormData) => {
        setIsSubmitting(true)
        try {
            const signUpResponse = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            });
            return signUpResponse
        } catch (error: any) {
            console.error('Error:', error.message);
        }
        setIsSubmitting(false)
    };
    const handleUpdateDetailsSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        const { error } = await supabase
            .from("members")
            .update({
                gender: data.gender,
                email: data.email,
                birthMonth: data.birthMonth,
                birthYear: data.birthYear,
                suburb: data.suburb,
                altSuburb: data.altSuburb,
            })
            .eq('id', user?.id)

        if (error) {
            console.error(error);
        }

        setIsSubmitting(false)
        toast.success("Details updated successfully")
        navigate("/")

    }
    const handleNewSubmit = async (data: FormData) => {
        const signUpResponse = await signUpAndInsertData(data);


        if (signUpResponse && !signUpResponse.error) {
            supabase
                .from("members")
                .insert({
                    id: signUpResponse?.data?.user?.id,
                    gender: data.gender,
                    email: data.email,
                    birthMonth: data.birthMonth,
                    birthYear: data.birthYear,
                    suburb: data.suburb,
                    altSuburb: data.altSuburb,
                    isJod: false
                })
                .single()
                .then(
                    ({ error }) => {
                        if (error) {
                            console.log(error)
                        }
                        //react-hook-form method:
                        reset()
                    },
                )
            setHasSubmitted(true)
        };

    }

    const existingEmail = errors.email?.message === "Email already exists in the system"

    const getMembers = async () => {
        try {
            const { data, error }: { data: FormData } = await supabase
                .from("members")
                .select("*")
                .eq('id', user?.id);

            if (error) {
                return console.error(error);
            }

            if (data && data.length > 0) {
                setValue('email', data.email)
                setValue('suburb', data.suburb)
                setValue('altSuburb', data.altSuburb)
                setValue('gender', data.gender)
                setValue('birthMonth', data.birthMonth)
                setValue('birthYear', data.birthYear)
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
    const getSubmitFunction = (data: FormData) => {
        if (user) {
            return handleUpdateDetailsSubmit(data)
        } else {
            return handleNewSubmit(data)
        }
    }
    const checkEmailExists = async (email: string) => {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('email', email);

            if (error) {
                console.error('Error fetching user:', error.message);
                return
            }

            if (data && data.length > 0) {

                setError('email', {
                    type: 'manual',
                    message: 'Email already exists in the system',
                });
                return

            } else {
                clearErrors("email")
            }
        } catch (error) {
            console.error('Error:', error.message);
            return
        }
    };

    const checkPasswordMatches = (value: string) => {
        if (value === watch().password) {
            clearErrors("confirmPassword");
        } else {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords don't match",
            });
        }
    }


    return (
        <>
            {hasSubmitted ?
                <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10 h-96 mt-36 justify-center">
                    <div className="flex items-center flex-col gap-5">
                        <div style={{ fontSize: "50px" }}>

                            <IoCheckmarkCircleOutline style={{ color: 'green' }} />
                        </div>
                        <h2 className=" text-xl font-bold">Submitted.</h2>
                        <h2 className=" text-md">Please check your email inbox for a confirmation link.</h2>
                        <h2 className=" text-sm italic">Email may take a few minutes to come through.</h2>
                    </div>
                </div >
                :
                <form onSubmit={handleSubmit((data) => getSubmitFunction(data as FormData))}>
                    <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10">
                        <div className="mb-6">
                            <h3 className=" text-xl font-semibold mb-3">
                                {!user ? `Please enter your details:` : `Update user details:`}
                            </h3>
                        </div>
                        <div className=" flex mt-7 items-center gap-3">
                            {user ? <div className="flex flex-col w-full">
                                <label>Email</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register('email')}
                                    disabled
                                />
                            </div>
                                :
                                <div className="flex flex-col w-full">
                                    <label>Email</label>
                                    {errors.email && <p className=" text-red-600">*{errors.email.message?.toString()}</p>}
                                    <input
                                        type="text"
                                        className="input input-bordered "
                                        {...register('email', {
                                            required: 'Email address is required',
                                            onChange: (e) => checkEmailExists(e.target.value)
                                        })}
                                        onBlur={() => {
                                            if (existingEmail)
                                                setValue('email', '')
                                        }}
                                    />
                                </div>}
                        </div>

                        {!user && <div className="flex gap-3 mt-7 w-full mb-2">
                            <div className="flex flex-col w-1/2">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input input-bordered "
                                    {...register('password', { required: "Password is required." })}
                                />
                                {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="input input-bordered "
                                    {...register('confirmPassword', {
                                        required: "Confirm password is required.",
                                    })}
                                    onChange={(e) => checkPasswordMatches(e.target.value)}
                                />
                                {errors.confirmPassword && <p className=" text-red-600">*{errors.confirmPassword.message?.toString()}</p>}
                            </div>
                        </div>}
                        <div className="flex gap-3 mt-7 w-full mb-2">
                            <div className="flex flex-col w-1/2">
                                <label>Birth Month</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('birthMonth', { required: 'Birth month is required' })}
                                >
                                    <option value="" disabled selected>- Select Month -</option>
                                    {months.map(month => (
                                        <option key={nanoid()} value={month}>{month}</option>
                                    ))}

                                </select>
                                {errors.birthMonth && <p className=" text-red-600">*{errors.birthMonth.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Birth Year</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('birthYear', { required: 'Birth year is required' })}
                                >
                                    <option value="" disabled selected>- Select Year -</option>
                                    {years.map(year => (
                                        <option value={year} key={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.birthYear && <p className=" text-red-600">*{errors.birthYear.message?.toString()}</p>}
                            </div>

                        </div>
                        <div className="flex gap-3 mt-7 w-full mb-2">

                            <div className="flex flex-col w-1/2">
                                <label>Gender</label>
                                <select
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('gender', { required: 'Gender is required' })}
                                >
                                    <option value="" disabled selected>- Select Gender -</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="other">Other</option>

                                </select>
                                {errors.gender && <p className=" text-red-600">*{errors.gender.message?.toString()}</p>}
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
                                    {...register('suburb', { required: "Please enter your suburb." })}
                                />
                                {errors.suburb && <p className=" text-red-600">*{errors.suburb.message?.toString()}</p>}
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
                                    {...register('altSuburb')}
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
                            // conditionally render disabled button
                            //if 
                            <button className="btn btn-primary mt-7 w-full">Submit</button>
                        }

                        {!user && <div className="mt-5">Already a member? <Link to="/login" className=" italic underline">Log in</Link></div>}
                    </div>
                </form>
            }
            <Toaster />
        </>
    )
}
