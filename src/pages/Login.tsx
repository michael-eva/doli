import { useState } from "react"
import supabase from "../config/supabaseClient"
import { useNavigate } from "react-router"
import toast, { Toaster } from "react-hot-toast"

type LoginData = {
    email: string,
    password: string
}

export default function Login() {
    let navigate = useNavigate()
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: ""
    })

    function handleChange(e: { target: { name: string; value: string } }) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault()

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })
        if (error) {
            console.log(error);
        }
        setFormData({
            email: "",
            password: ""
        })
        toast.success("Logged in successfully")
        setTimeout(() => {
            navigate("/")
        }, 1000)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className=" shadow-2xl max-w-xl gap-9 flex flex-col px-24 pb-20 pt-12 m-auto mt-24 rounded-lg">
                <p className=" text-lg font-semibold pb-5">Please enter your login details:</p>
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
                    />
                </div>
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
                    />
                </div>
                <button className="btn btn-primary">Login</button>
            </div>
            <Toaster />
        </form>
    )

}
