import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate, useLocation } from "react-router"
import toast, { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"

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
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    })

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

    function handleChange(e: { target: { name: string; value: string } }) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        setLoginError("");
        setIsUser("");
        const existingUser = members.find(member => member.email === formData.email);

        if (!existingUser) {
            setLoginError("An account with that email address doesn't exist");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            console.log(error);
            setIsUser("Password is incorrect");
            setLoginError("");
            return;
        }


        toast.success("Logged in successfully");

        setTimeout(() => {
            navigate("/");
        }, 1000);

        setFormData({
            email: "",
            password: ""
        });
        setLoginError("");
        setIsUser("");


    }


    return (
        <>
            <div className="shadow-2xl max-w-xl px-24 pb-20 pt-12 m-auto mt-24 rounded-lg">
                {location.state && (
                    <p className=" mb-5 text-red-600 italic">*{location.state.message}</p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="  gap-9 flex flex-col ">
                        <p className=" text-lg font-semibold pb-5">Please enter your login details:</p>
                        {loginError && (<p className=" text-red-600 italic">*An account with that email address doesn't exist</p>)}
                        <div className="flex">
                            <label className="label">
                                <span className="label-text w-24">Email</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs"
                                value={formData.email}
                                name="email"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isUser.length > 0 && <p className=" text-red-600 italic">Password is incorrect</p>}
                        <div className="flex">
                            <label className="label">
                                <span className="label-text w-24">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Type here"
                                className="input input-bordered w-full max-w-xs"
                                value={formData.password}
                                name="password"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button className="btn btn-primary">Login</button>
                    </div>
                </form>
                <div className="flex flex-col items-center gap-5 mt-9">
                    <p>Not yet a member?</p>
                    <Link to="/member-register" className="btn w-48 btn-success">Sign up here</Link>
                </div>
                <Toaster />
            </div>
        </>
    )

}
