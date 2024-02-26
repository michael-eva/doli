import { Link } from "react-router-dom"
import { seededPosts } from "./dashBoardFunctions"
import { useState } from "react"
import { getUnverifiedPosts } from "./API/getUnverifiedPosts"



export default function Dashboard() {
    const [validationRequired, setValidationRequired] = useState("")
    const claimedPosts = seededPosts().claimedPosts
    const posts = seededPosts().seededPosts

    getUnverifiedPosts().then(data => {
        setValidationRequired(data.length)
    }).catch(error => {
        console.error(error)
    })
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
            {/* <button className="btn btn-info" onClick={getMembers}>Get Members</button> */}
            {/* <button className="btn btn-info" onClick={getUnverifiedPosts}>Get Posts</button> */}
        </>
    )
}
