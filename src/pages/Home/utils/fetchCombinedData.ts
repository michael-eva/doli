import { getLocationData } from "@/lib/Supabase/getPostLocation";
import { getVerifiedPosts } from "@/lib/Supabase/getVerifiedPosts";

 export async function fetchCombinedData() {
    try {
        const verifiedPosts = await getVerifiedPosts();
        const locationData = await getLocationData()
        const parsedPostsData = verifiedPosts.map((post) => ({
            ...post,
            selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
            openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
        }));
        const mergedData = parsedPostsData.map((post) => ({
            ...post,
            locationData: locationData.find((location) => location.postId === post.postId),
        }));
        // setPosts(mergedData)
        return mergedData

    } catch (error) {
        console.error("Error fetching verified posts:", error);
    }
 }
