import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../store";

function MainLayout() {
    const { user, logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout,
    }));

    return (
        <>
            {user && <h1>Welcome {user.name}</h1>}{" "}
            <aside>
                <button onClick={logout}>Logout</button>
            </aside>
            <Outlet />
        </>
    );
}

export default MainLayout;
