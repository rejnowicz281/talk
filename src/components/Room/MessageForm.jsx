import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCreateMessage } from "../../../helpers/API";
import socket from "../../socket";
import FormErrors from "../shared/FormErrors";
import ImagePicker from "../shared/ImagePicker";
import css from "./styles/MessageForm.module.css";

function MessageForm() {
    const { id } = useParams(); // room id
    const [text, setText] = useState("");
    const [photo, setPhoto] = useState("");
    const [errors, setErrors] = useState([]);
    const [sending, setSending] = useState(false);

    async function handleSubmit(e) {
        setSending(true);
        e.preventDefault();

        const res = await fetchCreateMessage(id, text, photo);

        if (res.status === 200) {
            socket.emit("addMessage", id, res.data.messageBody);
            setText("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
        setSending(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                className={css.input}
                type="text"
                placeholder="Type your message here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            {errors.length > 0 && <FormErrors errors={errors} />}
            <button className={css.submit} disabled={sending} type="submit">
                {sending ? "Sending..." : "Send"}
            </button>
            <label htmlFor="photo">Attach a photo (optional)</label>
            <ImagePicker id="photo" setImage={setPhoto} />
        </form>
    );
}

export default MessageForm;
