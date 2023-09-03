import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchUserData } from "../../../API/users";
import socket from "../../socket";
import Loading from "../shared/Loading";
import UserBox from "./UserBox";
import css from "./styles/Profile.module.css";

function Profile() {
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

    if (!user) return <Loading />;

    return (
        <div className={css.container}>
            <div className={css["user-wrapper"]}>
                <UserBox user={user} />
            </div>
            <h1 className={css.heading}>Chatter Rooms</h1>
            <div className={css["room-list"]}>
                {user.chatterRooms.map((room) => (
                    <Link key={room._id} className={css["room-link"]} to={"/talk/rooms/" + room._id}>
                        <div className={css["room-link-name"]}>{room.name}</div>{" "}
                        {room.admin == user._id && <div className={css["room-link-admin"]}>Admin</div>}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Profile;
