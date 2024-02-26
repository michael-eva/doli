// netlify-functions/getMembers.js
type Supabase = {
    supabaseUrl: string,
    supabaseKey: string
}
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_REACT_APP_SUPABASE_URL
const supabaseKey = process.env.VITE_REACT_APP_SUPABASE_ANON_KEY
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or key not provided");
}

const supabase = createClient<Supabase>(
    supabaseUrl,
    supabaseKey
)


exports.handler = async (event: any, context: any) => {
const queryParam = event.queryStringParameters.eq
const valueParam = event.queryStringParameters.value


    const { error, data } = await supabase
        .from("posts")
        .select("*")
        .eq(queryParam, valueParam)

    if (error) {
        return console.error(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};