import { Card } from "../../components/Card";
import { useEffect, useState } from "react";
import supabase from "../../config/supabaseClient";
import { useSearchParams } from "react-router-dom";
import CardSkeleton from "../../components/Loading/CardSkeleton";
import { useMediaQuery } from "react-responsive"
import Pagination from "../../components/Pagination";
import { CardProps } from "../../Types";
import { RetrieveOwner } from "../../seed/RetrieveOwner";
import { useUser } from "@supabase/auth-helpers-react";
import { filterOrders } from "./utils/filterOrders";
import { deletePost } from "@/lib/deletePost";
import { useSupabase } from "@/lib/Supabase/AllRecords/getAllRecords";
import { isFilterApplied } from "./utils/filterFunctions";
import HomeFilters from "@/components/Filters/HomeFilters";


export default function Home() {
    const [isChecked, setIsChecked] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 8
    const [inputClear, setInputClear] = useState<boolean>(false)
    const { filterPosts, paginatePageVar, isLoading } = filterOrders(isChecked, currentPage, pageSize)
    const isFilter = isFilterApplied()
    const user = useUser();
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, filterPosts?.length);
    const { allMembers } = useSupabase("id")

    const isVerified = allMembers?.some(member => (member.id === user?.id && member.isVerified === true))
    function verifyInvitedUsers() {
        if (!isVerified) {
            const verifyUser = async () => {
                const { error } = await supabase
                    .from("members")
                    .update({ isVerified: true, email: user?.email })
                    .eq("id", user?.id)

                if (error) {
                    console.error(error);
                }
            }
            verifyUser()
        }
    }
    useEffect(() => {
        if (user) {
            RetrieveOwner(user.email, user);
            verifyInvitedUsers()
        }
    }, [user?.email]);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    async function deleteListing(postId: string) {
        await deletePost(postId)
        fetchData()
    }
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const clearFilters = () => {
        setSearchParams("")
        setInputClear(true)
        setCurrentPage(1)
    }

    return (
        <>
            <div className=" max-w-5xl md:mx-auto pb-10 ">
                {isMobile &&
                    <div className=" flex flex-col gap-5">
                        <div className=" rounded flex flex-col items-center mt-6">
                            <h2 className=" text-3xl font-fira_sans" style={{ color: "#0097B2" }}>Hungry? Thirsty?</h2>
                            <p className=" text-xl leading-10 max-w-xs mt-3">If you want to know the best places to eat and drink...  <span className=" font-bold text-2xl" style={{ color: "#CF4342" }}> ask a local!</span></p>
                        </div>
                        <div className="px-4">
                            <HomeFilters isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} inputClear={inputClear} setInputClear={setInputClear} clearFilters={clearFilters} />
                        </div>
                    </div>
                }
                {!isMobile &&
                    <>
                        <div className="flex items-center ">
                            <div className="w-1/3">
                                <div className=" flex flex-col ">
                                    <h2 className=" text-4xl font-fira_sans" style={{ color: "#0097B2" }}>Hungry? Thirsty?</h2>
                                    <p className=" text-2xl leading-10 max-w-xs mt-3">If you want to know the best places to eat and drink...  <span className=" font-bold text-2xl" style={{ color: "#CF4342" }}> ask a local!</span></p>
                                </div>
                            </div>
                            <div className="flex w-1/3 flex-col pl-24">
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold font-raleway" >Search Results:</p>
                                    {filterPosts?.length > 0 && allMembers ? (
                                        <>
                                            <p className="text-xl py-2 font-bold font-raleway" style={{ color: "#4e9da8" }}>
                                                {filterPosts?.length}{" "}
                                                <span>Businesses</span>
                                            </p>
                                            <p className="text-xl py-2 font-bold font-raleway" style={{ color: "#4e9da8" }}>
                                                {allMembers?.length} <span>Members</span>
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-xl py-2 font-bold font-raleway" style={{ color: "#4e9da8" }}>
                                            Loading...
                                        </p>
                                    )}

                                </div>
                            </div>
                            <div className="w-1/3 flex justify-center">
                                <img src="images/cropped_logo.png" alt="" width={350} style={{ minHeight: "200px", minWidth: '200px' }} />
                            </div>
                        </div>
                        <HomeFilters isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} clearFilters={clearFilters} inputClear={inputClear} setInputClear={setInputClear} />
                    </>
                }
                <div className="flex justify-between">
                    <p className={`${isMobile ? "py-2 px-7" : ""}`}>
                        {startIndex} - {endIndex} of {filterPosts?.length} results
                    </p>
                    {isMobile && <p className={`${isMobile ? "py-2 px-7" : ""}`} >
                        <p className=" font-bold font-raleway" >{allMembers?.length} <span>Members</span></p>
                    </p>}
                </div>
                <div className={` flex ${isMobile ? 'flex-col items-center' : 'flex-wrap justify-start gap-4'} h-full`}>
                    {isLoading ?
                        <>
                            {
                                Array.from({ length: 2 }, (_, index) => (
                                    <CardSkeleton key={index} />
                                ))
                            }
                        </>
                        :
                        filterPosts?.length > 0 ? (
                            paginatePageVar.map((item: CardProps) => (
                                <div key={item.postId} className="mt-10">
                                    <Card {...item} onDelete={deleteListing} />
                                </div>
                            ))
                        ) : isFilter ? (
                            <div className=" mt-10">
                                <p className="text-3xl font-thin">Sorry, no results found.</p>
                                <p className="text-2xl font-thin">Please try a different search criteria.</p>
                            </div>
                        ) : null}
                </div>
                {filterPosts?.length > 2 && <Pagination totalItems={filterPosts?.length} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />}
            </div >
        </>
    );
}
