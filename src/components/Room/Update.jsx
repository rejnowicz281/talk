import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUpdateRoom } from "../../../helpers/API";
import socket from "../../socket";
import css from "./styles/Update.module.css";

function Update() {
    const { id } = useParams();
    const [newName, setNewName] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleUpdateRoom(e) {
        e.preventDefault();

        const res = await fetchUpdateRoom(id, newName);

        if (res.status === 200) {
            socket.emit("updateRoom", id, newName);
            setNewName("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }

    return (
        <form onSubmit={handleUpdateRoom}>
            <input
                className={css.input}
                type="text"
                value={newName}
                placeholder="New Room Name"
                onChange={(e) => setNewName(e.target.value)}
            />
            {errors.length > 0 && (
                <div className={css.errors}>
                    {errors.map((error) => (
                        <div className={css.error} key={error.msg}>
                            {error.msg}
                        </div>
                    ))}
                </div>
            )}
            <button className={css.submit} type="submit">
                Update Room
            </button>
        </form>
    );
}

Update.propTypes = {
    setRoomName: PropTypes.func.isRequired,
};

export default Update;
