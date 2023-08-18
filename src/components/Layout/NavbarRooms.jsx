import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import socket from "../../socket";

function NavbarRooms() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const navbarListener = (event, ...args) => {
            if (event == "updateRoom") updateRoom(args[0], args[1]);
            if (event == "removeRoom") removeRoom(args[0]);
            if (event == "createRoom") addRoom(args[0]);
        };

        // on any room event, update navbar rooms
        socket.onAny(navbarListener);

        return () => {
            socket.offAny(navbarListener);
        };
    }, []);

    useEffect(() => {
        async function getRooms() {
            const res = await fetchRooms();

            if (res.status === 200) setRooms(res.data.rooms);
        }

        getRooms();
    }, []);

    function updateRoom(id, name) {
        setRooms((rooms) => rooms.map((room) => (room._id === id ? { ...room, name } : room)));
    }

    function removeRoom(id) {
        setRooms((rooms) => rooms.filter((room) => room._id !== id));
    }

    function addRoom(room) {
        setRooms((rooms) => [room, ...rooms]);
    }

    return (
        <nav className="current-navbar">
            <NavLink to="/talk/rooms/new" className="current-navbar-heading-button">
                Create New Room
            </NavLink>
            <div className="current-navbar-list">
                {rooms.map((room) => (
                    <NavLink className="navbar-room-link" key={room._id} to={"/talk/rooms/" + room._id}>
                        {room.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}

export default NavbarRooms;
