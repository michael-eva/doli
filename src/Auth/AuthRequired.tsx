import { Navigate, Outlet } from "react-router";

export default function AuthRequired() {

    const token = localStorage.getItem(import.meta.env.VITE_REACT_APP_LOGIN_TOKEN);
    if (!token) {
        return (
            <Navigate to={"/login"}
                state={{ message: "Please log in to continue" }}
            />)
    }

    return <Outlet />

}
