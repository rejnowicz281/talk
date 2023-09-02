import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDeleteMessage, fetchJoinRoom, fetchLeaveRoom, fetchRoom } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import UserBox from "../User/UserBox";
import Loading from "../shared/Loading";
import Delete from "./Delete";
import MessageForm from "./MessageForm";
import Update from "./Update";
import css from "./styles/Room.module.css";

function Room() {
    const currentUser = useAuthStore((state) => state.currentUser);

    const messagesRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [leavingRoom, setLeavingRoom] = useState(false);
    const [joiningRoom, setJoiningRoom] = useState(false);

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
                else setIsAdmin(false);

                setRoom(res.data.room);
            } else {
                navigate("/talk");
            }
        }

        getRoom();

        return () => {
            setIsAdmin(false);
            setRoom(null);
            setLeavingRoom(false);
            setJoiningRoom(false);
        };
    }, [id]);

    useEffect(() => {
        if (room && messagesRef.current) {
            const messagesDiv = messagesRef.current;
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
        setRoom((room) => ({ ...room, chatters: [...room.chatters, user] }));
    }

    async function leaveRoom(userId) {
        setLeavingRoom(true);
        const res = await fetchLeaveRoom(id, userId);

        if (res.status === 200) {
            socket.emit("removeChatter", id, userId);
            setLeavingRoom(false);
        }
    }

    async function joinRoom() {
        setJoiningRoom(true);
        const res = await fetchJoinRoom(id);

        if (res.status === 200) {
            socket.emit("addChatter", id, currentUser);
            setJoiningRoom(false);
        }
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
                                <button className={css["message-delete"]} onClick={() => deleteMessage(message._id)}>
                                    Delete Message
                                </button>
                            )}
                            <div className={css["message-content"]}>
                                <div>{message.text}</div>
                                {message.photo && <img src={message.photo.url} />}
                            </div>
                        </div>
                    ))}
                </div>
                {room.chatters.some((chatter) => chatter._id === currentUser._id) && (
                    <MessageForm addMessage={addMessage} />
                )}
            </div>
            <div className={css.sidebar}>
                <h1 className={css["sidebar-heading"]}>{room.name}</h1>
                {isAdmin && (
                    <>
                        <Delete />
                        <Update setRoomName={setRoomName} />
                    </>
                )}
                {!isAdmin &&
                    (room.chatters.some((chatter) => chatter._id === currentUser._id) ? (
                        <button disabled={leavingRoom} className={css.leave} onClick={() => leaveRoom(currentUser._id)}>
                            {leavingRoom ? "Leaving..." : "Leave Room"}
                        </button>
                    ) : (
                        <button disabled={joiningRoom} className={css.join} onClick={() => joinRoom()}>
                            {joiningRoom ? "Joining..." : "Join Room"}
                        </button>
                    ))}
                <div className={css.chatters}>
                    <h3>Chatters</h3>
                    {room.chatters.map((chatter) => (
                        <div className={css["chatter-container"]} key={chatter._id}>
                            <UserBox user={chatter} adminTag={chatter._id === room.admin} />
                            {isAdmin && chatter._id !== room.admin && (
                                <button className={css.kick} onClick={() => leaveRoom(chatter._id)}>
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

export default Room;
