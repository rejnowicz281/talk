import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDeleteMessage, fetchRoom } from "../../../API/rooms";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import UserBox from "../User/UserBox";
import AsyncButton from "../shared/AsyncButton";
import Loading from "../shared/Loading";
import MessageForm from "./MessageForm";
import SideBar from "./SideBar";
import css from "./styles/Room.module.css";

function Room() {
    const currentUser = useAuthStore((state) => state.currentUser);

    const messagesRef = useRef(null);
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        socket.emit("joinRoom", id);
        socket.on("addMessage", (message) => addMessage(message));
        socket.on("removeMessage", (messageId) => removeMessage(messageId));

        return () => {
            socket.off("addMessage");
            socket.off("removeMessage");
            socket.emit("leaveRoom", id);
        };
    }, [id]);

    useEffect(() => {
        getRoom();

        return () => {
            setIsAdmin(false);
            setRoom(null);
        };
    }, [id]);

    useEffect(() => {
        if (room && messagesRef.current) {
            const messagesDiv = messagesRef.current;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }, [room]);

    async function getRoom(retry = 0) {
        if (retry > 10) return setRoom(null);

        const res = await fetchRoom(id);

        if (res.status === 200) {
            if (currentUser._id == res.data.room.admin) setIsAdmin(true);
            else setIsAdmin(false);

            setRoom(res.data.room);
        } else getRoom(retry + 1);
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

    async function deleteMessage(messageId) {
        const res = await fetchDeleteMessage(id, messageId);

        if (res.status === 200) {
            socket.emit("removeMessage", id, messageId);
        }
    }

    if (!room) return <Loading />;

    return (
        <div className={css.container}>
            <div className={css.main}>
                <div className={css.messages} ref={messagesRef}>
                    {room.messages.map((message) => (
                        <div className={css.message} key={message._id}>
                            <UserBox user={message.user} />
                            {(isAdmin || message.user._id === currentUser._id) && (
                                <AsyncButton
                                    className={css["message-delete"]}
                                    mainAction={() => deleteMessage(message._id)}
                                    content="Delete Message"
                                    loadingContent="Deleting..."
                                />
                            )}
                            <div className={css["message-content"]}>
                                <div>{message.text}</div>
                                {message.photo && <img className={css["message-photo"]} src={message.photo.url} />}
                            </div>
                        </div>
                    ))}
                </div>
                {room.chatters.some((chatter) => chatter._id === currentUser._id) && (
                    <MessageForm addMessage={addMessage} />
                )}
            </div>
            <SideBar room={room} setRoom={setRoom} isAdmin={isAdmin} />
        </div>
    );
}

export default Room;
