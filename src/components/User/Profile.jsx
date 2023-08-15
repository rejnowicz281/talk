import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchUserData } from "../../../helpers/API";
import socket from "../../socket";
import { useNavbarStore } from "../../store";

function Profile() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const removeNavbarRoom = useNavbarStore((state) => state.removeNavbarRoom);
    const updateNavbarRoom = useNavbarStore((state) => state.updateNavbarRoom);

    useEffect(() => {
        async function getUser() {
            const res = await fetchUserData(username);

            if (res.status === 200) setUser(res.data.user);
            else navigate("/talk");
        }

        socket.on("removeRoom", (roomId) => {
            removeNavbarRoom(roomId);
            removeChatterRoom(roomId);
        });
        socket.on("updateRoom", (roomId, newName) => {
            updateNavbarRoom(roomId, newName);
            updateChatterRoom(roomId, newName);
        });

        getUser();

        return () => {
            socket.off("removeRoom");
            socket.off("updateRoom");
        };
    }, [username]);

    function removeChatterRoom(roomId) {
        setUser((prev) => ({
            ...prev,
            chatterRooms: prev.chatterRooms.filter((room) => room._id !== roomId),
        }));
    }

    function updateChatterRoom(roomId, newName) {
        setUser((prev) => ({
            ...prev,
            chatterRooms: prev.chatterRooms.map((room) => {
                if (room._id === roomId) {
                    return {
                        ...room,
                        name: newName,
                    };
                }
                return room;
            }),
        }));
    }

    if (user) {
        return (
            <div>
                <h1>This is {username}'s Profile</h1>
                <h2>A chatter in:</h2>
                <ul>
                    {user.chatterRooms.map((room) => (
                        <li key={room._id}>
                            <Link to={"/talk/rooms/" + room._id}>
                                {room.name} | Admin ({room.admin.username})
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Profile;
