import { getLocationData } from "./Supabase/useSupabase";
import { getVerifiedPosts } from "./Supabase/getVerifiedPost";

export async function fetchCombinedData() {
  try {
    const verifiedPosts = await getVerifiedPosts();
    const postIdArr = verifiedPosts.map((item) => item.postId);
    const locationData = await getLocationData(postIdArr);

    const parsedPostsData = verifiedPosts.map((post) => ({
      ...post,
      selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
      openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
    }));
    const mergedData = parsedPostsData.map((post) => ({
      ...post,
      locationData: locationData.find(
        (location) => location.postId === post.postId
      ),
    }));

    return mergedData;
  } catch (error) {
    console.error("Error fetching verified posts:", error);
  }
}
