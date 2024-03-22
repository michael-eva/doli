import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PostForm from "../../components/PostForm/PostForm";
import { CardProps } from "../../Types";
import { getCombinedData } from "./utils/fetchCombinedData"

export default function EditPost() {
    const { postId } = useParams<{ postId: string }>()
    const [singlePost, setSinglePost] = useState<CardProps>()

    useEffect(() => {
        getData()
    }, [])
    async function getData() {
        const mergedData = await getCombinedData(postId);
        setSinglePost(mergedData);
    }

    return (
        <PostForm postData={singlePost} />
    )
}
