import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJoinRoom, fetchLeaveRoom } from "../../../helpers/API";
import { roomPropType } from "../../propTypes";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import UserBox from "../User/UserBox";
import AsyncButton from "../shared/AsyncButton";
import Delete from "./Delete";
import Update from "./Update";
import css from "./styles/SideBar.module.css";

function SideBar({ room, setRoom, isAdmin }) {
    const currentUser = useAuthStore((state) => state.currentUser);

    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        socket.on("removeChatter", (userId) => removeChatter(userId));
        socket.on("addChatter", (user) => addChatter(user));
        socket.on("removeRoom", (roomId) => {
            if (roomId === id) navigate("/talk");
        });
        socket.on("updateRoom", (roomId, newName) => {
            if (roomId === id) setRoomName(newName);
        });

        return () => {
            socket.off("removeChatter");
            socket.off("addChatter");
            socket.off("removeRoom");
            socket.off("updateRoom");
        };
    }, [id]);

    async function leaveRoom(userId) {
        const res = await fetchLeaveRoom(id, userId);

        if (res.status === 200) {
            socket.emit("removeChatter", id, userId);
        }
    }

    async function joinRoom() {
        const res = await fetchJoinRoom(id);

        if (res.status === 200) {
            socket.emit("addChatter", id, currentUser);
        }
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

    function setRoomName(name) {
        setRoom((room) => ({ ...room, name }));
    }

    function toggleSidebar() {
        setSidebarOpen((prev) => !prev);
    }

    return (
        <>
            <button onClick={toggleSidebar} className={css.toggle} type="button">
                <AiOutlineInfoCircle />
            </button>
            <div className={`${css.container} ${sidebarOpen ? css.open : ""}`}>
                <h1 className={css.heading}>{room.name}</h1>
                {isAdmin && (
                    <>
                        <Delete />
                        <Update setRoomName={setRoomName} />
                    </>
                )}
                {!isAdmin &&
                    (room.chatters.some((chatter) => chatter._id === currentUser._id) ? (
                        <AsyncButton
                            className={css.leave}
                            mainAction={() => leaveRoom(currentUser._id)}
                            content="Leave Room"
                            loadingContent="Leaving..."
                        />
                    ) : (
                        <AsyncButton
                            className={css.join}
                            mainAction={joinRoom}
                            content="Join Room"
                            loadingContent="Joining..."
                        />
                    ))}
                <div className={css.chatters}>
                    <h3>Chatters</h3>
                    {room.chatters.map((chatter) => (
                        <div className={css["chatter-container"]} key={chatter._id}>
                            <UserBox user={chatter} adminTag={chatter._id === room.admin} />
                            {isAdmin && chatter._id !== room.admin && (
                                <AsyncButton
                                    className={css.kick}
                                    mainAction={() => leaveRoom(chatter._id)}
                                    content="Kick"
                                    loadingContent="Kicking..."
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

SideBar.propTypes = {
    room: roomPropType.isRequired,
    setRoom: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
};

export default SideBar;
