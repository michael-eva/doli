import { SignUpType } from "@/Types";
import supabase from "@/config/supabaseClient";
import { SetStateAction } from "react";

export async function signUpAndInsertData(data: SignUpType, setIsSubmitting: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }){
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