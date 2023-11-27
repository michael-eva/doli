import { ChangeEvent, useState } from "react"
import months from "../data/months.json"
import { nanoid } from "nanoid"
import supabase from "../config/supabaseClient"
import { Link } from "react-router-dom"
import LocationSearch from "./LocationSearch"

type FormData = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
    birthMonth: string,
    birthYear: string,
    suburb: string,
    postcode: string
}
const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthMonth: "",
    birthYear: "",
    suburb: "",
    postcode: "",
};

export default function MemberRegister() {
    const [emailError, setEmailError] = useState<string>("")
    const [passwordError, setPasswordError] = useState<string>("")
    const [formData, setFormData] = useState<FormData>(initialFormState)
    const signUpAndInsertData = async () => {
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
            const signInResponse = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInResponse.error) {
                console.log(signInResponse.error);
                return;
            }
            const sessionData = signInResponse.data;

            return sessionData;
        } catch (error: any) {
            console.error('Error:', error.message);
        }
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.password != formData.confirmPassword) {
            setPasswordError("Passwords don't match");
            return;
        }
        setPasswordError("");
        const sessionData = await signUpAndInsertData();

        if (sessionData) {
            supabase
                .from("members")
                .insert({
                    id: sessionData.user.id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    birthMonth: formData.birthMonth,
                    birthYear: formData.birthYear,
                    suburb: formData.suburb,
                    postcode: formData.postcode,
                })
                .single()
                .then(
                    ({ data, error }) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(data);
                            const modalElement = document.getElementById('my_modal_1') as HTMLDialogElement;
                            modalElement.showModal();
                        }
                        setFormData(initialFormState);
                        setPasswordError("")
                        setEmailError("");
                    },
                    (err: any) => {
                        console.log(err);
                    }
                );
        }
    };


    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col max-w-3xl m-auto shadow-lg px-24 pb-24 pt-10">
                    <div className="mb-6">
                        <h3 className=" text-xl font-semibold mb-3">
                            Please enter your details:
                        </h3>
                        <p className=" text-red-600 italic">Enter description on what it means to be a member</p>
                    </div>
                    <div className="container flex gap-3">
                        <div className="flex flex-col w-1/2">
                            <label>First Name</label>
                            <input
                                type="text"
                                className="input input-bordered"
                                name="firstName"
                                onChange={handleChange}
                                required
                                value={formData.firstName}
                            />
                        </div>
                        <div className="flex flex-col w-1/2">
                            <label>Last Name</label>
                            <input
                                type="text"
                                className="input input-bordered "
                                name="lastName"
                                onChange={handleChange}
                                required
                                value={formData.lastName}
                            />
                        </div>
                    </div>
                    <div className=" flex flex-col mt-7 mb-7">
                        {emailError && <p className=" text-lg text-red-600 italic">*{emailError}</p>}
                        <label>Email</label>
                        <input
                            type="text"
                            className="input input-bordered "
                            name="email"
                            onChange={handleChange}
                            required
                            value={formData.email}
                        />
                    </div>
                    {passwordError && <p className=" mt-7 text-lg text-red-600 italic">*{passwordError}</p>}
                    <div className="container flex gap-3 ">
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
                    </div>

                    <div className="container flex gap-3 mt-7">
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
                    <div className="container flex gap-3 mt-7">
                        {/* <div className="flex flex-col w-1/2">
                            <label>Suburb</label>
                            <input
                                type="text"
                                className="input input-bordered "
                                name="suburb"
                                onChange={handleChange}
                                required
                                value={formData.suburb}
                            />
                        </div> */}
                        <LocationSearch />
                        <div className="flex flex-col w-1/2">
                            <label>Post Code</label>
                            <input
                                type="text"
                                className="input input-bordered "
                                name="postcode"
                                onChange={handleChange}
                                required
                                value={formData.postcode}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary mt-7" onClick={handleSubmit}>Submit</button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Welcome, you are the newest doli member!</h3>
                            <p className="py-4">Click "Post Listing" to post a listing, or "View Listings" to view listings.</p>
                            <div className="modal-action">
                                <form method="dialog">
                                    <div className=" flex gap-3">
                                        <Link to="/business-register" className="btn">Post Listing</Link>
                                        <Link to="/" className="btn">View Listings</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>

                    <div className="mt-5">Already a member? <Link to="/login" className=" italic underline">Log in</Link></div>
                </div>
            </form>
        </>
    )
}
