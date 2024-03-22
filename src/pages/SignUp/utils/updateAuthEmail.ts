import supabase from "@/config/supabaseClient";

export async function updateAuthEmail(email: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            email: email,
        });

        if (error) {
            console.error('Error updating email:', error.message);
        } else {
            console.log('Email updated successfully');
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
    }
};