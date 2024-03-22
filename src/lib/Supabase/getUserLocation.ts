import supabase from "@/config/supabaseClient";
import { User } from "@supabase/supabase-js";

export async function getLocationData(user: User | null) {
    const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("userId", user?.id)
        .single()

    if (error) {
        console.error("Error getting location data:", error);
        return null;
    }
    return data;
}
