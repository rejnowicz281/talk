import { useParams } from "react-router-dom";
import { fetchDeleteRoom } from "../../../helpers/API";
import socket from "../../socket";

function Delete() {
    const { id } = useParams();

    async function handleDeleteRoom() {
        const res = await fetchDeleteRoom(id);

        if (res.status === 200) socket.emit("removeRoom", id);
    }
    return (
        <button className="room-delete-button room-sidebar-button" onClick={handleDeleteRoom}>
            Delete Room
        </button>
    );
}

export default Delete;
