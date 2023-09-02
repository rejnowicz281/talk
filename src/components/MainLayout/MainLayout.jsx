import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import socket from "../../socket";
import { useMainSidebarStore } from "../../store";
import Loading from "../shared/Loading";
import SideBar from "./SideBar";
import css from "./styles/MainLayout.module.css";

function MainLayout() {
    const closeMainSidebar = useMainSidebarStore((state) => state.closeMainSidebar);

    const [socketLoaded, setSocketLoaded] = useState(socket.connected);
    const navigate = useNavigate();

    useEffect(() => {
        closeMainSidebar(); // Close main sidebar when navigating to a new page
    }, [navigate]);

    useEffect(() => {
        // Set the initial socketLoaded state to the current socket connection status
        setSocketLoaded(socket.connected);

        // If the socket connects, make sure the socketLoaded state is set to true
        socket.on("connect", () => {
            console.log("Connected to socket");
            setSocketLoaded(true);
        });

        // If the socket fails to connect, make sure the socketLoaded state is set to false
        socket.on("connect_error", (err) => {
            console.log("Socket connection error", err);
            setSocketLoaded(false);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from socket");
            setSocketLoaded(false);
        });

        return () => {
            socket.off("connect");
            socket.off("connect_error");
            socket.off("disconnect");
        };
    }, [socketLoaded]);

    if (!socketLoaded) {
        return (
            <div className={css["loading-container"]}>
                <Loading text="Connecting to socket..." />
            </div>
        );
    }

    return (
        <div className={css.container}>
            <SideBar />
            <main className={css.main}>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
