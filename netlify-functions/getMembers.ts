// netlify-functions/getMembers.js
type Supabase = {
    supabaseUrl: string,
    supabaseKey: string
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://awkmxabdskcgxkzpqiru.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3a214YWJkc2tjZ3hrenBxaXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxMTA0NjgsImV4cCI6MjAyMjY4NjQ2OH0.Fdtj34QT4KSrdZmfH2FE49Y1jBx4rTKFwrDN1ddSFjM";

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or key not provided");
}

const supabase = createClient<Supabase>(
    supabaseUrl,
    supabaseKey
)


exports.handler = async (event: any, context: any) => {
    const { error, data } = await supabase
        .from("members")
        .select("*");
    console.log("Event:", event);

    if (error) {
        return console.error(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};

