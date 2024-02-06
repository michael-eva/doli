import { nanoid } from "nanoid";
import supabase from "../config/supabaseClient";
import { LocationData } from "../Types";

async function insertLocationData(locationData: LocationData, newPostId: string) {
    let uuid = self.crypto.randomUUID();
    const { error } = await supabase
        .from("locations")
        .insert({
            formatted_address: locationData.formatted_address,
            postId: newPostId,
            country: locationData.country,
            state: locationData.state,
            suburb: locationData.suburb,
            streetAddress: locationData.streetAddress,
            postcode: locationData.postcode,
            coordinates: locationData.coordinates,
            locationId: uuid
        });

    if (error) {
        console.error(error);
    }
}

async function getLocationData(postId: string) {
    const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("postId", postId);

    if (error) {
        console.error(error);
    }

    return data;
}

async function deleteOldLocationData(postId: string) {
    const { error } = await supabase
        .from("locations")
        .delete()
        .eq('postId', postId);

    if (error) {
        console.error(error);
    }
}

export async function RetrieveOwner(email: string | undefined, user: any) {
    const newPostId = nanoid()
    const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq('hasOwner', false)
        .eq('email', email)
        .single();

    if (postsError) {
        if (postsError.code === 'PGRST116') {
            return
        }
        console.error("Error fetching posts data:", postsError);
        return;
    }

    if (!postsData) {
        console.log("no results");
        return;
    }

    //insert new post
    const { error: insertError } = await supabase
        .from("posts")
        .insert({
            ...postsData,
            id: user?.id,
            postId: newPostId,
            hasOwner: true,
            adminEmail: null
        });

    if (insertError) {
        console.error("Error updating post details:", insertError);
        return;
    }
    //get old location data
    const locationData = await getLocationData(postsData.postId);
    if (locationData) {
        await insertLocationData(locationData[0], newPostId);
        await deleteOldLocationData(postsData.postId);
    }

    const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("postId", postsData.postId);

    if (deleteError) {
        console.error("Error deleting old row:", deleteError);
    }
}
