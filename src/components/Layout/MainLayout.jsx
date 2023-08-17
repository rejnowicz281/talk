import { useEffect, useState } from "react";
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
    const [loggedUsers, setLoggedUsers] = useState([]);

    const navbarRooms = useNavbarStore((state) => state.navbarRooms);
    const setNavbarRooms = useNavbarStore((state) => state.setNavbarRooms);
    const removeNavbarRoom = useNavbarStore((state) => state.removeNavbarRoom);
    const addNavbarRoom = useNavbarStore((state) => state.addNavbarRoom);
    const updateNavbarRoom = useNavbarStore((state) => state.updateNavbarRoom);

    // Initial socket config for all components under MainLayout
    useEffect(() => {
        socket.on("testMessage", (message) => {
            console.log(message);
        });
        socket.on("updateLoggedUsers", (users) => {
            setLoggedUsers(users);
        });

        const navbarListener = (event, ...args) => {
            if (event == "updateRoom") updateNavbarRoom(args[0], args[1]);
            if (event == "removeRoom") removeNavbarRoom(args[0]);
            if (event == "createRoom") addNavbarRoom(args[0]);
        };

        // on any room event, update navbarRooms
        socket.onAny(navbarListener);

        return () => {
            socket.off("testMessage");
            socket.off("updateLoggedUsers");
            socket.offAny(navbarListener);
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
                <h2>Active users:</h2>
                <ul>
                    {loggedUsers.map((user) => (
                        <li key={user._id}>
                            <UserBox user={user} />
                        </li>
                    ))}
                </ul>
                <h2>Rooms:</h2>
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
