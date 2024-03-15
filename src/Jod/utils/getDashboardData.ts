import supabase from "@/config/supabaseClient";
import { useState, useEffect } from "react";
import { transformMonthlyCountsToArray } from "./utils";
import { getUnverifiedMembers } from "@/lib/getUnverifiedMembers";
type SeededPostsType = {
    name: string,
    email: string,
    hasOwner: boolean
}

export function getDashboardData(){
    const [validationRequired, setValidationRequired] = useState<string | undefined>("")
    const [monthlyListings, setMonthlyListingCounts] = useState("")
    const [monthlyRating, setMonthlyRatingCounts] = useState("")
    const [monthlyMember, setMonthlyMemberCounts] = useState("")
    const [seededPosts, setSeededPosts] = useState<number>(0);
    const [unClaimedPosts, setUnclaimedPosts] = useState<SeededPostsType[]>([]);
    const [unverifiedMembers, setUnverifiedMembers] = useState<number>(0)

    async function getMonthlySignUps() {
        const { data, error } = await supabase
            .from("members")
            .select("created_at")
            .order("created_at")
    
        if (error) {
            console.error(error);
        }
        if (data) {
            const monthlyCounts: any = {};
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
    async function getMonthlyRatings(){

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
    async function getMonthlyListings() {
        const { data: postsData, error: postsError } = await supabase
            .from("posts")
            .select("created_at")
            .order("created_at"); // Ensure the data is ordered by timestamp
        if (postsError) {
            return console.error("Error fetching posts data:", postsError);
        }
        if (postsData) {
            const monthlyCounts: any = {};
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
    async function getUnverifiedUsers(){
        try {
            const unverifiedMembers = await getUnverifiedMembers("id");
            setUnverifiedMembers(unverifiedMembers.length);
        } catch (error) {
            console.error("Error fetching unverified members:", error);
        }
    }
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
    useEffect(()=>{
        getMonthlySignUps()
        getMonthlyRatings()
        getUnverifiedPosts()
        getMonthlyListings()
        getUnclaimedPosts()
        getUnverifiedUsers()
    },[])
    const claimedPosts = seededPosts - unClaimedPosts.length
    return {
        monthlyMember:transformMonthlyCountsToArray(monthlyMember), 
        monthlyRating: transformMonthlyCountsToArray(monthlyRating), 
        monthlyListings: transformMonthlyCountsToArray(monthlyListings), 
        validationRequired, 
        claimedPosts, 
        posts:seededPosts,
        unverifiedMembers
    }
}