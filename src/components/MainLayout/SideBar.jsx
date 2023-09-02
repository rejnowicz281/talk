import { useEffect, useState } from "react";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import socket from "../../socket";
import { useAuthStore, useMainSidebarStore } from "../../store";
import UserBox from "../User/UserBox";
import NavbarLogout from "./NavbarLogout";
import NavbarRooms from "./NavbarRooms";
import NavbarUsers from "./NavbarUsers";
import css from "./styles/SideBar.module.css";

function SideBar() {
    const sidebarOpen = useMainSidebarStore((state) => state.mainSidebarOpen);
    const toggleSidebar = useMainSidebarStore((state) => state.toggleMainSidebar);

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
        <>
            <button onClick={toggleSidebar} className={css.toggle} type="button">
                <HiMiniBars3BottomLeft />
            </button>
            <aside className={`${css.container} ${sidebarOpen ? css.open : ""}`}>
                <div className={css["current-user-wrapper"]}>
                    <UserBox user={currentUser} />
                </div>
                <div className={css.buttons}>
                    <button
                        id={currentNavbar == "rooms" ? css["active-button"] : undefined}
                        onClick={() => setCurrentNavbar("rooms")}
                        type="button"
                    >
                        Rooms
                    </button>
                    <button
                        id={currentNavbar == "users" ? css["active-button"] : undefined}
                        onClick={() => setCurrentNavbar("users")}
                        type="button"
                    >
                        Active Users ({loggedUsers.length})
                    </button>
                    <button
                        id={currentNavbar == "logout" ? css["active-button"] : undefined}
                        onClick={() => setCurrentNavbar("logout")}
                        type="button"
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
        </>
    );
}

export default SideBar;
