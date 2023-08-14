import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRoom } from "../../../helpers/API";
import { useAuthStore } from "../../store";
import Delete from "./Delete";
import Update from "./Update";

function Room() {
    const { id } = useParams();
    const user = useAuthStore((state) => state.user);
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    function setRoomName(name) {
        setRoom((room) => ({ ...room, name }));
    }

    useEffect(() => {
        async function getRoom() {
            const res = await fetchRoom(id);

            if (res.status === 200) {
                if (user.id == res.data.room.admin._id) setIsAdmin(true);

                setRoom(res.data.room);
            }
        }

        getRoom();
    }, [id]);

    if (room) {
        return (
            <div>
                <h1>{room.name}</h1>
                <h2>
                    Admin: <Link to={"/talk/users/" + room.admin.username}>{room.admin.username}</Link>
                </h2>
                {isAdmin && <Delete />}
                {isAdmin && <Update setRoomName={setRoomName} />}
                <h3>Chatters</h3>
                <ul>
                    {room.chatters.map((chatter) => (
                        <li key={chatter._id}>
                            <Link to={"/talk/users/" + chatter.username}>{chatter.username}</Link>
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
