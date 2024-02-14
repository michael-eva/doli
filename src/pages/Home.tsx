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
import { CardProps, MemberType } from "../Types";
import { RetrieveOwner } from "../seed/RetrieveOwner";
import { useUser } from "@supabase/auth-helpers-react";
import { filterOrders } from "../Functions/filterOrders";

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
    const [members, setMembers] = useState<MemberType[]>()
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 8
    const [inputClear, setInputClear] = useState<boolean>(false)
    const { filterPosts, paginatePageVar } = filterOrders(posts, typeFilter, deliveryFilter, isChecked, locationFilter, nearbyFilter, searchFilter, currentPage, pageSize)
    const isFilter = typeFilter || searchFilter || deliveryFilter || locationFilter || nearbyFilter ? true : false
    const user = useUser();
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, filterPosts.length);
    const isVerified = members?.some(member => (member.isVerified === true && member.id === user?.id))

    useEffect(() => {
        if (user) {
            RetrieveOwner(user.email, user);
        }
    }, [user?.email]);
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }
    useEffect(() => {
        setIsLoading(true); // Set loading to true when fetching data
        getMembers()
        getCombinedData()
            .then(() => setIsLoading(false)) // Set loading to false once data is fetched
            .catch((error) => {
                console.error(error);
                setIsLoading(false); // Ensure loading is turned off on error too
            });

    }, [typeFilter, locationFilter, searchFilter]);

    const getCombinedData = async () => {
        try {
            // Fetch posts data
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .eq("isVerified", true)
                .order("created_at", { ascending: false });

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
    const getMembers = async () => {
        const { error, data }: { error: any, data: any } = await supabase
            .from("members")
            .select("id, isVerified")
            .eq("isVerified", true)

        if (error) {
            return console.error(error);
        }
        setMembers(data);
    }
    //Fetching from netlify function:
    // const fetchData = async () => {
    //     try {
    //         // in the response is where you'd customise the data you want to fetch 
    //         // eg: returning certain members instead of all
    //         const response = await fetch('/.netlify/functions/getMembers');
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data from serverless function');
    //         }

    //         const data = await response.json();
    //         console.log('Data from serverless function:', data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error.message);
    //     }
    // };

    // fetchData();

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
    const deletePost = async (postId: string) => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq('postId', postId)
        if (error) {
            console.error(error);
        }
        getCombinedData()
    }
    const genNewSearchParams = (key: string, value: string) => {
        const sp = new URLSearchParams(searchParams)
        if (value === null) {
            sp.delete(key)
        } else {
            sp.set(key, value)
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
    }


    return (
        <>
            <div className=" max-w-7xl m-auto mb-10">
                {isMobile &&
                    <div className="flex justify-center px-4">
                        <FilterFields nearbyFilter={nearbyFilter} clearFilters={clearFilters} isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} register={register} genNewSearchParams={genNewSearchParams} typeFilter={typeFilter} businessType={businessType} searchFilter={searchFilter} locationFilter={locationFilter} setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} />
                    </div>
                }
                {!isMobile &&
                    <>
                        <div className="flex items-center ">
                            <div className="w-1/3 ml-11">
                                {/* <div className=" border-4 shadow-xl p-6 rounded flex flex-col items-center "> */}
                                <div className=" rounded flex flex-col items-center ">
                                    <h2 className=" text-5xl font-fira_sans" style={{ color: "#0097B2" }}>Hungry? Thirsty?</h2>
                                    <p className=" text-2xl leading-10 max-w-xs mt-3">If you want to know the best places to eat and drink...  <span className=" font-bold text-2xl" style={{ color: "#CF4342" }}> ask a local!</span></p>
                                </div>

                            </div>
                            {/* <div className="w-1/3">
                                <img src="images/cropped_logo.png" alt="" width={350} style={{ minHeight: "200px", minWidth: '200px' }} />
                            </div> */}
                            <div className="flex w-1/3 items-center justify-center">
                                <div className="flex flex-col">
                                    <p className="text-xl font-bold font-raleway" >Search Results:</p>
                                    <p className=" text-xl py-2 font-bold font-raleway" style={{ color: "#4e9da8" }}>{deliveryFilter || nearbyFilter || searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? filterPosts.length : posts.length} <span>Businesses</span></p>
                                </div>
                                {/* <div className="flex flex-col">
                                    <p className=" text-xl py-2 font-bold" style={{ color: "#4e9da8" }}>{members?.length} <span>Users</span></p>
                                </div> */}
                            </div>
                            <div className="w-1/3 flex justify-center">
                                <img src="images/cropped_logo.png" alt="" width={350} style={{ minHeight: "200px", minWidth: '200px' }} />
                            </div>
                            {/* <div className="w-1/3 items-center flex justify-center">
                                <Carousel />
                            </div> */}
                        </div>
                        <div className="flex gap-10 justify-center mt-10">
                            <div className="flex flex-col">
                                <div className=" mt-4 mb-4">
                                    <LocationSearch className="border-2 p-2 rounded" setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} types={['locality']} placeholder="Search by suburb" suburbAndPostcode={false} />
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
                            <div className="flex flex-col mt-4 dropdown-bottom w-72">
                                {/* <label> Select Type:</label> */}
                                <select
                                    {...register('type')}
                                    className=" border-2 p-3 rounded cursor-pointer"
                                    onChange={(e) => genNewSearchParams('type', e.target.value)}
                                    value={typeFilter || ""}
                                >
                                    <option value="all">Select Type of Business</option>
                                    {businessType.map(item => (
                                        <option
                                            key={item}
                                            value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col mt-4 dropdown-bottom w-64">
                                {/* <label htmlFor="">Select Delivery Method:</label> */}
                                <select
                                    name="deliveryMethod"
                                    className="border-2 p-3 rounded cursor-pointer"
                                    onChange={(e) => genNewSearchParams("deliveryMethod", e.target.value)}
                                    value={deliveryFilter || ""}
                                >
                                    <option value="all" selected>Select Delivery Method</option>
                                    <option value="delivery" >Delivery</option>
                                    <option value="dineIn" >Dine-In</option>
                                    <option value="pickUp" >Pick-Up</option>
                                </select>
                            </div>
                            <div className="flex flex-col mt-4">
                                {/* <label htmlFor="">Enter Search Term:</label> */}
                                <input type="text"
                                    className="border-2 p-3 rounded w-72"
                                    placeholder='General Search'
                                    {...register("search")}
                                    onChange={(e) => genNewSearchParams("search", e.target.value)}
                                    value={searchFilter || ""}
                                />
                            </div>
                        </div>
                        {/* </div> */}
                        <div className=" flex justify-center">
                            {deliveryFilter || nearbyFilter || searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? <button className="btn btn-md btn-error w-36" onClick={clearFilters}>Clear filters</button> : ""}
                        </div>
                        <div className="divider "></div>
                    </>
                }
                <p className={`${isMobile ? "px-7" : ""}`}>
                    {startIndex} - {endIndex} of {filterPosts.length} results
                </p>
                <div className={`flex ${isMobile ? 'flex-col ' : 'flex-wrap justify-start gap-4'} h-full`}>
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
                                <div key={item.postId} className="mt-10 flex justify-center">
                                    <Card {...item} onDelete={deletePost} />
                                </div>
                            ))
                        ) : isFilter ? (
                            <div className="my-6">
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

{/* <div className="flex flex-col mt-4 dropdown-bottom w-64">
                            <label htmlFor="">Select Delivery Method:</label>
                            <select
                                name="deliveryMethod"
                                className="select select-bordered"
                                onChange={(e) => genNewSearchParams("deliveryMethod", e.target.value)}
                                value={deliveryFilter || ""}
                            >
                                <option value="all" selected>All Methods</option>
                                <option value="delivery" >Delivery</option>
                                <option value="dineIn" >Dine-In</option>
                                <option value="pickUp" >Pick-Up</option>
                            </select>
                        </div> */}
{/* <div className="flex flex-col mt-4">
                            <label htmlFor="">Enter Search Term:</label>
                            <input type="text"
                                className="input input-bordered w-72"
                                placeholder='Beer'
                                {...register("search")}
                                onChange={(e) => genNewSearchParams("search", e.target.value)}
                                value={searchFilter || ""}
                            />
                        </div> */}
