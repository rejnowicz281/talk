import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import socket from "../../socket";

function NavbarRooms() {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);

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
        setRooms((rooms) => [...rooms, room]);
    }

    return (
        <nav className="current-navbar">
            <h2 className="current-navbar-heading">Rooms</h2>
            <div className="current-navbar-list">
                {rooms.map((room) => (
                    <Link
                        className={`${activeRoom == room._id && "navbar-room-link-active"} navbar-room-link`}
                        onClick={() => setActiveRoom(room._id)}
                        key={room._id}
                        to={"/talk/rooms/" + room._id}
                    >
                        {room.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default NavbarRooms;
