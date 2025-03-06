import supabase from "@/config/supabaseClient";
export async function getCombinedData() {
  try {
    // Fetch posts data
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("isVerified", false)
      .eq("isRejected", false);

    if (postsError) {
      throw new Error("Error fetching posts data:" + postsError.message);
    }

    if (!postsData) {
      throw new Error("No posts data fetched.");
    }

    // Process posts data
    const parsedPostsData = postsData.map((post) => ({
      ...post,
      selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
      openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
    }));

    // Get array of post IDs from parsed posts data
    const postIds = parsedPostsData.map((post) => post.postId);

    // Fetch only locations that match our posts
    const { data: locationsData, error: locationsError } = await supabase
      .from("locations")
      .select("*")
      .in("postId", postIds);

    if (locationsError) {
      throw new Error(
        "Error fetching locations data:" + locationsError.message
      );
    }

    if (!locationsData) {
      throw new Error("No locations data fetched.");
    }
    // Merge postsData and locationsData based on postId
    const mergedData = parsedPostsData.map((post) => ({
      ...post,
      locationData: locationsData.find(
        (location) => location.postId === post.postId
      ),
    }));

    return mergedData;
  } catch (error) {
    console.error("Error fetching combined data:", error);
    throw error; // Propagate the error
  }
}
