import supabase from "@/config/supabaseClient";

export async function getUnverifiedMembers(select:string) {
    try {
        const { error, data: unverifiedMembers } = await supabase
            .from("members")
            .select(`${select}`)
            .eq("isVerified", false)

        if (error) {
            throw new Error("Error fetching unverified members: " + error.message);
        }

        if (unverifiedMembers) {
            return unverifiedMembers;
        } else {
            throw new Error("No unverified members fetched.");
        }
    } catch (error) {
        console.error("Error fetching verified members:", error);
        throw error; // Propagate the error
    }
}
