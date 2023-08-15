import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore, useNavbarStore } from "../../store";
import CreateRoom from "../Room/Create";

function MainLayout() {
    const { user, logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout,
    }));

    const navbarRooms = useNavbarStore((state) => state.navbarRooms);
    const setNavbarRooms = useNavbarStore((state) => state.setNavbarRooms);
    const removeNavbarRoom = useNavbarStore((state) => state.removeNavbarRoom);
    const addNavbarRoom = useNavbarStore((state) => state.addNavbarRoom);
    const updateNavbarRoom = useNavbarStore((state) => state.updateNavbarRoom);

    useEffect(() => {
        async function getRooms() {
            const res = await fetchRooms();

            if (res.status === 200) setNavbarRooms(res.data.rooms);
        }

        // Initial socket config for all components - can be overwritten in each component
        socket.on("testMessage", (message) => {
            console.log(message);
        });
        socket.on("removeRoom", (roomId) => {
            removeNavbarRoom(roomId);
        });
        socket.on("createRoom", (room) => {
            addNavbarRoom(room);
        });
        socket.on("updateRoom", (roomId, newName) => {
            updateNavbarRoom(roomId, newName);
        });

        getRooms();

        return () => {
            socket.off("testMessage");
            socket.off("removeRoom");
            socket.off("createRoom");
            socket.off("updateRoom");
        };
    }, []);

    function testMessage() {
        socket.emit("testMessage", "Client: Test Message");
    }

    return (
        <>
            <button onClick={testMessage}>Click to broadcast a socket message!</button>
            {user && (
                <h1>
                    Welcome, <Link to={"/talk/users/" + user.username}>{user.username}</Link>
                </h1>
            )}
            <aside>
                <button onClick={logout}>Logout</button>
                <CreateRoom />
                <ul>
                    {navbarRooms.map((room) => (
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
