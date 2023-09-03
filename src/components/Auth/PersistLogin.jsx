import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { apiRefreshToken } from "../../../API/auth";
import { useAuthStore } from "../../store";

function PersistLogin() {
    const token = useAuthStore((state) => state.token);
    const login = useAuthStore((state) => state.login);

    const [mounted, setMounted] = useState(false);

    // on component mount, request new access token - if successful, log in with said token
    useEffect(() => {
        async function refreshToken() {
            if (!token && localStorage.getItem("persist") === "true") {
                const response = await apiRefreshToken();

                if (response.status === 200) await login(response.data.access_token);
            }

            setMounted(true);
        }

        refreshToken();
    }, []);

    // on component unmount, set mounted to false
    useEffect(() => {
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return <Outlet />;
}

export default PersistLogin;
