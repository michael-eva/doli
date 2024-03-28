import supabase from "@/config/supabaseClient";

export async function getVerifiedPosts(homeScreenPosts: number) {
    try {
        const { error, data: verifiedPosts } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", true)
            .order("updated_at", { ascending: false })
            .range(0,homeScreenPosts-1)

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
