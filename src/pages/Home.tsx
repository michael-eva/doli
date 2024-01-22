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

type CardProps = {
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
}
type LocationData = {
    address: string,
    postcode: string,
    locality: string,
    state: string,
    country: string
}
export default function Home() {
    const [isChecked, setIsChecked] = useState(true)
    const [posts, setPosts] = useState<CardProps[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const typeFilter = searchParams.get("type")
    // const deliveryFilter = searchParams.get("deliveryMethod")
    const searchFilter = searchParams.get("search")
    const locationFilter = searchParams.get("location")
    const { register, watch, getValues } = useForm()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isMobile = useMediaQuery({ maxWidth: 640 });
    const [members, setMembers] = useState('')
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 8
    const [selectedLocation, setSelectedLocation] = useState<LocationData>({
        address: "",
        postcode: "",
        locality: "",
        state: "",
        country: ""
    })
    const [inputClear, setInputClear] = useState<boolean>(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    useEffect(() => {
        setIsLoading(true); // Set loading to true when fetching data
        getMembers()
        // getLocations()
        // getPosts()
        getCombinedData()
            .then(() => setIsLoading(false)) // Set loading to false once data is fetched
            .catch((error) => {
                console.error(error);
                setIsLoading(false); // Ensure loading is turned off on error too
            });

    }, [typeFilter, locationFilter, searchFilter]);


    // const getPosts = async () => {
    //     const { error, data } = await supabase
    //         .from("posts")
    //         .select("*")
    //         .eq("isVerified", true)

    //     if (error) {
    //         return console.error(error);
    //     }
    //     const parsedData = data.map((post) => ({
    //         ...post,
    //         selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
    //         openingHours: JSON.parse(post.openingHours).map((tag: any) => tag)
    //     }));

    //     setPosts(parsedData);
    // }
    // const getLocations = async () => {
    //     const { data, error } = await supabase
    //         .from("locations")
    //         .select("*")
    //     if (error) {
    //         console.error("Error retrieving locations", error);

    //     }
    //     if (data) {
    //         // setPosts(prevPost => ({ ...prevPost, ...data}));
    //         console.log(data);

    //     }

    // }
    const getCombinedData = async () => {
        try {
            // Fetch posts data
            const { data: postsData, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .eq("isVerified", true);

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
    // console.log(posts);

    const getMembers = async () => {
        const { error, data }: any = await supabase
            .from("members")
            .select("*")

        if (error) {
            return console.error(error);
        }
        setMembers(data);
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

    const containsSearchText = (text: string, searchTerm: string) =>
        text.toLowerCase().includes(searchTerm.toLowerCase());

    const filterOrders = () => {
        let filterPosts = [...posts];

        if (typeFilter && typeFilter !== "all") {
            filterPosts = filterPosts.filter((post) => post.type === typeFilter);
        }

        if (locationFilter) {
            const lowercaseLocationFilter = locationFilter.toLowerCase();
            filterPosts = filterPosts.filter((post) => {
                const lowercaseSuburb = post?.locationData?.postcode?.toLowerCase();
                return lowercaseSuburb && lowercaseSuburb.includes(lowercaseLocationFilter);
            });
        }


        if (searchFilter && searchFilter.trim() !== "") {
            filterPosts = filterPosts.filter((post) => {
                const columnsToSearch = ["description", "selectedTags", "type", "state", "suburb", "name"];

                return columnsToSearch.some((column) => {
                    const value = post[column];

                    if (Array.isArray(value)) {
                        return value.some(
                            (tag: any) =>
                                typeof tag.label === "string" &&
                                containsSearchText(tag.label, searchFilter)
                        );
                    }

                    return typeof value === "string" && containsSearchText(value, searchFilter);
                });
            });
        }

        return paginatePage(currentPage, pageSize, filterPosts);
    };

    const paginatePage = (currentPage, pageSize, filterPosts) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatePage = filterPosts.slice(startIndex, endIndex);
        return paginatePage;
    };



    console.log("Filter orders", filterOrders());

    const isFilter = () => {
        if (typeFilter || searchFilter) {
            return true
        }
        else return false
    }
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const searchItemLength = () => {
        if (searchFilter || (typeFilter && typeFilter !== "all") || locationFilter) {
            return filterOrders().length
        }
        return posts.length
    }
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, searchItemLength());
    const handleLocationSelect = (address: string, postcode: string, locality: string, state: string, country: string) => {
        setSelectedLocation({
            address: address,
            postcode: postcode,
            locality: locality,
            state: state,
            country: country
        });
        genNewSearchParams('location', postcode)
    };
    const clearFilters = () => {
        setSearchParams("")
        setInputClear(true)
    }


    return (
        <>
            <div className=" max-w-7xl m-auto mb-10">
                {isMobile &&
                    <div className="flex justify-center">
                        <FilterFields register={register} genNewSearchParams={genNewSearchParams} typeFilter={typeFilter} businessType={businessType} searchFilter={searchFilter} locationFilter={locationFilter} />
                    </div>
                }
                {!isMobile &&
                    <div className="flex">
                        <div className="w-1/3">
                            <img src="images/doli_logo.PNG" alt="" width={300} style={{ minHeight: "200px", minWidth: '200px' }} height={300} />
                        </div>
                        <div className="flex w-2/3">
                            <div className="flex flex-col justify-around">
                                <div className="flex gap-10">
                                    <div className="flex flex-col">
                                        <div className=" mt-4">
                                            <label htmlFor="">Suburb</label>
                                            <LocationSearch setInputClear={setInputClear} inputClear={inputClear} onSelect={handleLocationSelect} types={['locality']} placeholder="Start typing in a suburb" />
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
                                        <label> Select Type:</label>
                                        <select
                                            {...register('type')}
                                            className="select select-bordered"
                                            onChange={(e) => genNewSearchParams('type', e.target.value)}
                                            value={typeFilter || ""}
                                        >
                                            <option value="all" selected>All Types</option>
                                            {businessType.map(item => (
                                                <option
                                                    key={item}
                                                    value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? <button className="btn btn-sm btn-error w-36 m-auto" onClick={clearFilters}>Clear filters</button> : ""}
                                <div className="divider "></div>
                                <div className="flex justify-center gap-10">
                                    <div className="flex flex-col w-72">
                                        <p className="text-xl" >Search Results:</p>
                                        <p className=" text-xl py-2" style={{ color: "#4e9da8" }}>{searchFilter || (typeFilter && typeFilter !== "all") || locationFilter ? filterOrders().length : posts.length} <span>Businesses</span></p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-xl" >Active Members:</p>
                                        <p className=" text-xl py-2" style={{ color: "#4e9da8" }}>{members.length} <span>Users</span></p>
                                    </div>
                                </div>
                            </div>

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
                        </div >
                    </div>}
                <p>
                    {startIndex} - {endIndex} of {searchItemLength()} results
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
                        filterOrders()?.length > 0 ? (
                            filterOrders().map((item: CardProps) => (
                                <div key={item.postId} className="mt-10">
                                    <Card {...item} onDelete={deletePost} />
                                </div>
                            ))
                        ) : isFilter() ? (
                            <div className="my-6">
                                <p className="text-3xl font-thin">Sorry, no results found.</p>
                                <p className="text-2xl font-thin">Please try a different search criteria.</p>
                            </div>
                        ) : null}
                </div>
                {searchItemLength() > 2 && <Pagination totalItems={searchItemLength()} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} />}
            </div>
        </>
    );
}
