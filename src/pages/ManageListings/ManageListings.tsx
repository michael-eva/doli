
import supabase from "../../config/supabaseClient"
import { Card } from "../../components/Card"
import { CardProps } from "../../Types"
import CardSkeleton from "../../components/Loading/CardSkeleton"
import { getData } from "./utils"
import { Helmet } from 'react-helmet'

export default function ManageListings() {
    const { posts, isLoading, getCombinedData } = getData()
    const deletePost = async (postId: string) => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq('postId', postId)
        if (error) {
            console.error(error);
        }
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
            {/* <Helmet>
                <title>doli | Manage Listing</title>
                <meta name="description" content="Manage your listing" />
            </Helmet> */}
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
