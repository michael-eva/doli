import { CardProps } from "@/Types";
import supabase from "@/config/supabaseClient";
import { useEffect, useState } from "react";

export default function fetchData(postId: string | undefined){
    const [singlePost, setSinglePost] = useState<CardProps>()
async function getCombinedData(){
    try {
        // Fetch posts data
        const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .eq('postId', postId)
        // .single()

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
                .select("*")
                .eq('postId', postId)
            // .single()

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
                setSinglePost(mergedData[0] || {});
            }
        }
    } catch (error) {
        console.error("Error fetching combined data:", error);
    }
}
    useEffect(() => {
        getCombinedData()
    }, [])
    return{singlePost}
}