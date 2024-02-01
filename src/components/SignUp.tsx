import { useEffect, useState } from "react"
import months from "../data/months"
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
import LocationSearch from "./Location/LocationSearch"
import { SignUpType } from "../Types"

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
    const { register, setValue, handleSubmit, formState: { errors }, setError, watch, clearErrors, reset } = useForm()
    const user = useUser()
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);
    const [primaryLocation, setPrimaryLocation] = useState({
        address: "",
        postcode: "",
        suburb: "",
        state: "",
        country: "",
    });
    const [secondaryLocation, setSecondaryLocation] = useState({
        address: "",
        postcode: "",
        suburb: "",
        state: "",
        country: "",
    });

    const signUpAndInsertData = async (data: SignUpType) => {
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
    const insertLocationData = async (response: { data: any; error?: null }) => {
        const { error } = await supabase
            .from("locations")
            .insert({
                userId: response?.data?.user?.id,
                formatted_address: `${primaryLocation.suburb} ${primaryLocation.state}, ${primaryLocation.country}`,
                altFormatted_address: `${secondaryLocation.suburb} ${secondaryLocation.state}, ${secondaryLocation.country}`,
                country: primaryLocation.country,
                altCountry: secondaryLocation.country,
                state: primaryLocation.state,
                altState: secondaryLocation.state,
                suburb: primaryLocation.suburb,
                altSuburb: secondaryLocation.suburb,
                postcode: primaryLocation.postcode,
                altPostcode: secondaryLocation.postcode,
            })
            .single()
        if (error) {
            console.error("Error setting location data:", error);

        }
    }
    const updateLocationData = async () => {
        const { error } = await supabase
            .from("locations")
            .update({
                country: primaryLocation.country,
                altCountry: secondaryLocation.country,
                state: primaryLocation.state,
                altState: secondaryLocation.state,
                suburb: primaryLocation.suburb,
                postcode: primaryLocation.postcode,
                altSuburb: secondaryLocation.suburb,
                altPostcode: secondaryLocation.postcode,
                formatted_address: `${primaryLocation.suburb} ${primaryLocation.state}, ${primaryLocation.country}`,
                altFormatted_address: `${secondaryLocation.suburb} ${secondaryLocation.state}, ${secondaryLocation.country}`,
            })
            .eq('userId', user?.id)
            .single()

        if (error) {
            console.error("Error updating location:", error);

        }
    }
    const handleUpdateDetailsSubmit = async (data: SignUpType) => {
        setIsSubmitting(true)
        const { error } = await supabase
            .from("members")
            .update({
                gender: data.gender,
                email: data.email,
                birthMonth: data.birthMonth,
                birthYear: data.birthYear,
            })
            .eq('id', user?.id)

        if (error) {
            console.error(error);
            return
        }
        updateLocationData()
        setIsSubmitting(false)
        toast.success("Details updated successfully")
        navigate("/")

    }
    const handleNewSubmit = async (data: SignUpType) => {
        const response = await signUpAndInsertData(data);
        if (response && !response.error) {
            supabase
                .from("members")
                .insert({
                    id: response?.data?.user?.id,
                    gender: data.gender,
                    email: data.email,
                    birthMonth: data.birthMonth,
                    birthYear: data.birthYear,
                    isJod: false,
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
            insertLocationData(response)
            setHasSubmitted(true)
        };

    }
    const existingEmail = errors.email?.message === "Email already exists in the system"
    const getLocationData = async () => {
        const { data, error } = await supabase
            .from("locations")
            .select("*")
            .eq("userId", user?.id)
            .single()

        if (error) {
            console.error("Error getting location data:", error);
        }
        if (data) {
            return data
        }


    }
    const getMembers = async () => {
        try {
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq('id', user?.id)
                .single()

            if (error) {
                return console.error(error);
            }
            if (data) {
                const { formatted_address, altFormatted_address, postcode, altPostcode, country, altCountry, suburb, altSuburb, state, altState } = await getLocationData()
                setValue('email', data.email)
                setValue('gender', data.gender)
                setValue('birthMonth', data.birthMonth)
                setValue('birthYear', data.birthYear)
                setPrimaryLocation({
                    address: formatted_address,
                    suburb: suburb,
                    state: state,
                    country: country,
                    postcode: postcode
                })
                setSecondaryLocation({
                    address: altFormatted_address,
                    suburb: altSuburb,
                    state: altState,
                    country: altCountry,
                    postcode: altPostcode
                })
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
    const getSubmitFunction = (data: SignUpType) => {
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
        } catch (error: any) {
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
                <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10 h-96 mt-36 justify-center bg-green-100">
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
                <form onSubmit={handleSubmit((data) => getSubmitFunction(data as SignUpType))}>
                    <div className="flex flex-col max-w-3xl m-auto shadow-lg px-14 md:px-24 pb-24 pt-10">
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

                        {!user && <div className="md:flex gap-3 mt-7 w-full mb-2">
                            <div className="flex flex-col md:w-1/2">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="input input-bordered "
                                    {...register('password', { required: "Password is required." })}
                                />
                                {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col md:w-1/2">
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
                                    defaultValue="- Select Month -"
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('birthMonth', { required: 'Birth month is required' })}
                                >
                                    <option value="" disabled>- Select Month -</option>
                                    {months.map(month => (
                                        <option key={nanoid()} value={month}>{month}</option>
                                    ))}

                                </select>
                                {errors.birthMonth && <p className=" text-red-600">*{errors.birthMonth.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col w-1/2">
                                <label>Birth Year</label>
                                <select
                                    defaultValue="- Select Year -"
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('birthYear', { required: 'Birth year is required' })}
                                >
                                    <option value="" disabled>- Select Year -</option>
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
                                    defaultValue='- Select Gender -'
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('gender', { required: 'Gender is required' })}
                                >
                                    <option value="" disabled>- Select Gender -</option>
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
                        <div className=" md:flex gap-3 mt-7 w-full mb-2">
                            <div className="flex flex-col md:w-1/2">
                                <label>Primary Suburb</label>
                                <LocationSearch
                                    types={['locality']}
                                    placeholder="Start typing in a suburb"
                                    onSelect={(address, postcode, suburb, state, country) => {
                                        setPrimaryLocation({
                                            address,
                                            postcode,
                                            suburb,
                                            state,
                                            country,
                                        });
                                    }}
                                    suburbAndPostcode={true}
                                    signUpData={primaryLocation}
                                />

                            </div>
                            <div className="flex flex-col md:w-1/2">
                                <div className="flex justify-between">
                                    <label>Secondary Suburb</label>
                                    <Toggle>
                                        <ToggleButton className=" cursor-pointer"> <FaInfoCircle /></ToggleButton>
                                        <ToggleOn>
                                            <SimpleModal title="doli">An area you know as well as you know your own neighbourhood.</SimpleModal>
                                        </ToggleOn>
                                    </Toggle>
                                </div>
                                <LocationSearch
                                    types={['locality']}
                                    placeholder="Start typing in a suburb"
                                    onSelect={(address, postcode, suburb, state, country) => {
                                        setSecondaryLocation({
                                            address,
                                            postcode,
                                            suburb,
                                            state,
                                            country,
                                        });
                                    }}
                                    suburbAndPostcode={true}
                                    signUpData={secondaryLocation}
                                />


                            </div>
                            {/* <div className="flex flex-col md:w-1/2 mt-4">
                                <label>Suburb</label>
                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register('suburb', { required: "Please enter your suburb." })}
                                />
                                {errors.suburb && <p className=" text-red-600">*{errors.suburb.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col md:w-1/2 mt-4">
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
                            </div> */}
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
            <Toaster />
        </>
    )
}


