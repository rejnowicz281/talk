import { useState } from "react";
import { fetchCreateRoom } from "../../../helpers/API";
import socket from "../../socket";
import FormErrors from "../shared/FormErrors";
import "./Room.css";

function New() {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleCreateRoom(e) {
        e.preventDefault();

        const res = await fetchCreateRoom(name);

        if (res.status === 200) {
            socket.emit("createRoom", res.data.room);
            setName("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }
    return (
        <div className="new-room-container">
            {errors.length > 0 && <FormErrors errors={errors} />}
            <form className="new-room-form" onSubmit={handleCreateRoom}>
                <input
                    className="new-room-input"
                    type="text"
                    value={name}
                    placeholder="New Room Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <button className="new-room-submit" type="submit">
                    Create Room
                </button>
            </form>
        </div>
    );
}

export default New;
