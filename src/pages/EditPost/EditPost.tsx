import { useParams } from "react-router";
import PostForm from "../../components/PostForm/PostForm";
import fetchData from "./utils";

export default function EditPost() {
    const { postId } = useParams<{ postId: string }>()
    const { singlePost } = fetchData(postId)

    return (
        <>
            <PostForm postData={singlePost} name={""} description={""} />
        </>
    )
}
