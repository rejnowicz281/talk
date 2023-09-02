import { useState } from "react";
import { fetchCreateRoom } from "../../../helpers/API";
import socket from "../../socket";
import FormErrors from "../shared/FormErrors";
import css from "./styles/New.module.css";

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
        <div className={css.container}>
            {errors.length > 0 && <FormErrors errors={errors} />}
            <form className={css.form} onSubmit={handleCreateRoom}>
                <input
                    className={css.input}
                    type="text"
                    value={name}
                    placeholder="New Room Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <button className={css.submit} type="submit">
                    Create Room
                </button>
            </form>
        </div>
    );
}

export default New;
