import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { apiAuth } from "../../API";
import { apiRefreshToken } from "../../API/auth";
import { useAuthStore } from "../store";
import Login from "./Auth/Login";
import PersistLogin from "./Auth/PersistLogin";
import Register from "./Auth/Register";
import MainLayout from "./MainLayout/MainLayout";
import NewRoom from "./Room/New";
import Room from "./Room/Room";
import Profile from "./User/Profile";

function App() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const token = useAuthStore((state) => state.token);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    // Set up axios interceptors
    useEffect(() => {
        const requestInterceptor = apiAuth.interceptors.request.use(
            (config) => {
                if (token) config.headers["Authorization"] = "Bearer " + token;

                return config;
            },
            (error) => {
                Promise.reject(error);
            }
        );

        const responseInterceptor = apiAuth.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if ((error?.response?.status === 403 || error?.response?.status === 401) && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const response = await apiRefreshToken();
                    if (response.status === 200) {
                        // refresh token is still valid, retry the request with the new access token
                        prevRequest.headers["Authorization"] = "Bearer " + response.data.access_token;
                        await login(response.data.access_token);
                        return apiAuth(prevRequest);
                    } else {
                        // refresh token is invalid, log out
                        logout();
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            apiAuth.interceptors.request.eject(requestInterceptor);
            apiAuth.interceptors.response.eject(responseInterceptor);
        };
    }, [token]);

    return (
        <HashRouter>
            <Routes>
                {currentUser && token ? (
                    <Route element={<MainLayout />}>
                        <Route path="/*" element={<Navigate to="/talk/rooms/new" />} />
                        <Route path="/talk/users/:username" element={<Profile />} />
                        <Route path="/talk/rooms/:id" element={<Room />} />
                        <Route path="/talk/rooms/new" element={<NewRoom />} />
                    </Route>
                ) : (
                    <Route element={<PersistLogin />}>
                        <Route path="/*" element={<Navigate to="/talk/login" />} />
                        <Route path="/talk/login" element={<Login />} />
                        <Route path="/talk/register" element={<Register />} />
                    </Route>
                )}
            </Routes>
        </HashRouter>
    );
}

export default App;
