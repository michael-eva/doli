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
    const [locationError, setLocationError] = useState<string>("")
    const existingEmail = errors.email?.message === "Email already exists in the system"
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
    const [isAgree, setIsAgree] = useState<boolean>(true)
    async function updateAuthEmail(email: string) {
        try {
            const { error } = await supabase.auth.updateUser({
                email: email,
            });

            if (error) {
                console.error('Error updating email:', error.message);
            } else {
                console.log('Email updated successfully');
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
        }
    };

    async function signUpAndInsertData(data: SignUpType) {
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
    async function insertLocationData(response: { data: any; error?: null }) {
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
                altSuburb: secondaryLocation ? secondaryLocation.suburb : null,
                postcode: primaryLocation.postcode,
                altPostcode: secondaryLocation.postcode,
                coordinates: primaryLocation.coordinates,
                altCoordinates: secondaryLocation.coordinates
            })
            .single()
        if (error) {
            console.error("Error setting location data:", error);

        }
    }
    async function updateLocationData() {
        const { error } = await supabase
            .from("locations")
            .update({
                country: primaryLocation.country,
                altCountry: secondaryLocation.country,
                state: primaryLocation.state,
                altState: secondaryLocation.state,
                suburb: primaryLocation.suburb,
                postcode: primaryLocation.postcode,
                altSuburb: secondaryLocation ? secondaryLocation.suburb : null,
                altPostcode: secondaryLocation.postcode,
                formatted_address: `${primaryLocation.suburb} ${primaryLocation.state}, ${primaryLocation.country}`,
                altFormatted_address: secondaryLocation.suburb ? `${secondaryLocation.suburb} ${secondaryLocation.state}, ${secondaryLocation.country}` : null,
                coordinates: primaryLocation.coordinates,
                altCoordinates: secondaryLocation.coordinates

            })
            .eq('userId', user?.id)
            .single()

        if (error) {
            console.error("Error updating location:", error);

        }
    }
    async function handleUpdateDetailsSubmit(data: SignUpType) {
        setIsSubmitting(true)
        const { error } = await supabase
            .from("members")
            .update({
                gender: data.gender,
                isVerified: false,
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
        if (data.email != user?.email) {
            updateAuthEmail(data.email)
            navigate('/update-email')
            return
        }
        toast.success("Details updated successfully")
        navigate("/")

    }
    function hasSelectedLocation(primaryLocation: { postcode: any }) {
        if (!primaryLocation.postcode) {
            // setLocationError("*Location and postcode is required")
        }
    }
    async function handleNewSubmit(data: SignUpType) {
        try {
            // Check if the user already exists
            const { data: userData, error: userError } = await supabase
                .from('members')
                .select('*')
                .eq('email', data.email);

            if (userError) {
                console.error('Error fetching user:', userError.message);
                return;
            }

            // User exists
            if (userData && userData.length > 0) {
                const user = userData[0];
                if (user.isVerified) {
                    setError('email', {
                        type: 'manual',
                        message: 'Email already exists in the system',
                    });
                    return;
                } else {
                    // User exists but is not verified, send reauth token
                    await sendReauthToken(data.email);
                    setHasSubmitted(true)
                    console.log("sent reauth token");

                    return
                }
            } else {
                clearErrors("email");
            }

            // Proceed with sign up
            const response = await signUpAndInsertData(data);
            hasSelectedLocation(primaryLocation);

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
                        isVerified: false,
                    })
                    .single()
                    .then(
                        ({ error }) => {
                            if (error) {
                                console.error(error)
                            }
                            reset()
                        },
                    )
                insertLocationData(response)
                setHasSubmitted(true)
            };
        } catch (error: any) {
            console.error('Error:', error.message);
            return
        }
        console.log("new signup");

    }
    async function getLocationData() {
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
    async function getMembers() {
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
                setValue('email', user?.email)
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
    function getSubmitFunction(data: SignUpType) {
        if (user) {
            return handleUpdateDetailsSubmit(data)
        } else {
            return handleNewSubmit(data)
        }
    }
    async function checkEmailExists(email: string) {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('email', email)

            if (error) {
                console.error('Error fetching user:', error.message);
                return
            }
            if (data && data.length > 0) {

                if (data[0].isVerified === true) {

                    setError('email', {
                        type: 'manual',
                        message: 'Email already exists in the system',
                    });
                    return
                } else {
                    console.log("not verified");
                }

            } else {

                clearErrors("email")
            }
        } catch (error: any) {
            console.error('Error:', error.message);
            return
        }
    };
    function checkPasswordMatches(value: string) {
        if (value === watch().password) {
            clearErrors("confirmPassword");
        } else {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords don't match",
            });
        }
    }
    async function sendReauthToken(email: string) {
        setIsSubmitting(true)
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: email
        })
        if (error) {
            console.error(error);

        }
        setIsSubmitting(false)
    }
    useEffect(() => {
        if (primaryLocation.suburb && secondaryLocation.suburb) {
            checkLocationError();
        }
    }, [primaryLocation.suburb, secondaryLocation.suburb]);

    function checkLocationError() {
        setLocationError("");
        if (primaryLocation.suburb === secondaryLocation.suburb) {
            setLocationError("*Value needs to be different from Home suburb");
            setSecondaryLocation({
                address: "",
                postcode: "",
                suburb: "",
                state: "",
                country: "",
            });
            return;
        }
        return true;
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
                <form onSubmit={handleSubmit((data) => getSubmitFunction(data as SignUpType))} className=" pb-10">
                    <div className="flex flex-col max-w-3xl m-auto shadow-lg px-8 md:px-24 pb-24 pt-10">
                        <div className="">
                            <h3 className=" text-xl font-semibold mb-3 text-center">
                                {!user ? `New Member Onboarding:` : `Update user details:`}
                            </h3>
                        </div>
                        <div className=" flex mt-7 items-center gap-3">
                            {user ? <div className="flex flex-col w-full">
                                <label>Email Address</label>

                                <input
                                    type="text"
                                    className="input input-bordered "
                                    {...register('email')}
                                />
                                {/* <div
                                    className="btn btn-warning btn-xs w-32 mt-2"
                                    onClick={() => setChangeEmail(!changeEmail)}
                                >Update email</div> */}
                            </div>
                                :
                                <div className="flex flex-col w-full">
                                    <label>Email Address</label>
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
                        {!user && <div className="md:flex gap-3 md:mt-7 w-full mb-2">
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
                        <div className=" mt-7">
                            <p className=" text-center">We do need to know a little bit about you, but we won't ask for personal information we don't need... you are <span className=" font-bold">NOT</span> our product.</p>
                        </div>
                        <label className="mt-7">When were you born?</label>
                        <div className="flex gap-3  w-full mb-2 items-end">
                            <div className="flex flex-col w-1/2">
                                <select
                                    defaultValue="Select Month"
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('birthMonth', { required: 'Birth month is required' })}
                                >
                                    <option disabled>Select Month</option>
                                    {months.map(month => (
                                        <option key={nanoid()} value={month}>{month}</option>
                                    ))}

                                </select>
                                {errors.birthMonth && <p className=" text-red-600">*{errors.birthMonth.message?.toString()}</p>}
                            </div>
                            <div className="flex flex-col w-1/2">
                                {/* <label>Birth Year</label> */}
                                <select
                                    defaultValue="Select Year"
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('birthYear', { required: 'Birth year is required' })}
                                >
                                    <option disabled>Select Year</option>
                                    {years.map(year => (
                                        <option value={year} key={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.birthYear && <p className=" text-red-600">*{errors.birthYear.message?.toString()}</p>}
                            </div>

                        </div>
                        <div className="flex gap-3 mt-3 w-full mb-2">

                            <div className="flex flex-col w-1/2">
                                <label>Gender</label>
                                <select
                                    defaultValue='Select'
                                    className="select select-bordered w-full max-w-xs"
                                    {...register('gender', { required: 'Gender is required' })}
                                >
                                    <option disabled>Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-binary</option>

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
                        <div className=" flex-col md:flex-row flex gap-3 mt-3 w-full mb-2">
                            <div className="flex flex-col md:w-1/2">
                                <label>Home</label>
                                <LocationSearch
                                    types={['locality']}
                                    placeholder="Start typing in a suburb"
                                    onSelect={(address, postcode, suburb, state, country, coordinates) => {
                                        setPrimaryLocation({
                                            address,
                                            postcode,
                                            suburb,
                                            state,
                                            country,
                                            coordinates,
                                        });
                                    }}
                                    isRequired={true}
                                    className="input input-bordered"
                                    signUpData={primaryLocation}
                                // suburbAndPostcode={true}
                                />

                            </div>
                            <div className="flex flex-col md:w-1/2">
                                {locationError && <p className=" text-red-600">{locationError}</p>}
                                <label>Home away from home*</label>
                                <LocationSearch
                                    types={['locality']}
                                    placeholder="Start typing in a suburb"
                                    onSelect={(address, postcode, suburb, state, country, coordinates) => {
                                        setSecondaryLocation({
                                            address,
                                            postcode,
                                            suburb,
                                            state,
                                            country,
                                            coordinates,
                                        });
                                    }}
                                    isRequired={false}
                                    className="input input-bordered"
                                    signUpData={secondaryLocation}
                                />
                                <p className=" text-xs my-2">*The other community (work, holidays, childhood home) where you consider yourself a local.</p>
                            </div>
                        </div>
                        {user && <Toggle>
                            <ToggleButton className=" text-sm underline italic cursor-pointer">
                                Change Password?
                            </ToggleButton>
                            <ToggleOn>
                                <ForgotPassword />
                            </ToggleOn>
                        </Toggle>}
                        {/* {locationError && <div className=" text-red-600 mt-5">{locationError}</div>} */}
                        <div className=" flex items-center gap-3">
                            <label className="cursor-pointer label ">
                                <input type="checkbox" checked={isAgree} onChange={() => setIsAgree(!isAgree)} className="checkbox checkbox-info" />
                            </label>
                            <span className="label-text">I agree to the <span></span>
                                <a className=" text-bold underline cursor-pointer" href={`${import.meta.env.VITE_REACT_APP_SUPABASE_URL}/storage/v1/object/public/website_documents/Terms%20of%20Service.pdf`} target="_blank">Terms of Service.</a>
                            </span>
                        </div>
                        {isSubmitting ? <button className="btn w-full btn-disabled mt-3">Submitting<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                            :
                            isAgree ? <button className="btn btn-primary mt-3 w-full">Submit</button>
                                :
                                <button className="btn btn-primary mt-3 w-full" disabled>Submit</button>

                        }

                        {!user && <div className="mt-5 flex gap-1 justify-center md:justify-start">Already a member? <Link to="/login" className=" italic underline">Log in</Link></div>}
                    </div>
                </form>
            }
            <Toaster />
        </>
    )
}


