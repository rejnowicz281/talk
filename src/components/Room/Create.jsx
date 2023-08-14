import { useState } from "react";
import { fetchCreateRoom } from "../../../helpers/API";
import FormErrors from "../shared/FormErrors";

function Create() {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleCreateRoom(e) {
        e.preventDefault();

        const res = await fetchCreateRoom(name);

        if (res.status === 200) {
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