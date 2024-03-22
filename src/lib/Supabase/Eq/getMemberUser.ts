import supabase from "@/config/supabaseClient";
import { User } from "@supabase/supabase-js";

export async function getMemberUser(select: string, user: User | null) {
    const { data, error } = await supabase
        .from("members")
        .select(select)
        .eq("id", user?.id)
        .single()

    if (error) {
        console.error("Error getting member data:", error);
        return null;
    }
    return data;
}