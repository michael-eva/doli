import supabase from "@/config/supabaseClient";

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