import { useEffect, useState } from "react"
import months from "../../data/months"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@supabase/auth-helpers-react"
import { FaInfoCircle } from "react-icons/fa";
import SimpleModal from "../../components/Modals/SimpleModal"
import Toggle from "../../components/Toggle/Toggle"
import ToggleOn from "../../components/Toggle/ToggleOn"
import ToggleButton from "../../components/Toggle/ToggleButton"
import ForgotPassword from "../../components/ForgotPassword"
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useForm } from "react-hook-form"
import LocationSearch from "../../components/Location/LocationSearch"
import { SignUpType } from "../../Types"
import { getLocationData } from "@/lib/Supabase/getUserLocation"
import Select from "react-select"
import { getMemberUser } from "@/lib/Supabase/Eq/getMemberUser"
import { years } from "./utils/utils"
import { checkEmailExists } from "./utils/checkEmailExists"
import { checkPasswordMatches } from "./utils/utils"
import { handleNewSubmit, handleUpdateDetailsSubmit } from "./utils/formSubmitHandlers"
import SEO from "@/lib/SEO"
import { sendReauthToken } from "./utils/sendReauthToken"

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
    const [hasSentReauthToken, setHasSentReauthToken] = useState<boolean>(false)
    const { register, setValue, handleSubmit, formState: { errors }, setError, watch, clearErrors, reset } = useForm()
    const user = useUser()
    const navigate = useNavigate()
    const [locationError, setLocationError] = useState<string>("")
    const existingEmail = errors.email?.message === "Email already exists in the system"
    const [primaryLocation, setPrimaryLocation] = useState({
        address: "",
        postcode: "",
        suburb: "",
        state: "",
        country: "",
        coordinates: ""
    });
    const [secondaryLocation, setSecondaryLocation] = useState({
        address: "",
        postcode: "",
        suburb: "",
        state: "",
        country: "",
        coordinates: ""
    });
    const [isAgree, setIsAgree] = useState<boolean>(true)


    async function getMember() {
        try {
            const memberData: any = await getMemberUser("gender, birthMonth, birthYear", user)
            if (memberData) {
                const locationData = await getLocationData(user);
                if (locationData) {
                    const { formatted_address, altFormatted_address, postcode, altPostcode, country, altCountry, suburb, altSuburb, state, altState, coordinates, altCoordinates } = locationData;
                    setValue('email', user?.email)
                    setValue('gender', memberData?.gender)
                    setValue('birthMonth', memberData?.birthMonth)
                    setValue('birthYear', memberData?.birthYear)
                    setPrimaryLocation({
                        address: formatted_address,
                        suburb: suburb,
                        state: state,
                        country: country,
                        postcode: postcode,
                        coordinates: coordinates
                    })
                    setSecondaryLocation({
                        address: altFormatted_address,
                        suburb: altSuburb,
                        state: altState,
                        country: altCountry,
                        postcode: altPostcode,
                        coordinates: altCoordinates
                    })
                }
            }
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    }
    function getSubmitFunction(data: SignUpType) {
        if (user) {
            return handleUpdateDetailsSubmit(data, setIsSubmitting, primaryLocation, secondaryLocation, user, navigate)
        } else {
            return handleNewSubmit(data, setIsSubmitting, reset, setHasSubmitted, primaryLocation, secondaryLocation)
        }
    }
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
                coordinates: ""
            });
            return;
        }
        return true;
    }
    useEffect(() => {
        if (user?.id) {
            getMember();
        }
    }, [user?.id]);
    useEffect(() => {
        if (primaryLocation.suburb && secondaryLocation.suburb) {
            checkLocationError();
        }
    }, [primaryLocation.suburb, secondaryLocation.suburb]);

    async function resendAuthToken() {
        try {
            const response = await sendReauthToken(watch('email'), setIsSubmitting);
            if (response) {
                setHasSentReauthToken(true)
            }
            else throw new Error("Unable to resend token")
        } catch (error) {
            throw Error("Unable to resend token")
        }
    }

    return (
        <>
            <SEO
                title="doli | Register"
                description="The home-grown service that makes it easy for you to find and support the hospitality businesses that positively contribute to the fabric of your community."
                name="doli"
                type="website" />
            {hasSubmitted ?
                <div className="flex flex-col max-w-3xl md:mx-auto mb-auto md:mt-10 my-auto shadow-lg md:px-24 px-5 py-16 justify-center bg-green-100">
                    <div className="flex items-center gap-5">
                        <div style={{ fontSize: "50px" }}>
                            <IoCheckmarkCircleOutline style={{ color: 'green' }} />
                        </div>
                        <h2 className=" text-xl font-bold">Registration sent to <span className=" italic">{watch('email')}</span></h2>
                    </div>
                    <section className=" flex flex-col md:gap-5 mt-5 gap-2">
                        <h2 className=" text-md">Please check your email inbox for a confirmation link.</h2>
                        <h2 className=" text-sm font-bold">Email may take a few minutes to come through. </h2>
                        <h2 className=" text-sm font-bold">Please check your junk / spam if not receieved within 5 minutes.</h2>
                        <h2>Didn't receive an email? {!hasSentReauthToken ? <span className=" text-blue-500 underline cursor-pointer" onClick={() => resendAuthToken()}>Click here</span> : <span className=" text-blue-500 italic">Sent</span>}</h2>
                    </section>
                </div >
                :
                <form onSubmit={handleSubmit((data) => getSubmitFunction(data as SignUpType))} className=" pb-10">
                    <div className="flex flex-col max-w-3xl m-auto shadow-lg px-8 md:px-24 pb-24 pt-10">
                        <div className="">
                            <h3 className=" text-xl font-semibold mb-3 text-center">
                                {!user ? `New Member Onboarding:` : `Member Profile:`}
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className=" flex mt-7 items-center gap-3">
                                {user ? <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        className="input input-bordered "
                                        placeholder="Email address"
                                        {...register('email')}
                                    />
                                </div>
                                    :
                                    <div className="flex flex-col w-full">
                                        {errors.email && <p className=" text-red-600">*{errors.email.message?.toString()}</p>}
                                        <input
                                            type="text"
                                            placeholder="Email address"
                                            className="input input-bordered "
                                            {...register('email', {
                                                required: 'Email address is required',
                                                onChange: (e) => checkEmailExists(e.target.value, setError, clearErrors)

                                            })}
                                            onBlur={() => {
                                                if (existingEmail)
                                                    setValue('email', '')
                                            }}
                                        />
                                    </div>}
                            </div>
                            {!user && <div className="flex flex-col md:flex-row gap-3  md:mt-7 w-full mb-2">
                                <div className="flex flex-col md:w-1/2">
                                    <input
                                        type="password"
                                        className="input input-bordered "
                                        placeholder="Password"
                                        {...register('password', { required: "Password is required." })}
                                    />
                                    {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                                </div>
                                <div className="flex flex-col md:w-1/2">
                                    <input
                                        type="password"
                                        className="input input-bordered "
                                        placeholder="Confirm password"
                                        {...register('confirmPassword', {
                                            required: "Confirm password is required.",
                                        })}
                                        onChange={(e) => checkPasswordMatches(e.target.value, watch, clearErrors, setError)}
                                    />
                                    {errors.confirmPassword && <p className=" text-red-600">*{errors.confirmPassword.message?.toString()}</p>}
                                </div>
                            </div>}
                        </div>
                        <label className="mt-7">Month & Year you were born?</label>
                        <div className="flex gap-3  w-full mb-2 items-end">
                            <div className="flex flex-col w-1/2">
                                <Select
                                    {...register('birthMonth', { required: 'Birth month is required' })}
                                    options={months.map(month => ({ value: month, label: month }))}
                                    placeholder="Select Month"
                                    onChange={(selectedOption) => setValue('birthMonth', selectedOption?.value)}
                                    value={watch("birthMonth") && { value: watch("birthMonth"), label: watch("birthMonth") }}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            height: '48px', // Adjust the height as needed
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            lineHeight: '48px', // Match the height to center the text vertically
                                        }),
                                    }}
                                />
                                {errors.birthMonth && <p className="text-red-600">*{errors.birthMonth.message?.toString()}</p>}
                            </div>

                            <div className="flex flex-col w-1/2">
                                <Select
                                    {...register('birthYear', { required: 'Birth year is required' })}
                                    options={years.map(year => ({ value: year, label: year }))}
                                    placeholder="Select Year"
                                    onChange={(selectedOption) => setValue('birthYear', selectedOption?.value)}
                                    value={watch("birthYear") && { value: watch("birthYear"), label: watch("birthYear") }}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            height: '48px', // Adjust the height as needed
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            lineHeight: '48px', // Match the height to center the text vertically
                                        }),
                                    }}
                                />
                                {errors.birthYear && <p className=" text-red-600">*{errors.birthYear.message?.toString()}</p>}
                            </div>

                        </div>
                        <div className="flex gap-3 mt-3 w-full mb-2">

                            <div className="flex flex-col w-1/2">
                                <label>Gender</label>
                                <Select
                                    {...register('gender', { required: 'Gender is required' })}
                                    options={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                        { value: 'Non-Binary', label: 'Non-Binary' },
                                    ]}
                                    placeholder="Select"
                                    onChange={(selectedOption) => setValue('gender', selectedOption?.value)}
                                    value={watch("gender") && { value: watch("gender"), label: watch("gender") }}
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            height: '48px', // Adjust the height as needed
                                        }),
                                        singleValue: (provided) => ({
                                            ...provided,
                                            lineHeight: '48px', // Match the height to center the text vertically
                                        }),
                                    }}
                                />
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
                                    className="input input-bordered"
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
                                        })
                                    }}
                                    isRequired={true}
                                    className="input input-bordered"
                                    signUpData={primaryLocation}
                                    suburbAndPostcode={false}
                                    allChecked={false} />
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
                                        })
                                    }}
                                    isRequired={true}
                                    className="input input-bordered"
                                    signUpData={secondaryLocation}
                                    suburbAndPostcode={false}
                                    allChecked={false} />
                                <p className=" text-[#0098b3] my-2">*The other community (work, holidays, childhood home) where you consider yourself a local.</p>
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
                        <div className=" flex items-center gap-3">
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
                        {isSubmitting ? <button className="btn w-full btn-disabled mt-3">Submitting<span className=" ml-4 loading loading-spinner !text-white"></span></button>
                            :
                            isAgree ? <button className="btn !bg-[#0866ff] mt-3 w-full !text-white">Submit</button>
                                :
                                <button className="btn !bg-[#0866ff] mt-3 w-full !text-white" disabled>Submit</button>

                        }

                        {!user && <div className="mt-5 flex gap-1 justify-center md:justify-start">Already a member? <Link to="/login" className=" italic underline">Log in</Link></div>}
                    </div>
                </form>
            }
        </>
    )
}


