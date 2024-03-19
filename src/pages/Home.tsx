import { Card } from "../components/Card";
import businessType from "../data/businessTypes.json"
import LocationSearch from "../components/Location/LocationSearch";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import CardSkeleton from "../components/Loading/CardSkeleton";
import { useMediaQuery } from "react-responsive"
import FilterFields from "../components/Mobile/FilterFields";
import Pagination from "../components/Pagination";
import { CardProps } from "../Types";
import { RetrieveOwner } from "../seed/RetrieveOwner";
import { useUser } from "@supabase/auth-helpers-react";
import { filterOrders } from "@/lib/filterOrders";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { getVerifiedPosts } from "@/lib/getVerifiedPosts";
import { getLocationData } from "@/lib/getPostLocation";
import { deletePost } from "@/lib/deletePost";
import { useSupabase } from "@/lib/Supabase/getAllMembers";

export default function Home() {
    const [isChecked, setIsChecked] = useState(true)
    const [posts, setPosts] = useState<CardProps[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const typeFilter = searchParams.get("type")
    const searchFilter = searchParams.get("search")
    const locationFilter = searchParams.get("location")
    const nearbyFilter = searchParams.get("coordinates")
    const deliveryFilter = searchParams.get("deliveryMethod")
    const { register } = useForm()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 8
    const [inputClear, setInputClear] = useState<boolean>(false)
    const decodedTypeFilter = typeFilter ? decodeURIComponent(typeFilter) : null
    const decodedSearchFilter = searchFilter ? decodeURIComponent(searchFilter) : null;
    const decodedLocationFilter = locationFilter ? decodeURIComponent(locationFilter) : null
    const { filterPosts, paginatePageVar } = filterOrders(posts, decodedTypeFilter, deliveryFilter, isChecked, locationFilter, decodedLocationFilter, decodedSearchFilter, currentPage, pageSize)
    const isFilter = typeFilter || searchFilter || deliveryFilter || locationFilter || nearbyFilter ? true : false
    const user = useUser();
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, filterPosts.length);

    const { allMembers } = useSupabase("id")

    async function fetchCombinedData() {
        try {
            const verifiedPosts = await getVerifiedPosts();
            const locationData = await getLocationData()
            const parsedPostsData = verifiedPosts.map((post) => ({
                ...post,
                selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
                openingHours: JSON.parse(post.openingHours).map((tag: any) => tag),
            }));
            const mergedData = parsedPostsData.map((post) => ({
                ...post,
                locationData: locationData.find((location) => location.postId === post.postId),
            }));
            setPosts(mergedData)

        } catch (error) {
            console.error("Error fetching verified posts:", error);
        }
    }
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
    useEffect(() => {
        setIsLoading(true); // Set loading to true when fetching data
        fetchCombinedData()
            .then(() => setIsLoading(false)) // Set loading to false once data is fetched
            .catch((error) => {
                console.error(error);
                setIsLoading(false); // Ensure loading is turned off on error too
            });

    }, [typeFilter, locationFilter, searchFilter]);

    async function deleteListing(postId: string) {
        await deletePost(postId)
        fetchCombinedData()
    }
    const genNewSearchParams = (key: string, value: string) => {
        const sp = new URLSearchParams(searchParams)
        if (value === null) {
            sp.delete(key)
        } else {
            sp.set(encodeURIComponent(key), encodeURIComponent(value))
        }
        setSearchParams(`?${sp.toString()}`)
        setCurrentPage(1)
    }
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const handleLocationSelect = (_address: string, postcode: string, _locality: string, _state: string, _country: string, coordinates: any) => {

        if (isChecked) {
            genNewSearchParams('coordinates', `${coordinates.latitude} + ${coordinates.longitude}`)
        } else if (!isChecked) {
            genNewSearchParams('location', postcode)
        }
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
                            <FilterFields nearbyFilter={nearbyFilter} clearFilters={clearFilters} isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} register={register} genNewSearchParams={genNewSearchParams} typeFilter={decodedTypeFilter} businessType={businessType} searchFilter={decodedSearchFilter} locationFilter={decodedLocationFilter} setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} />
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
                                    {posts.length > 0 || allMembers ? (
                                        <>
                                            <p className="text-xl py-2 font-bold font-raleway" style={{ color: "#4e9da8" }}>
                                                {deliveryFilter || nearbyFilter || searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? filterPosts.length : posts.length}{" "}
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


                        <div className="flex gap-10 justify-center mt-14">
                            <div className="flex flex-col">
                                <div className="">
                                    <LocationSearch className="border-2 p-2 rounded-lg max-h-11" setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} types={['locality']} placeholder="Search by suburb" suburbAndPostcode={false} />
                                </div>
                                <label className='autoSaverSwitch relative inline-flex cursor-pointer select-none items-center'>
                                    <input
                                        type='checkbox'
                                        name='autoSaver'
                                        className='sr-only'
                                        checked={isChecked}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span
                                        className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${isChecked ? 'bg-primary' : 'bg-[#CCCCCE]'
                                            }`}
                                    >
                                        <span
                                            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${isChecked ? 'translate-x-6' : ''
                                                }`}
                                        ></span>
                                    </span>
                                    <span className='label flex items-center text-sm font-medium text-black'>
                                        Include Nearby Locations
                                    </span>
                                </label>
                            </div>
                            <div >
                                <Select value={typeFilter ? decodedTypeFilter : ""} onValueChange={(selectedOption) => genNewSearchParams('type', selectedOption)}>
                                    <SelectTrigger className=" border-2 border-black h-11 w-52">
                                        <div className={`${typeFilter ? "" : "text-gray-500"}`}>
                                            <SelectValue placeholder="Select Type of Business" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {businessType.map(item => (
                                                <SelectItem key={item} value={item}>{item}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                            </div>
                            <div className="flex flex-col dropdown-bottom">
                                <Select value={deliveryFilter || ""} onValueChange={(selectedOption) => genNewSearchParams('deliveryMethod', selectedOption)}>
                                    <SelectTrigger className=" border-2 border-black h-11 w-52">
                                        <div className={`${deliveryFilter ? "" : "text-gray-500"}`}>
                                            <SelectValue placeholder="Select Delivery Method" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {/* <SelectLabel>Select Delivery Method</SelectLabel> */}
                                            <SelectItem value="delivery">Delivery</SelectItem>
                                            <SelectItem value="dineIn">Dine-In</SelectItem>
                                            <SelectItem value="pickUp">Pick-Up</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                {/* <label htmlFor="">Enter Search Term:</label> */}
                                <Input
                                    type="text"
                                    placeholder="General Search"
                                    className="border-2 border-black h-11"
                                    value={searchFilter ? decodedSearchFilter : ""}
                                    onChange={(e) => genNewSearchParams("search", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className=" flex justify-center">
                            {deliveryFilter || nearbyFilter || searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? <button className="btn btn-md btn-error w-36" onClick={clearFilters}>Clear filters</button> : ""}
                        </div>
                        <div className="divider "></div>
                    </>
                }
                <div className="flex justify-between">
                    <p className={`${isMobile ? "py-2 px-7" : ""}`}>
                        {startIndex} - {endIndex} of {filterPosts.length} results
                    </p>
                    {isMobile && <p className={`${isMobile ? "py-2 px-7" : ""}`} >
                        <p className=" font-bold font-raleway" >{members?.length} <span>Members</span></p>
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
                {filterPosts.length > 2 && <Pagination totalItems={filterPosts.length} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />}
            </div >
        </>
    );
}
