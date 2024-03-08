import { seededPosts } from "./dashBoardFunctions"
import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import NewDashboard from "./DashboardUI"



export default function Dashboard() {
    const [validationRequired, setValidationRequired] = useState("")
    const [monthlyListings, setMonthlyListingCounts] = useState("")
    const [monthlyRating, setMonthlyRatingCounts] = useState("")
    const [monthlyMember, setMonthlyMemberCounts] = useState("")
    const claimedPosts = seededPosts().claimedPosts
    const posts = seededPosts().seededPosts

    async function getUnverifiedPosts() {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", false)
            .eq("isRejected", false)

        if (error) {
            console.error(error);
        }
        if (data) {
            setValidationRequired(data.length.toString())
        }
    }
    useEffect(() => {
        getUnverifiedPosts()
        getMonthlyListings()
        getMonthlySignUps()
        getMonthlyRatings()
    }, [])

    function getMonthlyListings() {
        const getPosts = async () => {
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("created_at")
                .order("created_at"); // Ensure the data is ordered by timestamp
            if (postsError) {
                console.error("Error fetching posts data:", postsError);
            }
            if (postsData) {
                const monthlyCounts = {};
                for (const post of postsData) {
                    const createdAt = new Date(post.created_at);
                    const monthYear = `${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
                    if (!monthlyCounts[monthYear]) {
                        monthlyCounts[monthYear] = 0;
                    }
                    monthlyCounts[monthYear]++;
                }
                setMonthlyListingCounts(monthlyCounts)
            }
        }
        getPosts()
    }
    function getMonthlySignUps() {
        async function getUsers() {
            const { data, error } = await supabase
                .from("members")
                .select("created_at")
                .order("created_at")

            if (error) {
                console.error(error);
            }
            if (data) {
                const monthlyCounts = {};
                for (const member of data) {
                    const createdAt = new Date(member.created_at);
                    const monthYear = `${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
                    if (!monthlyCounts[monthYear]) {
                        monthlyCounts[monthYear] = 0;
                    }
                    monthlyCounts[monthYear]++;
                }
                setMonthlyMemberCounts(monthlyCounts)
            }
        }
        getUsers()
    }
    function getMonthlyRatings() {
        async function getRatings() {
            const { data, error } = await supabase
                .from("ratings")
                .select("created_at")
                .order("created_at")
            if (error) {
                console.error(error);
            }
            if (data) {
                const monthlyCounts: any = {};
                for (const rating of data) {
                    const createdAt = new Date(rating.created_at);
                    const monthYear = `${createdAt.getMonth() + 1}-${createdAt.getFullYear()}`;
                    if (!monthlyCounts[monthYear]) {
                        monthlyCounts[monthYear] = 0;
                    }
                    monthlyCounts[monthYear]++;
                }
                setMonthlyRatingCounts(monthlyCounts)
            }
        }
        getRatings()
    }
    const transformMonthlyCountsToArray = (monthlyCounts) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const transformedData = [];
        for (const key in monthlyCounts) {
            if (monthlyCounts.hasOwnProperty(key)) {
                const [month, year] = key.split("-");
                transformedData.push({ name: months[parseInt(month) - 1], count: monthlyCounts[key] });
            }
        }
        return transformedData;
    };
    return (
        <>
            <NewDashboard validationRequired={validationRequired} seededPosts={posts} claimedPosts={claimedPosts} monthlyListingCount={transformMonthlyCountsToArray(monthlyListings)} monthlyMemberCount={transformMonthlyCountsToArray(monthlyMember)} monthlyRatingCount={transformMonthlyCountsToArray(monthlyRating)} />
            {/* <button className="btn btn-info" onClick={seedUpdatedAt}>Add updated at</button> */}
            {/* <button className="btn btn-info" onClick={getUnverifiedPosts}>Get Posts</button> */}

        </>
    )
}
