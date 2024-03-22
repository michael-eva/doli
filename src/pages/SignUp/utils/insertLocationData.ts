import supabase from "@/config/supabaseClient";

export async function insertLocationData(response: { data: any; error?: null }, primaryLocation: { suburb: any; state: any; country: any; postcode: any; coordinates: any; }, secondaryLocation: { suburb: any; state: any; country: any; postcode: any; coordinates: any; }) {
    const { error } = await supabase
        .from("locations")
        .insert({
            userId: response?.data?.user?.id,
            formatted_address: `${primaryLocation.suburb} ${primaryLocation.state}, ${primaryLocation.country}`,
            altFormatted_address: `${secondaryLocation.suburb} ${secondaryLocation.state}, ${secondaryLocation.country}`,
            country: primaryLocation.country,
            altCountry: secondaryLocation.country,
            state: primaryLocation.state,
            altState: secondaryLocation.state,
            suburb: primaryLocation.suburb,
            altSuburb: secondaryLocation ? secondaryLocation.suburb : null,
            postcode: primaryLocation.postcode,
            altPostcode: secondaryLocation.postcode,
            coordinates: primaryLocation.coordinates,
            altCoordinates: secondaryLocation.coordinates
        })
        .single()
    if (error) {
        console.error("Error setting location data:", error);

    }
}