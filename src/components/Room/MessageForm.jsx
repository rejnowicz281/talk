import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCreateMessage } from "../../../helpers/API";
import socket from "../../socket";
import FormErrors from "../shared/FormErrors";

function MessageForm() {
    const { id } = useParams(); // room id
    const [text, setText] = useState("");
    const [photo, setPhoto] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetchCreateMessage(id, text, photo);

        if (res.status === 200) {
            socket.emit("addMessage", id, res.data.messageBody);
            setText("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }

    function cancelPhoto() {
        setPhoto(null);
        document.getElementById("photo").value = "";
    }

    return (
        <>
            {errors.length > 0 && <FormErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
                <label htmlFor="photo">Attach a photo (optional)</label>
                <input type="file" id="photo" onChange={(e) => setPhoto(e.target.files[0])} />
                {photo && (
                    <button type="button" onClick={cancelPhoto}>
                        Cancel Photo
                    </button>
                )}
                <input
                    type="text"
                    placeholder="Type your message here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </>
    );
}

export default MessageForm;
