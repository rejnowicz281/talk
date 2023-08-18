import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchUserData } from "../../../helpers/API";
import socket from "../../socket";
import UserBox from "./UserBox";

function Profile() {
    const navigate = useNavigate();
    const { username } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        socket.on("createRoom", (room) => {
            addChatterRoom(room);
        });
        socket.on("removeRoom", (roomId) => {
            removeChatterRoom(roomId);
        });
        socket.on("updateRoom", (roomId, newName) => {
            updateChatterRoom(roomId, newName);
        });

        return () => {
            socket.off("removeRoom");
            socket.off("updateRoom");
            socket.off("createRoom");
        };
    }, []);

    useEffect(() => {
        async function getUser() {
            const res = await fetchUserData(username);

            if (res.status === 200) setUser(res.data.user);
            else navigate("/talk");
        }

        getUser();
    }, [username]);

    function addChatterRoom(room) {
        setUser((prev) => ({
            ...prev,
            chatterRooms: [room, ...prev.chatterRooms],
        }));
    }

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
            <div className="profile-container">
                <div className="text-center">
                    <UserBox user={user} />
                </div>
                <h1 className="profile-heading">Chatter Rooms</h1>
                <div className="profile-chatter-room-list">
                    {user.chatterRooms.map((room) => (
                        <Link key={room._id} className="profile-chatter-room-link" to={"/talk/rooms/" + room._id}>
                            <div className="profile-chatter-room-link-name">{room.name}</div>{" "}
                            {room.admin == user._id && <div className="profile-chatter-room-link-admin">Admin</div>}
                        </Link>
                    ))}
                </div>
            </div>
        );
    }
}

export default Profile;
