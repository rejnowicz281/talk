import { useState } from "react";
import { AiOutlineLoading, AiOutlineSend } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { fetchCreateMessage } from "../../../helpers/API";
import socket from "../../socket";
import ImagePicker from "../shared/ImagePicker";
import css from "./styles/MessageForm.module.css";

function MessageForm() {
    const { id } = useParams(); // room id
    const [text, setText] = useState("");
    const [photo, setPhoto] = useState("");
    const [errors, setErrors] = useState([]);
    const [sending, setSending] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setSending(true);
        const res = await fetchCreateMessage(id, text, photo);
        setSending(false);

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
        <form className={css.form} onSubmit={handleSubmit}>
            <label htmlFor="photo">Attach a photo (optional)</label>
            <div className={css["image-picker-wrapper"]}>
                <ImagePicker id="photo" setImage={setPhoto} />
            </div>
            <div className={css["input-box"]}>
                <input
                    placeholder="Type your message here..."
                    className={css.input}
                    type="text"
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className={css.submit} disabled={sending} type="submit">
                    {sending ? <AiOutlineLoading className="spin" /> : <AiOutlineSend />}
                </button>
            </div>
            {errors.length > 0 && (
                <div className={css.errors}>
                    {errors.map((error) => (
                        <div className={css.error} key={error.msg}>
                            {error.msg}
                        </div>
                    ))}
                </div>
            )}
        </form>
    );
}

export default MessageForm;
