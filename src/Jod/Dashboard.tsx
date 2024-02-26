import { Link } from "react-router-dom"
import { seededPosts } from "./dashBoardFunctions"
import { needValidation } from "./dashBoardFunctions"
import { useEffect, useState } from "react"
import { getUnverifiedPosts } from "./API/getUnverifiedPosts"
export default function Dashboard() {
    const [serverResponse, setServerResponse] = useState("")

    // const validatePost = needValidation().validationRequired

    const claimedPosts = seededPosts().claimedPosts
    const posts = seededPosts().seededPosts
    //Fetching from netlify function:
    async function getMembers() {
        try {
            // in the response is where you'd customise the data you want to fetch 
            // eg: returning certain members instead of all
            const response = await fetch('/.netlify/functions/getMembers');
            if (!response.ok) {
                throw new Error('Failed to fetch data from serverless function');
            }

            const data = await response.json();
            console.log('Data from serverless function:', data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };
    useEffect(() => {
        getUnverifiedPosts
    }, [])
    const validationRequired = getUnverifiedPosts.length


    return (
        <>
            <div className=" flex justify-between max-w-xl m-auto">
                <div className=" border p-10 flex flex-col items-center gap-4" style={{ borderRadius: "6px" }}>
                    <h2>Claimed Posts:</h2>
                    <p className=" font-bold">{claimedPosts} / {posts}</p>
                    <button className=" btn btn-secondary"><Link to={"unclaimed-posts"}> see more</Link></button>
                </div>
                <div className=" border p-10 flex flex-col items-center gap-4" style={{ borderRadius: "6px" }}>
                    <h2>Validations required:</h2>
                    <p className=" font-bold">{validationRequired ? validationRequired : 0}</p>
                    {
                        validationRequired ?
                            <button className="btn btn-secondary"><Link to={"validate"}>See More</Link></button>
                            :
                            <button className="btn btn-secondary" disabled><Link to={"validate"}>See More</Link></button>
                    }
                </div>
            </div>
            <button className="btn btn-info" onClick={getMembers}>Get Members</button>
            <button className="btn btn-info" onClick={getUnverifiedPosts}>Get Posts</button>
        </>
    )
}
