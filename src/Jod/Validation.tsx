import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import { Card } from "../components/Card"
type CardProps = {
    locationData: {
        altCountry: string,
        altFormatted_address: string,
        altPostcode: string,
        altState: string,
        altSuburb: string,
        coordinates: {
            latitude: number,
            longitude: number,
        },
        country: string,
        formatted_address: string,
        state: string,
        suburb: string,
        streetAddress: string,
        postcode: string
    },
    id: string,
    postId: string,
    imgUrl: string | null,
    name: string,
    locality: string,
    state: string,
    postcode: string,
    address: string,
    type: string,
    selectedTags: [{
        value: string,
        label: string
    }],
    description: string,
    openingHours: [{
        id: string,
        day: string,
        isOpen: string,
        fromTime: string,
        toTime: string
    }],
    pickUp: boolean,
    delivery: boolean,
    dineIn: boolean,
    contact: string,
    website: string,
    [key: string]: any;
}
export default function Validation() {
    const [posts, setPosts] = useState<CardProps[]>([])

    useEffect(() => {
        getCombinedData()
    }, [])

    const getCombinedData = async () => {
        try {
            // Fetch posts data
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .eq("isVerified", false);

            if (postsError) {
                console.error("Error fetching posts data:", postsError);
            }

            if (postsData) {
                // Process posts data
                const parsedPostsData = postsData.map((post) => ({
                    ...post,
                    selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
                    openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
                }));

                // Fetch locations data
                const { data: locationsData, error: locationsError } = await supabase
                    .from("locations")
                    .select("*");

                if (locationsError) {
                    console.error("Error fetching locations data:", locationsError);
                }

                if (locationsData) {
                    // Merge postsData and locationsData based on postId
                    const mergedData = parsedPostsData.map((post) => ({
                        ...post,
                        locationData: locationsData.find((location) => location.postId === post.postId),
                    }));

                    // Set the merged data in the posts state
                    setPosts(mergedData);
                }
            }
        } catch (error) {
            console.error("Error fetching combined data:", error);
        }
    };
    async function handleSubmit(postId: string) {
        const post = posts.find(post => post.postId === postId)
        const userEmail = post?.email
        try {
            const { error } = await supabase
                .from("posts")
                .update({ isVerified: true })
                .eq("postId", postId);
            validateAndSendEmail(userEmail)
            if (error) {
                console.error("Error updating post:", error);
            } else {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.postId === postId ? { ...post, isVerified: true } : post
                    )
                );
                getCombinedData()
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    async function validateAndSendEmail(email: string) {
        console.log(email);

        // try {
        //     const response = await fetch('/.netlify/functions/sendVerificationEmail', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ email }),
        //     });

        //     if (response.ok) {
        //         console.log('Email sent successfully');
        //     } else {
        //         console.error('Failed to send email:', response.status, response.statusText);
        //         throw new Error('Failed to fetch data from serverless function');
        //     }
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // }
    }

    return (
        <>
            <div className=" flex justify-center gap-10">
                {posts.length > 0 ? posts.length : <h1 className=" text-xl italic">No posts to be validated</h1>}
            </div>
            <div className=" max-w-7xl m-auto">
                <div className="flex flex-wrap justify-evenly h-full">
                    {posts.map((item: CardProps) => {
                        return (
                            <div key={item.postId} className="mt-10">
                                <Card {...item} isJod={true} handleSubmit={handleSubmit} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )

}
