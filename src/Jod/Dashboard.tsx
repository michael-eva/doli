import NewDashboard from "./DashboardUI"
import { getMonthlyData } from "./utils/getMonthlyData"
import AboutV1 from "./AboutV1"
import AboutPage from "./AboutPage"

export default function Dashboard() {
    const { validationRequired, claimedPosts, posts, monthlyListings, monthlyMember, monthlyRating } = getMonthlyData()
    return (
        <>
            {/* <NewDashboard
                validationRequired={validationRequired}
                seededPosts={posts}
                claimedPosts={claimedPosts}
                monthlyListingCount={monthlyListings}
                monthlyMemberCount={monthlyMember}
                monthlyRatingCount={monthlyRating}
            /> */}
            <AboutV1 />
        </>
    )
}
