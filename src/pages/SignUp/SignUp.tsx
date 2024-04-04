import { useEffect, useState } from "react"
import months from "../../data/months"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "@supabase/auth-helpers-react"
import { Toaster } from "react-hot-toast"
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
import { Helmet } from 'react-helmet'
import SEO from "@/lib/SEO"

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false)
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


    return (
        <>
            {hasSubmitted ?
                <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10 h-96 justify-center bg-green-100">
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
                                            onChange: (e) => checkEmailExists(e.target.value, setError, clearErrors)

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
                                    onChange={(e) => checkPasswordMatches(e.target.value, watch, clearErrors, setError)}
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
                                        { value: 'Other', label: 'Other' },
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


