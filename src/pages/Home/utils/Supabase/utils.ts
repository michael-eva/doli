import { isCoordinateWithinRadius } from "@/components/Location/locationHelpers";
import supabase from "@/config/supabaseClient";

export async function getVerifiedPosts(homeScreenPosts: number) {
    try {
        const { error, data: verifiedPosts } = await supabase
            .from("posts")
            .select("*")
            .eq("isVerified", true)
            .order("updated_at", { ascending: false })
            .range(0,homeScreenPosts-1)

        if (error) {
            throw new Error("Error fetching verified posts: " + error.message);
        }

        if (verifiedPosts) {
            return verifiedPosts;
        } else {
            throw new Error("No verified posts fetched.");
        }
    } catch (error) {
        console.error("Error fetching verified posts:", error);
        throw error; // Propagate the error
    }
}
export async function getFilteredData(homeScreenPosts: number, decodedTypeFilter: string, decodedSearchFilter: string, deliveryFilter: string){
let query = supabase.from("posts").select("*").order("updated_at", { ascending: false }).range(0,homeScreenPosts-1).eq('isVerified', true)

if (decodedTypeFilter){
    query = query.eq("type", decodedTypeFilter)    
}
if (deliveryFilter === "dineIn") {
    query = query.eq("dineIn", true)
}
if (deliveryFilter === "delivery") {
    query = query.eq("delivery", true)
}
if (deliveryFilter === "pickUp") {
    query = query.eq("pickUp", true)
}

if (decodedSearchFilter && decodedSearchFilter.trim() !== '') {
    query = query.ilike('name', `%${decodedSearchFilter}%`)
}

  
try {
    const {data, error} = await query
    if (data) {
        return data
    }
    if (error) {
        console.log(error);
        
    }
} catch (error) {
    console.log(error);
    
}
}
export async function getLocationData(postIdArr: string[]) {
    try {
        const { error, data: locationData } = await supabase
            .from("locations")
            .select("*")
            .in("postId", postIdArr)

        if (error) {
            throw new Error("Error fetching location data: " + error.message);
        }

        if (locationData) {
            return locationData;
        } else {
            throw new Error("No location data fetched.");
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        throw error; // Propagate the error
    }
}

export async function getPostLength(){
    try {
        const {error, data} = await supabase
        .from("posts")
        .select("postId")
        .eq("isVerified", true)
        if (error) {
            throw new Error("Error fetching verified posts: " + error.message);
        }

        if (data) {
            return data.length;
        } else {
            throw new Error("No verified posts fetched.");
        }

    } catch (error) {
        console.error("Error fetching verified posts:", error);
        throw error; // Propagate the error
    }
}
async function getPostsByCoordinates(decodedLocationFilter: string) {
    try {
        const { error, data } = await supabase
            .from("locations")
            .select("coordinates, postId")
            .not('postId', 'is', null)
            .not('postId', 'eq', "");

        if (error) {
            throw new Error("No location data fetched");
        }

        if (data) {
            const [latitude, longitude] = decodedLocationFilter.split('+');
            const filteredLocation = data.filter((post) => {
                const target = { latitude: post.coordinates?.latitude, longitude: post.coordinates?.longitude };
                const center = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
                return isCoordinateWithinRadius(target, center, 5000);
            });

            const postIdArr = filteredLocation.map((item) => item.postId);
            return postIdArr;
        }
    } catch (error) {
        throw error;
    }
}

async function getPostsById(postIdArr: string[]) {
    try {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .in("postId", postIdArr);

        if (error) {
            throw new Error("No post Id fetched");
        }

        if (data) {
            return data;
        }
    } catch (error) {
        throw error;
    }
}

async function filterByLocation(decodedLocationFilter: string) {
    const postIdArr = await getPostsByCoordinates(decodedLocationFilter);
    const locationData = await getLocationData(postIdArr);
    const verifiedPosts = await getPostsById(postIdArr);
    return { locationData, verifiedPosts };
}

async function filterByOtherFilters(homeScreenPosts: number, decodedTypeFilter: string, decodedSearchFilter: string, deliveryFilter: string) {
    const verifiedPosts = await getFilteredData(homeScreenPosts, decodedTypeFilter, decodedSearchFilter, deliveryFilter);
    const postIdArr = verifiedPosts?.map((item) => item.postId);
    const locationData = await getLocationData(postIdArr);
    return { locationData, verifiedPosts };
}

export async function fetchCombinedData(homeScreenPosts: string, decodedTypeFilter: string, deliveryFilter: string, decodedSearchFilter: string, decodedLocationFilter: string) {
    try {
        const { verifiedPosts, locationData } = decodedLocationFilter ? await filterByLocation(decodedLocationFilter) : await filterByOtherFilters(homeScreenPosts, decodedTypeFilter, decodedSearchFilter, deliveryFilter);
console.log(verifiedPosts);

        const parsedPostsData = verifiedPosts?.map((post) => ({
            ...post,
            selectedTags: JSON.parse(post.selectedTags),
            openingHours: JSON.parse(post.openingHours),
        }));

        const mergedData = parsedPostsData?.map((post) => ({
            ...post,
            locationData: locationData.find((location) => location.postId === post.postId),
        }));

        return mergedData;
    } catch (error) {
        console.error("Error fetching verified posts:", error);
        throw error;
    }
}
