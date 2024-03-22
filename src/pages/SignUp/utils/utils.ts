
import { ErrorOption } from "react-hook-form";

const currentYear = new Date().getFullYear();
export const years = Array.from({ length: currentYear - 1899 }, (_, index) => currentYear - index);

export function checkPasswordMatches(value: string, watch: any, clearErrors: { (name?: string | string[] | readonly string[] | undefined): void; (arg0: string): void; }, setError: { (name: string, error: ErrorOption, options?: { shouldFocus: boolean; } | undefined): void; (arg0: string, arg1: { type: string; message: string; }): void; }) {
    if (value === watch().password) {
        clearErrors("confirmPassword");
    } else {
        setError("confirmPassword", {
            type: "manual",
            message: "Passwords don't match",
        });
    }
}


