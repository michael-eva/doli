import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient"


type SeededPostsType = {
    name: string,
    email: string,
    hasOwner: boolean
}
export function seededPosts() {

    const [seededPosts, setSeededPosts] = useState<number>(0);
    const [unClaimedPosts, setUnclaimedPosts] = useState<SeededPostsType[]>([]);

    const getUnclaimedPosts = async () => {
        try {
            const { data, error } = await supabase
                .from("posts")
                .select("email, name, hasOwner")
                .in("hasOwner", [true, false]);

            if (error) {
                console.error(error);
            }

            if (data) {
                setSeededPosts(data.length);

                const unclaimed = data.filter(post => post.hasOwner === false);
                setUnclaimedPosts(unclaimed);
            }
        } catch (error) {
            console.error("Error in getUnclaimedPosts:", error);
        }
    }

    useEffect(() => {
        getUnclaimedPosts();
    }, []);

    const claimedPosts = seededPosts - unClaimedPosts.length
    return { claimedPosts, seededPosts, unClaimedPosts: unClaimedPosts.length }

}

export function needValidation() {
    const [validationRequired, setValidationRequired] = useState<number>()
    const getPosts = async () => {

        const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", false);

        if (postsError) {
            console.error("Error fetching posts data:", postsError);
        }
        if (postsData) {

            setValidationRequired(postsData.length)
        }
    }
    useEffect(() => {
        getPosts()
    }, [])
    return { validationRequired }
}

//function to take all posts and assign created_at value to updated_at

export async function seedUpdatedAt() {
    async function getPosts() {
        const { error, data } = await supabase
            .from("posts")
            .select("created_at, updated_at, postId")
        if (error) {
            console.error(error);
            return;
        }
        return data;
    }

    const posts = await getPosts();

    if (posts) {
        console.log(posts);

        // for (const post of posts) {
        //     const { error: updateError } = await supabase
        //         .from("posts")
        //         .update({ updated_at: post.created_at })
        //         .eq("postId", post.postId);

        //     if (updateError) {
        //         console.error(updateError);
        //     }
        // }

        // console.log("All updated_at values updated successfully.");
    }
}


