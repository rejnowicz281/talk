import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function AsyncButton({ className, mainAction, content, loadingContent, type = "button" }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return () => {
            setLoading(false);
        };
    }, []);

    async function handleMainAction() {
        setLoading(true);
        await mainAction();
        setLoading(false);
    }

    return (
        <button className={className} type={type} onClick={handleMainAction} disabled={loading}>
            {loading ? loadingContent : content}
        </button>
    );
}

AsyncButton.propTypes = {
    className: PropTypes.string,
    mainAction: PropTypes.func.isRequired,
    type: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    loadingContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default AsyncButton;
