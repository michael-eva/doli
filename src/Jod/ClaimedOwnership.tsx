import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient"

type SeededPostsType = {
    name: string,
    email: string,
    hasOwner: boolean
}

export function ClaimedOwnership() {
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


                const unclaimed = data.filter(post => post.hasOwner === false);
                setUnclaimedPosts(unclaimed);
            }
        } catch (error) {
            console.error("Error in getUnclaimedPosts:", error);
        }
    }


    return (
        <div className=" flex flex-col items-center">
            <p className=" text-xl font-bold">{unClaimedPosts.length} unclaimed posts</p>
            <div className="overflow-x-auto max-w-4xl">
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    {unClaimedPosts.map((post, index) => {
                        return (<tbody>
                            <tr>
                                <th>{index}</th>
                                <td>{post.name}</td>
                                <td>{post.email}</td>
                            </tr>
                        </tbody>)
                    })}
                </table>
            </div>
        </div>
    )
}


