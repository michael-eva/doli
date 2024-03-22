import supabase from "@/config/supabaseClient";
import { User } from "@supabase/supabase-js";

export async function updateLocationData(primaryLocation: { country: any; state: any; suburb: any; postcode: any; coordinates: any; }, secondaryLocation: { country: any; state: any; suburb: any; postcode: any; coordinates: any; }, user: User | null) {
    const { error } = await supabase
        .from("locations")
        .update({
            country: primaryLocation.country,
            altCountry: secondaryLocation.country,
            state: primaryLocation.state,
            altState: secondaryLocation.state,
            suburb: primaryLocation.suburb,
            postcode: primaryLocation.postcode,
            altSuburb: secondaryLocation ? secondaryLocation.suburb : null,
            altPostcode: secondaryLocation.postcode,
            formatted_address: `${primaryLocation.suburb} ${primaryLocation.state}, ${primaryLocation.country}`,
            altFormatted_address: secondaryLocation.suburb ? `${secondaryLocation.suburb} ${secondaryLocation.state}, ${secondaryLocation.country}` : null,
            coordinates: primaryLocation.coordinates,
            altCoordinates: secondaryLocation.coordinates

        })
        .eq('userId', user?.id)
        .single()

    if (error) {
        console.error("Error updating location:", error);
    }
}
