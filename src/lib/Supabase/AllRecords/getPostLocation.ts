import supabase from "@/config/supabaseClient";

export async function getLocationData() {
    try {
        const { error, data: locationData } = await supabase
            .from("locations")
            .select("*")
            .not("postId", "eq", "");

        if (error) {
            throw new Error("Error fetching verified posts: " + error.message);
        }

        if (locationData) {
            return locationData;
        } else {
            throw new Error("No verified posts fetched.");
        }
    } catch (error) {
        console.error("Error fetching verified posts:", error);
        throw error; // Propagate the error
    }
}
