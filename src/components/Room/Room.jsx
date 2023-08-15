import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDeleteMessage, fetchJoinRoom, fetchLeaveRoom, fetchRoom } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore, useNavbarStore } from "../../store";
import Delete from "./Delete";
import MessageForm from "./MessageForm";
import Update from "./Update";

function Room() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [room, setRoom] = useState(null);
    const removeNavbarRoom = useNavbarStore((state) => state.removeNavbarRoom);
    const updateNavbarRoom = useNavbarStore((state) => state.updateNavbarRoom);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        async function getRoom() {
            const res = await fetchRoom(id);

            if (res.status === 200) {
                if (user._id == res.data.room.admin._id) setIsAdmin(true);

                setRoom(res.data.room);
            } else {
                navigate("/talk");
            }
        }

        socket.emit("joinRoom", id);
        socket.on("addMessage", (message) => addMessage(message));
        socket.on("removeMessage", (messageId) => removeMessage(messageId));
        socket.on("removeChatter", (userId) => removeChatter(userId));
        socket.on("addChatter", (user) => addChatter(user));
        socket.on("removeRoom", (roomId) => {
            if (roomId === id) navigate("/talk");
            removeNavbarRoom(roomId);
        });
        socket.on("updateRoom", (roomId, newName) => {
            if (roomId === id) setRoomName(newName);
            updateNavbarRoom(roomId, newName);
        });

        getRoom();

        return () => {
            setIsAdmin(false);
            socket.off("addMessage");
            socket.off("removeMessage");
            socket.off("removeChatter");
            socket.off("becomeChatter");
            socket.off("addChatter");
            socket.off("removeRoom");
            socket.off("updateRoom");
            socket.emit("leaveRoom", id);
        };
    }, [id]);

    function setRoomName(name) {
        setRoom((room) => ({ ...room, name }));
    }

    function addMessage(message) {
        setRoom((room) => ({ ...room, messages: [...room.messages, message] }));
    }

    function removeMessage(messageId) {
        setRoom((room) => ({
            ...room,
            messages: room.messages.filter((message) => message._id !== messageId),
        }));
    }

    function removeChatter(userId) {
        setRoom((room) => ({
            ...room,
            chatters: room.chatters.filter((chatter) => chatter._id !== userId),
        }));
    }

    function addChatter(user) {
        setRoom((room) => ({
            ...room,
            chatters: [...room.chatters, user],
        }));
    }

    async function leaveRoom(userId) {
        const res = await fetchLeaveRoom(id, userId);

        if (res.status === 200) socket.emit("removeChatter", id, userId);
    }

    async function joinRoom() {
        const res = await fetchJoinRoom(id);

        if (res.status === 200) socket.emit("addChatter", id, user);
    }

    async function deleteMessage(messageId) {
        const res = await fetchDeleteMessage(id, messageId);

        if (res.status === 200) socket.emit("removeMessage", id, messageId);
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
                {room.chatters.some((chatter) => chatter._id === user._id) && <MessageForm addMessage={addMessage} />}
                <ul>
                    {room.messages.map((message) => (
                        <li key={message._id}>
                            <Link to={"/talk/users/" + message.user.username}>{message.user.username}</Link>:{" "}
                            {message.text}
                            {(isAdmin || message.user._id === user._id) && (
                                <button onClick={() => deleteMessage(message._id)}>Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Room;
