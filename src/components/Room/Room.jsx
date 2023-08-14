import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJoinRoom, fetchLeaveRoom, fetchRoom } from "../../../helpers/API";
import { useAuthStore } from "../../store";
import Delete from "./Delete";
import Update from "./Update";

function Room() {
    const { id } = useParams();
    const user = useAuthStore((state) => state.user);
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function getRoom() {
            const res = await fetchRoom(id);

            if (res.status === 200) {
                if (user._id == res.data.room.admin._id) setIsAdmin(true);

                setRoom(res.data.room);
            }
        }

        getRoom();

        return () => {
            setIsAdmin(false);
        };
    }, [id]);

    function setRoomName(name) {
        setRoom((room) => ({ ...room, name }));
    }

    async function leaveRoom(userId) {
        const res = await fetchLeaveRoom(id, userId);

        if (res.status === 200) {
            setRoom((room) => ({
                ...room,
                chatters: room.chatters.filter((chatter) => chatter._id !== userId),
            }));
        }
    }

    async function joinRoom() {
        const res = await fetchJoinRoom(id);

        if (res.status === 200) {
            setRoom((room) => ({
                ...room,
                chatters: [...room.chatters, user],
            }));
        }
    }

    if (room) {
        return (
            <div>
                <h1>{room.name}</h1>
                <h2>
                    Admin: <Link to={"/talk/users/" + room.admin.username}>{room.admin.username}</Link>
                </h2>
                {isAdmin && <Delete />}
                {isAdmin && <Update setRoomName={setRoomName} />}
                {!isAdmin &&
                    (room.chatters.some((chatter) => chatter._id === user._id) ? (
                        <button onClick={() => leaveRoom(user._id)}>Leave Room</button>
                    ) : (
                        <button onClick={() => joinRoom()}>Join Room</button>
                    ))}
                <h3>Chatters</h3>
                <ul>
                    {room.chatters.map((chatter) => (
                        <li key={chatter._id}>
                            <Link to={"/talk/users/" + chatter.username}>{chatter.username}</Link>
                            {isAdmin && chatter._id !== room.admin._id && (
                                <button onClick={() => leaveRoom(chatter._id)}>Kick</button>
                            )}
                        </li>
                    ))}
                </ul>
                <hr />
                <ul>
                    {room.messages.map((message) => (
                        <li key={message._id}>
                            <Link to={"/talk/users/" + message.user.username}>{message.user.username}</Link>:{" "}
                            {message.text}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Room;
