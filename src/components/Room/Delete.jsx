import { useParams } from "react-router-dom";
import { fetchDeleteRoom } from "../../../API/rooms";
import socket from "../../socket";
import AsyncButton from "../shared/AsyncButton";
import css from "./styles/Delete.module.css";

function Delete() {
    const { id } = useParams();

    async function handleDeleteRoom() {
        const res = await fetchDeleteRoom(id);

        if (res.status === 200) socket.emit("removeRoom", id);
    }
    return (
        <AsyncButton
            className={css.button}
            mainAction={handleDeleteRoom}
            content="Delete Room"
            loadingContent="Deleting..."
        />
    );
}

export default Delete;
