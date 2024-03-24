import supabase from "@/config/supabaseClient";
import { useEffect, useState } from "react";
import { CardProps, MemberType } from "@/Types";

export function useSupabase(select: string){
    const [allMembers, setAllMembers] = useState<MemberType[]>()
    const [allPosts, setAllPosts] = useState<CardProps[]>()

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
    async function getAllPosts(){
        const { data, error } = await supabase
            .from("posts")
            .select(select)
    
        if (error) {
            console.error(error);
        }
        if (data) {
        setAllPosts(data)
        }
    }

    useEffect(()=>{
        getAllMembers()
    },[])

    return {allMembers, getAllPosts, getAllMembers}
}