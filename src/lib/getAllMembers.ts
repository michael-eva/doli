import supabase from "@/config/supabaseClient";

export async function getAllMembers(select:string) {
    try {
        const { error, data: verifiedMembers } = await supabase
            .from("members")
            .select(`${select}`)

        if (error) {
            throw new Error("Error fetching members: " + error.message);
        }

        if (verifiedMembers) {
            return verifiedMembers;
        } else {
            throw new Error("No members fetched.");
        }
    } catch (error) {
        console.error("Error fetching members:", error);
        throw error; // Propagate the error
    }
}
