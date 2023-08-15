import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore, useRoomsStore } from "../../store";
import CreateRoom from "../Room/Create";

function MainLayout() {
    const { user, logout } = useAuthStore((state) => ({
        user: state.user,
        logout: state.logout,
    }));

    const rooms = useRoomsStore((state) => state.rooms);
    const setRooms = useRoomsStore((state) => state.setRooms);
    const removeRoom = useRoomsStore((state) => state.removeRoom);
    const addRoom = useRoomsStore((state) => state.addRoom);
    const updateRoom = useRoomsStore((state) => state.updateRoom);

    useEffect(() => {
        async function getRooms() {
            const res = await fetchRooms();

            if (res.status === 200) setRooms(res.data.rooms);
        }

        socket.on("testMessage", (message) => {
            console.log(message);
        });
        socket.on("removeRoom", (roomId) => {
            removeRoom(roomId);
        });
        socket.on("createRoom", (room) => {
            addRoom(room);
        });
        socket.on("updateRoom", (roomId, newName) => {
            updateRoom(roomId, newName);
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
