import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient"

type SeededPostsType = {
    name: string,
    email: string,
    hasOwner: boolean
}

export function ClaimedOwnership() {
    const [unClaimedPosts, setUnclaimedPosts] = useState<SeededPostsType[]>([]);
    const [claimedPosts, setClaimedPosts] = useState<SeededPostsType[]>([])

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

                const claimed = data.filter(post => post.hasOwner === true);
                const unclaimed = data.filter(post => post.hasOwner === false);
                setClaimedPosts(claimed)
                setUnclaimedPosts(unclaimed);
            }
        } catch (error) {
            console.error("Error in getUnclaimedPosts:", error);
        }
    }

    useEffect(() => {
        getUnclaimedPosts();
    }, []);


    return (
        <div className=" flex gap-5 justify-evenly">
            <div className="overflow-x-auto max-w-4xl flex flex-col">
                <p className=" text-xl font-bold">{unClaimedPosts.length} unclaimed posts</p>
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
            <div className="overflow-x-auto max-w-4xl flex flex-col">
                <p className=" text-xl font-bold">{claimedPosts.length} claimed posts</p>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    {claimedPosts.map((post, index) => {
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


