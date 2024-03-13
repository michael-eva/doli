import NewDashboard from "./DashboardUI"
import { getMonthlyData } from "./utils/getMonthlyData"

export default function Dashboard() {
    const { validationRequired, claimedPosts, posts, monthlyListings, monthlyMember, monthlyRating } = getMonthlyData()
    return (
        <>
            <NewDashboard
                validationRequired={validationRequired}
                seededPosts={posts}
                claimedPosts={claimedPosts}
                monthlyListingCount={monthlyListings}
                monthlyMemberCount={monthlyMember}
                monthlyRatingCount={monthlyRating}
            />
        </>
    )
}
