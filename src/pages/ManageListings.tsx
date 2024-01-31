import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { useUser } from "@supabase/auth-helpers-react"
import { Card } from "../components/Card"
import Loading from "../components/Loading"

type CardProps = {
    id: string,
    postId: string,
    imgUrl: string | null,
    name: string,
    suburb: string,
    state: string,
    postcode: string,
    address: string,
    type: string,
    selectedTags: string[],
    description: string,
    openingHours: string,
    pickUp: boolean,
    delivery: boolean,
    dineIn: boolean,
    contact: string,
    website: string,
    isVerified: boolean
}

export default function ManageListings() {
    const user = useUser()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    useEffect(() => {
        setIsLoading(true)
        if (user?.id) {
            // getPosts()
            getCombinedData()
            setIsLoading(false)
        }
    }, [user?.id])

    const getCombinedData = async () => {
        try {
            // Fetch posts data
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .eq("id", user?.id)

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
                // .eq("userId", user?.id)

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
                    setPosts(mergedData);
                }
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
                <div className="flex flex-wrap gap-4 max-w-7xl m-auto justify-start">
                    {posts.map((item: CardProps) => {
                        return (
                            <div key={item.postId} className="mt-10">
                                <Card {...item} showStatus={true} onDelete={deletePost} />
                            </div>
                        );
                    })}
                </div>
            )
        } else return (
            <div className=" flex items-center text-2xl flex-col pt-10">
                <p >No listings to display.</p>
                <p >Post a listing to view it here.</p>
            </div>
        )
    }

    return (
        <>
            {isLoading ? <Loading /> : cardsEl()
            }
        </>
    )
}
