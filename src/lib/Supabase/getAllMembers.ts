import supabase from "@/config/supabaseClient";
import { useEffect, useState } from "react";
import { MemberType } from "@/Types";

export function useSupabase(select: string){
    const [allMembers, setAllMembers] = useState<MemberType[]>()

    async function getAllMembers(){
        const { data, error } = await supabase
            .from("members")
            .select(select)
    
        if (error) {
            console.error(error);
        }
        if (data) {
        setAllMembers(data)
        }
    }

    useEffect(()=>{
        getAllMembers()
    },[])

    return {allMembers}
}