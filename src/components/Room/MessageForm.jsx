import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCreateMessage } from "../../../helpers/API";
import socket from "../../socket";
import FormErrors from "../shared/FormErrors";
import ImagePicker from "../shared/PhotoPicker";

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

    return (
        <form onSubmit={handleSubmit}>
            <input
                className="room-message-input"
                type="text"
                placeholder="Type your message here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {errors.length > 0 && <FormErrors errors={errors} />}
            <button className="send-message-button" type="submit">
                Send
            </button>
            <label htmlFor="photo">Attach a photo (optional)</label>
            <ImagePicker id="photo" setImage={setPhoto} />
        </form>
    );
}

export default MessageForm;
