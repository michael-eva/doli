import { getLocationData } from "./Supabase/useSupabase";
import { getVerifiedPosts } from "./Supabase/getVerifiedPost";

 export async function fetchCombinedData(homeScreenPosts: number) {
    try {
        
        const verifiedPosts = await getVerifiedPosts(homeScreenPosts);
        const postIdArr = verifiedPosts.map(item => item.postId)
        const locationData = await getLocationData(postIdArr)
        
        const parsedPostsData = verifiedPosts.map((post) => ({
            ...post,
            selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
            openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
        }));
        const mergedData = parsedPostsData.map((post) => ({
            ...post,
            locationData: locationData.find((location) => location.postId === post.postId),
        }));
        console.log("Merged data:", mergedData);
        
        return mergedData
        

    } catch (error) {
        console.error("Error fetching verified posts:", error);
    }
 }
