import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import { useAuthStore, useRoomsStore } from "../../store";
import CreateRoom from "../Room/Create";

function MainLayout() {
    const { user, logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout,
    }));

    const rooms = useRoomsStore((state) => state.rooms);
    const setRooms = useRoomsStore((state) => state.setRooms);

    useEffect(() => {
        async function getRooms() {
            const res = await fetchRooms();

            if (res.status === 200) setRooms(res.data.rooms);
        }

        getRooms();
    }, []);

    return (
        <>
            {user && (
                <h1>
                    Welcome, <Link to={"/talk/users/" + user.name}>{user.name}</Link>
                </h1>
            )}
            <aside>
                <button onClick={logout}>Logout</button>
                <CreateRoom />
                <ul>
                    {rooms.map((room) => (
                        <li key={room._id}>
                            <Link to={"/talk/rooms/" + room._id}>
                                {room.name} | Admin ({room.admin.username})
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <Outlet />
        </>
    );
}

export default MainLayout;
