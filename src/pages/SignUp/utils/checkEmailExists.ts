import { getMemberEmail } from "@/lib/Supabase/Eq/getMemberEmail";
import { ErrorOption } from "react-hook-form";

export async function checkEmailExists(email: string, setError: { (name: string, error: ErrorOption, options?: { shouldFocus: boolean; } | undefined): void; (arg0: string, arg1: { type: string; message: string; }): void; }, clearErrors: { (name?: string | string[] | readonly string[] | undefined): void; (arg0: string): void; }) {
    try {
        const data: any = await getMemberEmail("isVerified", email)
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