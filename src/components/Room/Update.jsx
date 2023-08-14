import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchUpdateRoom } from "../../../helpers/API";
import { useRoomsStore } from "../../store";
import FormErrors from "../shared/FormErrors";

function Update({ setRoomName }) {
    const updateRoom = useRoomsStore((state) => state.updateRoom);
    const { id } = useParams();
    const [newName, setNewName] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleUpdateRoom(e) {
        e.preventDefault();

        const res = await fetchUpdateRoom(id, newName);

        if (res.status === 200) {
            updateRoom(id, newName);
            setRoomName(newName);
            setNewName("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }

    return (
        <>
            {errors.length > 0 && <FormErrors errors={errors} />}
            <form onSubmit={handleUpdateRoom}>
                <input
                    type="text"
                    value={newName}
                    placeholder="New Room Name"
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit">Update Room</button>
            </form>
        </>
    );
}

Update.propTypes = {
    setRoomName: PropTypes.func.isRequired,
};

export default Update;
