import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import css from "./styles/MainLayout.module.css";

function MainLayout() {
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
