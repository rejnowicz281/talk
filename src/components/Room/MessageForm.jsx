import PropTypes from "prop-types";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCreateMessage } from "../../../helpers/API";
import { useAuthStore } from "../../store/";
import FormErrors from "../shared/FormErrors";

function MessageForm({ addMessage }) {
    const user = useAuthStore((state) => state.user);
    const { id } = useParams();
    const [text, setText] = useState("");
    const [errors, setErrors] = useState([]);

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetchCreateMessage(id, text);

        if (res.status === 200) {
            const message = {
                ...res.data.message,
                user,
            };
            addMessage(message);
            setText("");
            setErrors([]);
        } else {
            setErrors(res.data.errors);
        }
    }

    return (
        <>
            {errors.length > 0 && <FormErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
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

MessageForm.propTypes = {
    addMessage: PropTypes.func.isRequired,
};

export default MessageForm;
