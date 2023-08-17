import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchRooms } from "../../../helpers/API";
import socket from "../../socket";
import { useNavbarStore } from "../../store";

function NavbarRooms() {
    const navbarRooms = useNavbarStore((state) => state.navbarRooms);
    const setNavbarRooms = useNavbarStore((state) => state.setNavbarRooms);
    const removeNavbarRoom = useNavbarStore((state) => state.removeNavbarRoom);
    const addNavbarRoom = useNavbarStore((state) => state.addNavbarRoom);
    const updateNavbarRoom = useNavbarStore((state) => state.updateNavbarRoom);

    useEffect(() => {
        const navbarListener = (event, ...args) => {
            if (event == "updateRoom") updateNavbarRoom(args[0], args[1]);
            if (event == "removeRoom") removeNavbarRoom(args[0]);
            if (event == "createRoom") addNavbarRoom(args[0]);
        };

        // on any room event, update navbarRooms
        socket.onAny(navbarListener);

        return () => {
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

    return (
        <div>
            <h2>Rooms:</h2>
            <ul>
                {navbarRooms.map((room) => (
                    <li key={room._id}>
                        <Link to={"/talk/rooms/" + room._id}>{room.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NavbarRooms;
