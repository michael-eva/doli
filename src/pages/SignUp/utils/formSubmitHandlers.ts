import { SignUpType } from "@/Types";
import supabase from "@/config/supabaseClient";
import { signUpAndInsertData } from "./signUpAndInsertData";
import { sendReauthToken } from "./sendReauthToken";
import { SetStateAction } from "react";
import { FieldValues } from "react-hook-form";
import { updateLocationData } from "./updateLocationData";
import { updateAuthEmail } from "./updateAuthEmail";
import toast from "react-hot-toast";
import { User } from "@supabase/supabase-js";
import { NavigateFunction } from "react-router";

async function insertLocationData(response: { data: any; error?: null }, primaryLocation: { suburb: any; state: any; country: any; postcode: any; coordinates: any; }, secondaryLocation: { suburb: any; state: any; country: any; postcode: any; coordinates: any; }) {
    const { error } = await supabase
        .from("locations")
        .insert({
            userId: response?.data?.user?.id,
            formatted_address: `${primaryLocation.suburb} ${primaryLocation.state}, ${primaryLocation.country}`,
            altFormatted_address: `${secondaryLocation.suburb} ${secondaryLocation.state}, ${secondaryLocation.country}`,
            country: primaryLocation.country,
            altCountry: secondaryLocation.country,
            state: primaryLocation.state,
            altState: secondaryLocation.state,
            suburb: primaryLocation.suburb,
            altSuburb: secondaryLocation ? secondaryLocation.suburb : null,
            postcode: primaryLocation.postcode,
            altPostcode: secondaryLocation.postcode,
            coordinates: primaryLocation.coordinates,
            altCoordinates: secondaryLocation.coordinates
        })
        .single()
    if (error) {
        console.error("Error setting location data:", error);

    }
}

export async function handleNewSubmit(data: SignUpType, setIsSubmitting: { (value: SetStateAction<boolean>): void; (value: SetStateAction<boolean>): void; (arg0: boolean): void; (value: SetStateAction<boolean>): void; (arg0: boolean): void; }, reset: { (values?: FieldValues | { [x: string]: any; } | ((formValues: FieldValues) => FieldValues) | undefined, keepStateOptions?: Partial<{ keepDirtyValues: boolean; keepErrors: boolean; keepDirty: boolean; keepValues: boolean; keepDefaultValues: boolean; keepIsSubmitted: boolean; keepIsSubmitSuccessful: boolean; keepTouched: boolean; keepIsValid: boolean; keepSubmitCount: boolean; }> | undefined): void; (): void; }, setHasSubmitted: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }, primaryLocation: { address: string; postcode: string; suburb: string; state: string; country: string; coordinates: string; }, secondaryLocation: { address: string; postcode: string; suburb: string; state: string; country: string; coordinates: string; }) {
    try {
        const response = await signUpAndInsertData(data, setIsSubmitting);
        if (response && !response.error) {
            supabase
                .from("members")
                .insert({
                    id: response?.data?.user?.id,
                    gender: data.gender,
                    email: data.email,
                    birthMonth: data.birthMonth,
                    birthYear: data.birthYear,
                    isJod: false,
                    isVerified: false,
                })
                .single()
                .then(
                    ({ error }) => {
                        if (error) {
                            console.error(error)
                        }
                        // reset()
                    },
                )
            insertLocationData(response, primaryLocation, secondaryLocation)
            setHasSubmitted(true)
        };
        if (!response || response.error) {
            try {
                await sendReauthToken(data.email, setIsSubmitting);
            } catch (error) {
                console.error('Error sending reauth token:', error);
            }
            setHasSubmitted(true)
            console.log("sent reauth token");
            return
        }
    } catch (error: any) {
        console.error('Error:', error.message);
        return
    }
    console.log("new signup");
}
export async function handleUpdateDetailsSubmit(data: SignUpType, setIsSubmitting: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }, primaryLocation: { address?: string; postcode: any; suburb: any; state: any; country: any; coordinates: any; }, secondaryLocation: { address?: string; postcode: any; suburb: any; state: any; country: any; coordinates: any; }, user: User | null, navigate: NavigateFunction) {
    setIsSubmitting(true)
    const { error } = await supabase
        .from("members")
        .update({
            gender: data.gender,
            isVerified: false,
            birthMonth: data.birthMonth,
            birthYear: data.birthYear,
        })
        .eq('id', user?.id)

    if (error) {
        console.error(error);
        return
    }
    updateLocationData(primaryLocation, secondaryLocation, user)
    setIsSubmitting(false)
    if (data.email != user?.email) {
        updateAuthEmail(data.email)
        navigate('/update-email')
        return
    }
    toast.success("Details updated successfully")
    navigate("/")

}