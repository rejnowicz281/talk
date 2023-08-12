import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import isTokenExpired from "../../helpers/isTokenExpired";
import { useAuthStore } from "../store";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import AuthLayout from "./Layout/AuthLayout";
import MainLayout from "./Layout/MainLayout";
import Profile from "./User/Profile";

function App() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const setUserFromToken = useAuthStore((state) => state.setUserFromToken);
    const [tokenChecked, setTokenChecked] = useState(false);

    useEffect(() => {
        async function checkToken() {
            setTokenChecked(false);
            const token = localStorage.getItem("token");

            if (token) {
                const isExpired = isTokenExpired(token);

                if (isExpired) logout();
                else await setUserFromToken(token);
            }

            setTokenChecked(true);
        }

        checkToken();
    }, []);

    if (tokenChecked) {
        return (
            <BrowserRouter>
                <Routes>
                    {user ? (
                        <Route element={<MainLayout />}>
                            <Route path="/*" element={<Navigate to="/talk/home" />} />
                            <Route path="/talk/home" element={<div>Hello World</div>} />
                            <Route path="/talk/users/:username" element={<Profile />} />
                        </Route>
                    ) : (
                        <Route element={<AuthLayout />}>
                            <Route path="/*" element={<Navigate to="/talk/login" />} />
                            <Route path="/talk/login" element={<Login />} />
                            <Route path="/talk/register" element={<Register />} />
                        </Route>
                    )}
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
