import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { Card } from "../components/Card"
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
}
export default function Validation() {
    const [posts, setPosts] = useState<CardProps[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    useEffect(() => {
        getPosts()
    }, [])
    const getPosts = async () => {
        const { error, data } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", false)

        if (error) {
            return console.error(error);
        }
        const parsedData = data.map((post) => ({
            ...post,
            selectedTags: JSON.parse(post.selectedTags),
        }));

        setPosts(parsedData);
    }
    console.log(posts);
    async function handleSubmit(postId: string) {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("posts")
                .update({ isVerified: true })
                .eq("postId", postId);

            if (error) {
                console.error("Error updating post:", error);
            } else {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.postId === postId ? { ...post, isVerified: true } : post
                    )
                );
                getPosts()
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return (
        <>
            <div className=" flex justify-center gap-10">
                <h3>Validation Page</h3>
                <h3>Validations required: {posts.length}</h3>
            </div>
            <div className=" max-w-7xl m-auto">
                <div className="flex flex-wrap justify-between h-full">
                    {posts.map((item: CardProps) => {
                        return (
                            <div key={item.postId} className="mt-10">
                                <Card {...item} isJod={true} handleSubmit={handleSubmit} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )

}
