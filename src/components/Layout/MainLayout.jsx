import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import UserBox from "../User/UserBox";
import "./Layout.css";
import NavbarLogout from "./NavbarLogout";
import NavbarRooms from "./NavbarRooms";
import NavbarUsers from "./NavbarUsers";

function MainLayout() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const [loggedUsers, setLoggedUsers] = useState([]);
    const [currentNavbar, setCurrentNavbar] = useState("rooms");

    useEffect(() => {
        socket.on("updateLoggedUsers", (users) => {
            setLoggedUsers(users);
        });

        return () => {
            socket.off("updateLoggedUsers");
        };
    }, []);

    return (
        <div className="main-container">
            <aside className="main-sidebar">
                <div className="text-center">
                    <UserBox user={currentUser} />
                </div>
                <div className="main-sidebar-buttons">
                    <button
                        id={currentNavbar == "rooms" && "active-navbar-button"}
                        onClick={() => setCurrentNavbar("rooms")}
                        type="button"
                    >
                        Rooms
                    </button>
                    <button
                        id={currentNavbar == "users" && "active-navbar-button"}
                        onClick={() => setCurrentNavbar("users")}
                        type="button"
                    >
                        Active Users ({loggedUsers.length})
                    </button>
                    <button
                        id={currentNavbar == "logout" && "active-navbar-button"}
                        onClick={() => setCurrentNavbar("logout")}
                        type="button"
                        className="logout-button"
                    >
                        Logout
                    </button>
                </div>
                {currentNavbar === "rooms" ? (
                    <NavbarRooms />
                ) : currentNavbar === "users" ? (
                    <NavbarUsers loggedUsers={loggedUsers} />
                ) : (
                    <NavbarLogout />
                )}
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
