import { useNavigate, useParams } from "react-router-dom";
import { fetchDeleteRoom } from "../../../helpers/API";
import { useRoomsStore } from "../../store";

function Delete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const removeRoom = useRoomsStore((state) => state.removeRoom);

    async function handleDeleteRoom() {
        const res = await fetchDeleteRoom(id);

        if (res.status === 200) {
            removeRoom(id);
            navigate("/talk");
        }
    }
    return <button onClick={handleDeleteRoom}>Delete Room</button>;
}

export default Delete;
