import supabase from "@/config/supabaseClient";
export async function getCombinedData(type?: 'business' | 'artist') {
  try {
    let mergedData: any[] = [];

    // Fetch and process posts data if type is not specified or is 'business'
    if (!type || type === 'business') {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("isVerified", false)
        .eq("isRejected", false);

      if (postsError) {
        throw new Error("Error fetching posts data:" + postsError.message);
      }

      // Process posts data if it exists
      if (postsData && postsData.length > 0) {
        const parsedPostsData = postsData.map((post) => ({
          ...post,
          selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
          openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
          itemType: 'business' // Add type to distinguish between businesses and artists
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

        // Merge postsData and locationsData based on postId
        const businessData = parsedPostsData.map((post) => ({
          ...post,
          locationData: locationsData?.find(
            (location) => location.postId === post.postId
          ),
        }));

        mergedData = [...mergedData, ...businessData];
      }
    }

    // Fetch and process artists data if type is not specified or is 'artist'
    if (!type || type === 'artist') {
      const { data: artistsData, error: artistsError } = await supabase
        .from("artists")
        .select("*")
        .eq("is_verified", false)
        .eq("is_rejected", false);

      if (artistsError) {
        throw new Error("Error fetching artists data:" + artistsError.message);
      }

      // Process artists data if it exists
      if (artistsData && artistsData.length > 0) {
        const processedArtistsData = artistsData.map((artist) => ({
          ...artist,
          itemType: 'artist', // Add type to distinguish between businesses and artists
          postId: artist.id, // Use artist ID as postId for consistency with validation UI
          imgUrl: artist.image_url,
          description: artist.about,
          email: artist.admin_one_email
        }));

        mergedData = [...mergedData, ...processedArtistsData];
      }
    }

    return mergedData;
  } catch (error) {
    console.error("Error fetching combined data:", error);
    throw error; // Propagate the error
  }
}
