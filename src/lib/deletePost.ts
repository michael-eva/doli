import supabase from "@/config/supabaseClient";
import { fetchCombinedData } from "@/pages/Home/utils/fetchCombinedData";

export async function deletePost(postId: string) {
    try {
        const { error } = await supabase
            .from("posts")
            .delete()
            .eq('postId', postId)
        if (error) {
            throw new Error("Error deleting post:" + error.message)
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error
    }
}
