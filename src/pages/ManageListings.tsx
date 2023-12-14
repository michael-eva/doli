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
            getPosts()
            setIsLoading(false)
        }
    }, [user?.id])
    const getPosts = async () => {
        const { error, data } = await supabase
            .from("posts")
            .select("*")
            .eq("id", user?.id)

        if (error) {
            return console.error(error);
        }
        const parsedData: any = data.map((post) => ({
            ...post,
            selectedTags: JSON.parse(post.selectedTags),
        }));

        setPosts(parsedData);

    }
    const deletePost = async (postId: string) => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq('postId', postId)
        if (error) {
            console.error(error);
        }
        getPosts()
    }

    const cardsEl = () => {
        return (
            <div className="flex flex-wrap justify-between h-full">
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

    return (
        <>
            {isLoading ? <Loading /> : cardsEl()
            }
        </>
    )
}
