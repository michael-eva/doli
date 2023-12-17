import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useParams } from "react-router";
import PostForm from "./PostForm";

export default function EditPost() {
    const [post, setPost] = useState()
    const { postId } = useParams<{ postId: string }>()


    useEffect(() => {
        getPost()
    }, [])

    async function getPost() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq('postId', postId)
            .single()

        if (error) {
            console.error("Error:", error);
        }
        if (data) {
            const parsedData = {
                ...data,
                selectedTags: JSON.parse(data.selectedTags).map((tag: any) => tag),
            };
            setPost(parsedData);
        }

    }

    return (
        <PostForm postData={post} />
    )
}
