import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore, useNavbarStore } from "../../store";
import CreateRoom from "../Room/Create";
import UserBox from "../User/UserBox";

function MainLayout() {
    const { currentUser, logout } = useAuthStore((state) => ({
        currentUser: state.currentUser,
        logout: state.logout,
    }));

    const navbarRooms = useNavbarStore((state) => state.navbarRooms);
    const setNavbarRooms = useNavbarStore((state) => state.setNavbarRooms);
    const removeNavbarRoom = useNavbarStore((state) => state.removeNavbarRoom);
    const addNavbarRoom = useNavbarStore((state) => state.addNavbarRoom);
    const updateNavbarRoom = useNavbarStore((state) => state.updateNavbarRoom);

    // Initial socket config for all components - can be overwritten in each component
    useEffect(() => {
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

        return () => {
            socket.off("testMessage");
            socket.off("removeRoom");
            socket.off("createRoom");
            socket.off("updateRoom");
        };
    }, []);

    useEffect(() => {
        async function getRooms() {
            const res = await fetchRooms();

            if (res.status === 200) setNavbarRooms(res.data.rooms);
        }

        getRooms();
    }, []);

    function testMessage() {
        socket.emit("testMessage", "Client: Test Message");
    }

    return (
        <>
            <button onClick={testMessage}>Click to broadcast a socket message!</button>
            {currentUser && (
                <h1>
                    Welcome, <UserBox user={currentUser} />
                </h1>
            )}
            <aside>
                <button onClick={logout}>Logout</button>
                <CreateRoom />
                <ul>
                    {navbarRooms.map((room) => (
                        <li key={room._id}>
                            <Link to={"/talk/rooms/" + room._id}>{room.name}</Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <Outlet />
        </>
    );
}

export default MainLayout;
