import supabase from "@/config/supabaseClient";
export function transformMonthlyCountsToArray (monthlyCounts: any) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const transformedData = [];
    for (const key in monthlyCounts) {
        if (monthlyCounts.hasOwnProperty(key)) {
            const [month, year] = key.split("-");
            transformedData.push({ name: months[parseInt(month) - 1], count: monthlyCounts[key] });
        }
    }
    return transformedData;
}

export async function rejectPost(postId: string){
    try {
        const { error } = await supabase
            .from("posts")
            .update({ isVerified: false, isRejected: true })
            .eq("postId", postId);
        if (error) {
            console.error("Error updating post:", error);
            return false
        } else {
return true
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export async function validatePost(postId: string){
    try {
        const { error } = await supabase
            .from("posts")
            .update({ isVerified: true, isRejected: false })
            .eq("postId", postId);
        if (error) {
            console.error("Error updating post:", error);
            return false
        } else {
            return true
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


