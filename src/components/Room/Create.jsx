import { useState } from "react";
import { fetchCreateRoom } from "../../../helpers/API";
import socket from "../../socket";
import { useAuthStore } from "../../store";
import FormErrors from "../shared/FormErrors";

function Create() {
    const currentUser = useAuthStore((state) => state.currentUser);
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleCreateRoom(e) {
        e.preventDefault();

        const res = await fetchCreateRoom(name);

        if (res.status === 200) {
            const room = {
                _id: res.data.room._id,
                name: res.data.room.name,
                admin: {
                    _id: currentUser._id,
                    username: currentUser.username,
                },
            };
            socket.emit("createRoom", room);
            setName("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }
    return (
        <>
            {errors.length > 0 && <FormErrors errors={errors} />}
            <form onSubmit={handleCreateRoom}>
                <input type="text" value={name} placeholder="New Room Name" onChange={(e) => setName(e.target.value)} />
                <button type="submit">Create Room</button>
            </form>
        </>
    );
}

export default Create;
