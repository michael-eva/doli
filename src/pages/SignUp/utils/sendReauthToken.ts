import supabase from "@/config/supabaseClient";
import { SetStateAction } from "react";


export async function sendReauthToken(email: string, setIsSubmitting: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) {
console.log(email);

    setIsSubmitting(true)
    const { error } = await supabase.auth.resend({
        type: "signup",
        email: email
    })
    if (error) {
        console.error(error);
        return false
    }
    console.log("Reauth token sent");
    setIsSubmitting(false)
    return true
}