import { SignUpType } from "../Types";
import supabase from "../config/supabaseClient";

const processedEmails = new Set<string>();
function getCoordinates(latitude, longitude) {
    const coordinates = { latitude, longitude }
    const coordinatesJson = JSON.stringify(coordinates, null, 2)
    const coordinatesEl = JSON.parse(coordinatesJson)
    return coordinatesEl
}

const signUpAndInsertData = async (userData: SignUpType) => {
    try {
        // Check if the user already exists
        const { data: user, error } = await supabase
            .from('members')
            .select('*')
            .eq('email', userData.email)
            .single()

        if (error) {
            console.error('Error checking user existence:', error.message);
            // return null;
        }

        // If user already exists, return the user data
        if (user) {
            console.log('User already exists');
            return user;
        }

        // If user does not exist, sign up the user
        const signUpResponse = await supabase.auth.signUp({
            email: userData.email,
            password: "doli4TheWin",
        });
        return signUpResponse;
    } catch (error: any) {
        console.error('Error:', error.message);
        return null;
    }
};


const insertLocationData = async (response: { data: any; error?: null }, userData: any) => {
    console.log("Inserting location data:", userData);

    const { error, data } = await supabase
        .from("locations")
        .select("*")
        .eq("userId", response.data.user.id)
        .single()

    if (error) {
        console.error("Error checking location data:", error);
    }

    // If a location entry does not exist for the user, insert a new one
    if (!data) {
        const coordinatesEl = getCoordinates(userData.latitude, userData.longitude)
        const altCoordinates = getCoordinates(userData.altLatitude, userData.altLongitude)

        const { error: insertError } = await supabase
            .from("locations")
            .insert({
                userId: response.data.user.id,
                formatted_address: userData.formatted_address,
                altFormatted_address: userData.altFormatted_address,
                country: userData.country,
                altCountry: userData.altCountry,
                state: userData.state,
                altState: userData.altState,
                suburb: userData.suburb,
                altSuburb: userData.altSuburb,
                postcode: userData.postcode,
                altPostcode: userData.altPostcode,
                coordinates: coordinatesEl,
                altCoordinates: altCoordinates
            })
            .single()


        if (insertError) {
            console.error("Error setting location data:", insertError);
        } else {
            console.log("Inserted new location data for user:", response.data.user.id);
        }
    } else {
        console.log("Location entry already exists for user:", response.data.user.id);
    }
}


const handleNewSubmit = async (data: SignUpType, userData) => {
    const response = await signUpAndInsertData(data);
    if (response && !response.error) {
        supabase
            .from("members")
            .insert({
                id: response?.data?.user?.id,
                gender: data.gender,
                email: data.email,
                birthMonth: data.birthMonth,
                birthYear: data.birthYear,
                isJod: false,
                isVerified: false,
            })
            .single()
            .then(
                ({ error }) => {
                    if (error) {
                        console.log(error)
                    }
                },
            )
        insertLocationData(response, userData)
    };
    console.log("handle new submit - check");
}

async function processUserData(userData) {
    const { Email, Gender, altSuburb, suburb, birthMonth, birthYear, country } = userData;

    if (!processedEmails.has(Email)) {
        const signUpData = {
            email: Email,
            gender: Gender,
            password: "doli4TheWin",
            confirmPassword: "doli4TheWin",
            suburb: "test suburb",
            birthMonth: birthMonth,
            birthYear: birthYear,
            altSuburb: altSuburb,
            country: country,

        };
        console.log("process user data - check");

        await handleNewSubmit(signUpData, userData);
        processedEmails.add(Email);
    }
}

async function processUserArray(userDataArray) {
    for (const userData of userDataArray) {
        await processUserData(userData);
    }
}

export { processUserArray };
