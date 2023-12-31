import { Card } from "../components/Card";
import businessType from "../data/businessTypes.json"
import LocationSearch from "../components/LocationSearch";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import CardSkeleton from "../components/Loading/CardSkeleton";
import { useMediaQuery } from "react-responsive"
import FilterFields from "../components/Mobile/FilterFields";

type CardProps = {
    id: string,
    postId: string,
    imgUrl: string | null,
    name: string,
    suburb: string,
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
export default function Home() {
    const [isChecked, setIsChecked] = useState(true)
    const [posts, setPosts] = useState<CardProps[]>([])
    const [searchParams, setSearchParams] = useSearchParams()
    const typeFilter = searchParams.get("type")
    const deliveryFilter = searchParams.get("deliveryMethod")
    const searchFilter = searchParams.get("search")
    const { register, watch, getValues } = useForm()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const isMobile = useMediaQuery({ maxWidth: 640 });

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    useEffect(() => {
        setIsLoading(true); // Set loading to true when fetching data
        getPosts()
            .then(() => setIsLoading(false)) // Set loading to false once data is fetched
            .catch((error) => {
                console.error(error);
                setIsLoading(false); // Ensure loading is turned off on error too
            });

    }, [typeFilter, deliveryFilter, searchFilter]);
    const getPosts = async () => {
        const { error, data } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", true)

        if (error) {
            return console.error(error);
        }
        const parsedData = data.map((post) => ({
            ...post,
            selectedTags: JSON.parse(post.selectedTags).map((tag: any) => tag),
            openingHours: JSON.parse(post.openingHours).map((tag: any) => tag)
        }));

        setPosts(parsedData);
    }
    const deletePost = async (postId: string) => {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq('postId', postId)
        if (error) {
            console.error(error);
        }
        getPosts()
    }
    const genNewSearchParams = (key: string, value: string) => {
        const sp = new URLSearchParams(searchParams)
        if (value === null) {
            sp.delete(key)
        } else {
            sp.set(key, value)
        }
        setSearchParams(`?${sp.toString()}`)
    }
    // function LocationSearch() {

    //     useEffect(() => {
    //         const fetchData = async () => {
    //             const username = 'galactic_shark';
    //             const suburb = 'seven hills'; // Replace with the suburb you want to search for
    //             const countryCode = 'AU'; // Country code for Australia
    //             const maxRows = 20; // Maximum number of rows to retrieve

    //             const searchUrl = `http://api.geonames.org/postalCodeSearchJSON?placename=${encodeURIComponent(suburb)}&country=${countryCode}&maxRows=${maxRows}&username=${username}`;

    //             try {
    //                 const response = await fetch(searchUrl);
    //                 const responseData = await response.json();
    //                 console.log(responseData);

    //                 responseData.postalCodes.map(item => (
    //                     console.log(item.postalCode, item.adminCode1, item.placeName)

    //                 ));



    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //             }
    //         };

    //         fetchData();
    //     }, []);


    //     // Add your rendering logic here to display the fetched data
    // }
    // LocationSearch()


    const containsSearchText = (text: string, searchTerm: string) =>
        text.toLowerCase().includes(searchTerm.toLowerCase());

    const filterOrders = () => {
        let filterPosts = [...posts];

        if (typeFilter && typeFilter !== "all") {
            filterPosts = filterPosts.filter((post) => post.type === typeFilter);
        }

        if (deliveryFilter && deliveryFilter !== "all") {
            filterPosts = filterPosts.filter(
                (post) => post[deliveryFilter as keyof CardProps] === true
            );
        }

        if (searchFilter && searchFilter.trim() !== "") {
            const searchResults = filterPosts.filter((post) => {
                return Object.values(post).some((value) => {
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
            return searchResults;
        }

        return filterPosts;
    };

    const isFilter = () => {
        if (typeFilter || deliveryFilter || searchFilter) {
            return true
        }
        else return false
    }
    return (
        <>
            <FilterFields />
            <div className=" max-w-7xl m-auto">
                <div className="flex flex-wrap justify-between">
                    <div className="flex flex-col">
                        {/* <LocationSearch /> */}
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

                    <div className="flex flex-col mt-4 dropdown-bottom w-64">
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
                    <div className="flex flex-col mt-4 dropdown-bottom w-64">
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
                    </div>
                    <div className="flex flex-col mt-4">
                        <label htmlFor="">Enter Search Term:</label>
                        <input type="text"
                            className="input input-bordered w-72"
                            {...register("search")}
                            onChange={(e) => genNewSearchParams("search", e.target.value)}
                            value={searchFilter || ""}
                        />
                    </div>
                </div >
                <div className={`flex ${isMobile ? 'flex flex-col items-center' : 'flex-wrap justify-start gap-4'} h-full`}>
                    {isLoading ?
                        <>
                            {
                                Array.from({ length: 2 }, (_) => (
                                    <CardSkeleton />
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
            </div>
        </>
    );
}
