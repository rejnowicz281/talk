import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import UserBox from "../User/UserBox";
import "./Layout.css";
import NavbarRooms from "./NavbarRooms";
import NavbarUsers from "./NavbarUsers";

function MainLayout() {
    const { currentUser, logout } = useAuthStore((state) => ({
        currentUser: state.currentUser,
        logout: state.logout,
    }));
    const [loggedUsers, setLoggedUsers] = useState([]);
    const [currentNavbar, setCurrentNavbar] = useState("rooms");

    useEffect(() => {
        socket.on("testMessage", (message) => {
            console.log(message);
        });
        socket.on("updateLoggedUsers", (users) => {
            setLoggedUsers(users);
        });

        return () => {
            socket.off("testMessage");
            socket.off("updateLoggedUsers");
        };
    }, []);

    function testMessage() {
        socket.emit("testMessage", "Client: Test Message");
    }

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
                    <button type="button" className="logout-button" onClick={logout}>
                        Logout
                    </button>
                </div>
                {currentNavbar === "rooms" ? <NavbarRooms /> : <NavbarUsers loggedUsers={loggedUsers} />}
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
