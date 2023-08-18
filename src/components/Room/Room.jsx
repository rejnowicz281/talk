import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeleteMessage, fetchJoinRoom, fetchLeaveRoom, fetchRoom } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import UserBox from "../User/UserBox";
import Delete from "./Delete";
import MessageForm from "./MessageForm";
import Update from "./Update";

function Room() {
    const currentUser = useAuthStore((state) => state.currentUser);

    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        socket.emit("joinRoom", id);
        socket.on("addMessage", (message) => addMessage(message));
        socket.on("removeMessage", (messageId) => removeMessage(messageId));
        socket.on("removeChatter", (userId) => removeChatter(userId));
        socket.on("addChatter", (user) => addChatter(user));
        socket.on("removeRoom", (roomId) => {
            if (roomId === id) navigate("/talk");
        });
        socket.on("updateRoom", (roomId, newName) => {
            if (roomId === id) setRoomName(newName);
        });

        return () => {
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

    useEffect(() => {
        async function getRoom() {
            const res = await fetchRoom(id);

            if (res.status === 200) {
                if (currentUser._id == res.data.room.admin) setIsAdmin(true);

                setRoom(res.data.room);
            } else {
                navigate("/talk");
            }
        }

        getRoom();

        return () => {
            setIsAdmin(false);
        };
    }, [id]);

    useEffect(() => {
        if (room) {
            const messagesDiv = document.querySelector(".room-messages");
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }, [room]);

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

        if (res.status === 200) socket.emit("addChatter", id, currentUser);
    }

    async function deleteMessage(messageId) {
        const res = await fetchDeleteMessage(id, messageId);

        if (res.status === 200) socket.emit("removeMessage", id, messageId);
    }

    if (room) {
        return (
            <div className="room-container">
                <div className="room-message-section">
                    <div className="room-messages">
                        {room.messages.map((message) => (
                            <div className="room-message" key={message._id}>
                                <UserBox user={message.user} />
                                {(isAdmin || message.user._id === currentUser._id) && (
                                    <button
                                        className="text-rosy message-delete-button"
                                        onClick={() => deleteMessage(message._id)}
                                    >
                                        Delete Message
                                    </button>
                                )}
                                <div className="room-message-content">
                                    <div className="room-message-text">{message.text} </div>
                                    {message.photo && <img src={message.photo.url} />}
                                </div>
                            </div>
                        ))}
                    </div>
                    {room.chatters.some((chatter) => chatter._id === currentUser._id) && (
                        <MessageForm addMessage={addMessage} />
                    )}
                </div>
                <div className="room-sidebar">
                    <h1>{room.name}</h1>
                    {isAdmin && (
                        <>
                            <Delete />
                            <Update setRoomName={setRoomName} />
                        </>
                    )}
                    {!isAdmin &&
                        (room.chatters.some((chatter) => chatter._id === currentUser._id) ? (
                            <button
                                className="room-sidebar-button leave-room-button"
                                onClick={() => leaveRoom(currentUser._id)}
                            >
                                Leave Room
                            </button>
                        ) : (
                            <button className="room-sidebar-button join-room-button" onClick={() => joinRoom()}>
                                Join Room
                            </button>
                        ))}
                    <div className="room-sidebar-chatters">
                        <h3>Chatters</h3>
                        {room.chatters.map((chatter) => (
                            <div className="room-chatter-box" key={chatter._id}>
                                <UserBox user={chatter} adminTag={chatter._id === room.admin} />
                                {isAdmin && chatter._id !== room.admin && (
                                    <button className="kick-chatter-button" onClick={() => leaveRoom(chatter._id)}>
                                        Kick
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Room;
