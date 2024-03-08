/**
 * v0 by Vercel.
 * @see https://v0.dev/t/iOkpIoBhUJE
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Link } from "react-router-dom"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { ResponsiveBar } from "@nivo/bar"
import { SVGProps } from "react"
import { JSX } from "react/jsx-runtime"

type DashboardType = {
    validationRequired: number,
    seededPosts: number,
    claimedPosts: number,
    monthlyListingCount: number,
    monthlyMemberCount: number,
    monthlyRatingCount: number
}

export default function NewDashboard({ validationRequired, seededPosts, claimedPosts, monthlyListingCount, monthlyMemberCount, monthlyRatingCount }: DashboardType) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <main className="flex flex-1 flex-col p-4 md:p-10">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <CheckCircleIcon className="w-8 h-8" />
                            <CardTitle className="text-2xl font-bold">Validations</CardTitle>
                            <Link className="ml-auto underline text-blue-500 dark:text-blue-400" to="validate">
                                View
                            </Link>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-8">
                            <div className="text-4xl font-bold">{validationRequired}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <FileEditIcon className="w-8 h-8" />
                            <CardTitle className="text-2xl font-bold">Claimed Posts</CardTitle>
                            <Link className="ml-auto underline text-blue-500 dark:text-blue-400" to="unclaimed-posts">
                                View
                            </Link>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-8">
                            <div className="text-4xl font-bold">{claimedPosts} / {seededPosts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <UserPlusIcon className="w-8 h-8" />
                            <CardTitle className="text-2xl font-bold">New Signups</CardTitle>
                            {/* <Link className="ml-auto underline text-blue-500 dark:text-blue-400" to="#">
                                View
                            </Link> */}
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-8">
                            <BarChart className="h-[200px] w-full" data={monthlyMemberCount} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <FilePlusIcon className="w-8 h-8" />
                            <CardTitle className="text-2xl font-bold">New Listings</CardTitle>
                            {/* <Link className="ml-auto underline text-blue-500 dark:text-blue-400" to="#">
                                View
                            </Link> */}
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-8">
                            <BarChart className="h-[200px] w-full" data={monthlyListingCount} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-4">
                            <StarIcon className="w-8 h-8" />
                            <CardTitle className="text-2xl font-bold">Ratings</CardTitle>
                            {/* <Link className="ml-auto underline text-blue-500 dark:text-blue-400" to="#">
                                View
                            </Link> */}
                        </CardHeader>
                        <CardContent className="flex items-center justify-center py-8">
                            <BarChart className="h-[200px] w-full" data={monthlyRatingCount} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

function BarChart({ className, data }: { className: string, data: any }) {
    return (
        <div className={className}>
            <ResponsiveBar
                data={data}
                keys={["count"]}
                indexBy="name"
                margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
                padding={0.3}
                colors={["#35cb84"]}
                axisBottom={{
                    tickSize: 0,
                    tickPadding: 16,
                }}
                axisLeft={{
                    tickSize: 0,
                    tickValues: 4,
                    tickPadding: 16,
                }}
                gridYValues={4}
                theme={{
                    tooltip: {
                        chip: {
                            borderRadius: "9999px",
                        },
                        container: {
                            fontSize: "12px",
                            textTransform: "capitalize",
                            borderRadius: "6px",
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#f3f4f6",
                        },
                    },
                }}
                tooltipLabel={({ id }) => `${id}`}
                enableLabel={false}
                role="application"
                ariaLabel="A bar chart showing data"
            />
        </div>
    )
}


function CheckCircleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}


function FileEditIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
        </svg>
    )
}


function FilePlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" x2="12" y1="18" y2="12" />
            <line x1="9" x2="15" y1="15" y2="15" />
        </svg>
    )
}

function StarIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}


function UserPlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
        </svg>
    )
}
