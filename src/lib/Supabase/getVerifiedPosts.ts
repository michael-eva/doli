import supabase from "@/config/supabaseClient";

export async function getVerifiedPosts() {
    try {
        const { error, data: verifiedPosts } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", true)
            .order("updated_at", { ascending: false });

        if (error) {
            throw new Error("Error fetching verified posts: " + error.message);
        }

        if (verifiedPosts) {
            return verifiedPosts;
        } else {
            throw new Error("No verified posts fetched.");
        }
    } catch (error) {
        console.error("Error fetching verified posts:", error);
        throw error; // Propagate the error
    }
}
