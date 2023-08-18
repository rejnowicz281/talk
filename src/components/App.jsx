import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import isTokenExpired from "../../helpers/isTokenExpired";
import { useAuthStore } from "../store";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import AuthLayout from "./Layout/AuthLayout";
import MainLayout from "./Layout/MainLayout";
import NewRoom from "./Room/New";
import Room from "./Room/Room";
import Profile from "./User/Profile";

function App() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const logout = useAuthStore((state) => state.logout);
    const loginWithToken = useAuthStore((state) => state.loginWithToken);
    const [tokenChecked, setTokenChecked] = useState(false);

    useEffect(() => {
        async function checkToken() {
            setTokenChecked(false);
            const token = localStorage.getItem("token");

            if (token) {
                const isExpired = isTokenExpired(token);

                if (isExpired) logout();
                else await loginWithToken(token);
            }

            setTokenChecked(true);
        }

        checkToken();
    }, []);

    if (tokenChecked) {
        return (
            <HashRouter>
                <Routes>
                    {currentUser ? (
                        <Route element={<MainLayout />}>
                            <Route path="/*" element={<Navigate to="/talk/rooms/new" />} />
                            <Route path="/talk/users/:username" element={<Profile />} />
                            <Route path="/talk/rooms/:id" element={<Room />} />
                            <Route path="/talk/rooms/new" element={<NewRoom />} />
                        </Route>
                    ) : (
                        <Route element={<AuthLayout />}>
                            <Route path="/*" element={<Navigate to="/talk/login" />} />
                            <Route path="/talk/login" element={<Login />} />
                            <Route path="/talk/register" element={<Register />} />
                        </Route>
                    )}
                </Routes>
            </HashRouter>
        );
    }
}

export default App;
