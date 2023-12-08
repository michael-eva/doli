import { useForm } from "react-hook-form"
import supabase from "../config/supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useState } from "react";
// import { useUser } from "@supabase/auth-helpers-react";

type FormType = {
    id: string,
    password: string,
    confirmPassword: string
}
function ResetPassword() {
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState<boolean>()
    // const user = useUser()
    // console.log(user);

    async function onSubmit(formData: FormType) {
        console.log(formData);
        if (formData.password === formData.confirmPassword) {
            setIsSubmitting(true)
            try {
                const { data, error } = await supabase.auth
                    .updateUser({ password: formData.password })
                if (error) {
                    setIsSubmitting(false)
                    throw error
                }
                console.log("data submitted:", data);
                toast.success("Password updated")
                setIsSubmitting(false)
                navigate("/")
                reset()

            } catch (error: any) {
                setError('password', { type: 'manual', message: error.message })
            }
        } else {
            setError('password', { type: 'manual', message: 'Passwords do not match' })
        }
    }
    function clearInput() {
        if (errors.password) {
            reset()
        }
    }

    console.log(errors.password);

    return (
        <>
            <form
                onSubmit={handleSubmit((data) => onSubmit(data as FormType))}
                className="flex flex-col items-center shadow-2xl max-w-xl px-24 pb-20 pt-12 m-auto mt-24 rounded-lg gap-10">
                <h2 className=" text-xl">Reset Password:</h2>

                {errors.password && <p className=" text-red-600">*{errors.password.message?.toString()}</p>}
                <div className="flex">
                    <label className="label">
                        <span className="label-text w-24">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        onClick={clearInput}
                        {...register('password', { required: "Please enter your password" })}
                    />
                </div>
                {errors.confirmPassword && <p className=" text-red-600">*{errors.confirmPassword.message?.toString()}</p>}
                <div className="flex">
                    <label className="label">
                        <span className="label-text w-24">Confirm Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        {...register('confirmPassword', { required: "Please confirm your password" })}
                    />
                </div>
                {!isSubmitting ? <button className="btn btn-primary">Reset Password</button>
                    :
                    <button className="btn w-full btn-disabled mt-7">Resetting...<span className=" ml-4 loading loading-spinner text-primary"></span></button>
                }
            </form>
        </>
    )
}

export default ResetPassword