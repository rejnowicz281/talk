import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMainSidebarStore } from "../../store";
import SideBar from "./SideBar";
import css from "./styles/MainLayout.module.css";

function MainLayout() {
    const closeMainSidebar = useMainSidebarStore((state) => state.closeMainSidebar);
    const navigate = useNavigate();

    useEffect(() => {
        closeMainSidebar(); // Close main sidebar when navigating to a new page
    }, [navigate]);

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
