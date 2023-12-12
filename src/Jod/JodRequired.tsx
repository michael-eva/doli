import supabase from "../config/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react"
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function jodRequired() {
    const user = useUser();
    const [isJod, setIsJod] = useState<boolean | null>(null);
    const [isJodDelayed, setIsJodDelayed] = useState<boolean>(false)

    useEffect(() => {
        let delayTimer: any
        const getMembers = async () => {
            const { data, error } = await supabase
                .from("members")
                .select("*")
                .eq('id', user?.id)
                .eq('isJod', true)
            if (error) {
                console.error("Error:", error);
            }
            if (data && data.length > 0) {
                setIsJod(true);
            }
        };
        if (user?.id) {
            delayTimer = setTimeout(() => {
                setIsJodDelayed(true)
            }, 1000)

            getMembers();
            return () => {
                clearTimeout(delayTimer)
            }
        }
    }, [user?.id]);
    if (isJodDelayed && isJod === null) {
        setIsJod(false)
        return <p>Loading data...</p>
    }
    if (isJod === null) {
        return
    }
    if (!isJod) {
        return (
            <Navigate to={"/login"}
                state={{ message: "Admin access only" }}
            />
        )
    }
    return <Outlet />

}
