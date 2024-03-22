import supabase from "@/config/supabaseClient";

export async function getMemberEmail(select:string, email:string){
    const { data, error } = await supabase
        .from("members")
        .select(select)
        .eq("email", email)

    if (error) {
        console.error(error);
    }
    if (data) {
    return data
    }
}
