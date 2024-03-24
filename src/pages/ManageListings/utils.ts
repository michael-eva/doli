import { CardProps } from "@/Types";
import supabase from "@/config/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export function getData(){
    const user = useUser()
    const [posts, setPosts] = useState<CardProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const getCombinedData = async () => {
        try {
            setIsLoading(true);
            if (!user?.id && !user?.email) return;

            // Fetch posts data
            const { data: userPostsData, error: userPostsError } = await supabase
                .from("posts")
                .select("*")
                .eq("id", user?.id);

            if (userPostsError) {
                console.error("Error fetching user posts data:", userPostsError);
            }

            // Fetch posts data where adminEmail matches user's email
            const { data: adminPostsData, error: adminPostsError } = await supabase
                .from("posts")
                .select("*")
                .eq("adminEmail", user?.email);

            if (adminPostsError) {
                console.error("Error fetching admin posts data:", adminPostsError);
            }

            const allPostsData = [...(userPostsData || []), ...(adminPostsData || [])];

            if (allPostsData.length > 0) {
                // Process posts data...
                const parsedPostsData = allPostsData.map((post) => ({
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
                    setIsLoading(false);
                    setPosts(mergedData);
                }
            } else {
                setIsLoading(false);
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching combined data:", error);
        }
    };
    useEffect(() => {
        setIsLoading(true)
        if (user?.id) {
            getCombinedData()

        }
    }, [user?.id])
    return {posts, isLoading, getCombinedData}
}