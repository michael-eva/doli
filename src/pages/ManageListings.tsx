import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useUser } from "@supabase/auth-helpers-react"
import { Card } from "../components/Card"
import { CardProps } from "../Types"
import CardSkeleton from "../components/Loading/CardSkeleton"

export default function ManageListings() {
    const user = useUser()
    const [posts, setPosts] = useState<CardProps[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
        if (user?.id) {
            getCombinedData()

        }
    }, [user?.id])

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

    const deletePost = async (postId: string) => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq('postId', postId)
        if (error) {
            console.error(error);
        }
        // getPosts()
        getCombinedData()
    }

    const cardsEl = () => {
        if (posts?.length > 0) {

            return (
                <div className="flex flex-wrap gap-4 max-w-7xl m-auto md:justify-start justify-center pb-10">
                    {posts.map((item: CardProps) => {
                        return (
                            <div key={item.postId} className="mt-10">
                                <Card {...item} showStatus={true} onDelete={deletePost} />
                            </div>
                        );
                    })}
                </div>
            )
        }
        else return (
            <div className=" flex items-center text-2xl flex-col pt-10">
                <p >No listings to display.</p>
                <p >Post a listing to view it here.</p>
            </div>
        )
    }

    return (
        <>
            {isLoading ?
                <div className="flex flex-wrap gap-4 max-w-7xl m-auto md:justify-start justify-center">
                    {
                        Array.from({ length: 2 }, (_, index) => (
                            <CardSkeleton key={index} />
                        ))
                    }
                </div>
                : cardsEl()
            }
        </>
    )
}
