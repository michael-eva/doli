import { Navigate, Outlet } from "react-router";

export default function AuthRequired() {
    const token = localStorage.getItem("sb-yagpsuctumdlmcazzeuv-auth-token");
    if (!token) {
        return (
            <Navigate to={"/login"}
                state={{ message: "Please log in to continue" }}
            />)
    }

    return <Outlet />

}
