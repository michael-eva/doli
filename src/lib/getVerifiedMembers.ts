import supabase from "@/config/supabaseClient";

export async function getVerifiedMembers(select:string) {
    try {
        const { error, data: verifiedMembers } = await supabase
            .from("members")
            .select(`${select}`)
            .eq("isVerified", true)

        if (error) {
            throw new Error("Error fetching verified members: " + error.message);
        }

        if (verifiedMembers) {
            return verifiedMembers;
        } else {
            throw new Error("No verified members fetched.");
        }
    } catch (error) {
        console.error("Error fetching verified members:", error);
        throw error; // Propagate the error
    }
}
