import supabase from "@/config/supabaseClient";
export async function getCombinedData () {
    try {
        // Fetch posts data
        const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", false)
            .eq("isRejected", false)

        if (postsError) {
            console.error("Error fetching posts data:", postsError);
        }

        if (postsData) {
            // Process posts data
            const parsedPostsData = postsData.map((post) => ({
                ...post,
                selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
                openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
            }));

            // Fetch locations data
            const { data: locationsData, error: locationsError } = await supabase
                .from("locations")
                .select("*");

            if (locationsError) {
                console.error("Error fetching locations data:", locationsError);
            }

            if (locationsData) {
                // Merge postsData and locationsData based on postId
                const mergedData = parsedPostsData.map((post) => ({
                    ...post,
                    locationData: locationsData.find((location) => location.postId === post.postId),
                }));

                // Set the merged data in the posts state

                return mergedData
            }
        }
    } catch (error) {
        console.error("Error fetching combined data:", error);
    }
};