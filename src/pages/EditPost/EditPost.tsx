import { useParams } from "react-router";
import PostForm from "../../components/PostForm/PostForm";
import fetchData from "./utils";
import { Helmet } from "react-helmet"

export default function EditPost() {
    const { postId } = useParams<{ postId: string }>()
    const { singlePost } = fetchData(postId)

    return (
        <>
            {/* <Helmet>
                <title>doli | Edit Post</title>
                <meta name="description" content="Edit post / listing on doli" />
            </Helmet> */}
            <PostForm postData={singlePost} name={""} description={""} />
        </>
    )
}
