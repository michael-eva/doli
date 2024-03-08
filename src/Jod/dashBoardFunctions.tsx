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
                .select("email, name, hasOwner, created_at")
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

// export function getMonthlyCounts() {
//     const [monthlyCounts, setMonthlyCounts] = useState("")
//     const getPosts = async () => {

//         const { data: postsData, error: postsError } = await supabase
//             .from("posts")
//             .select("created_at")
//             .order("created_at"); // Ensure the data is ordered by timestamp
//         if (postsError) {
//             console.error("Error fetching posts data:", postsError);
//         }
//         if (postsData) {
//             const monthlyCounts = {};
//             for (const post of postsData) {
//                 const createdAt = new Date(post.created_at);
//                 const monthYear = `${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
//                 if (!monthlyCounts[monthYear]) {
//                     monthlyCounts[monthYear] = 0;
//                 }
//                 monthlyCounts[monthYear]++;
//             }
//             setMonthlyCounts(monthlyCounts)
//         }
//     }
//     useEffect(() => {
//         getPosts()
//     }, []);
//     return { monthlyCounts }
// }
