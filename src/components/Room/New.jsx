import { useState } from "react";
import { fetchCreateRoom } from "../../../API/rooms";
import socket from "../../socket";
import css from "./styles/New.module.css";

function New() {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handleCreateRoom(e) {
        e.preventDefault();

        setLoading(true);
        const res = await fetchCreateRoom(name);
        setLoading(false);

        if (res.status === 200) {
            socket.emit("createRoom", res.data.room);
            setName("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }

    return (
        <div className={css.container}>
            {errors.length > 0 && (
                <div className={css.errors}>
                    {errors.map((error) => (
                        <li className={css.error} key={error.msg}>
                            {error.msg}
                        </li>
                    ))}
                </div>
            )}
            <form className={css.form} onSubmit={handleCreateRoom}>
                <input
                    className={css.input}
                    type="text"
                    value={name}
                    placeholder="New Room Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <button className={css.submit} type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Room"}
                </button>
            </form>
        </div>
    );
}

export default New;
