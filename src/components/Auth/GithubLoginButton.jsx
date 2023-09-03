import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { fetchGithubToken } from "../../../API/auth";
import { GITHUB_AUTH_URL } from "../../../helpers/config";
import css from "./styles/GithubLoginButton.module.css";

function GithubLoginButton({ onSuccess }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        const codeParam = urlParams.get("code");

        if (codeParam) {
            setLoading(true);

            handleGithubLogin(codeParam);

            // remove code param from url
            urlParams.delete("code");

            const newUrl =
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?" +
                urlParams.toString();

            window.history.pushState({ path: newUrl }, "", newUrl);
        }
    }, []);

    async function handleGithubLogin(codeParam) {
        const tokenResponse = await fetchGithubToken(codeParam);

        if (tokenResponse.status == 200) {
            await onSuccess(tokenResponse);
        }

        setLoading(false);
    }

    return (
        <button
            className={css.button}
            disabled={loading}
            onClick={() => {
                setLoading(true);
                window.location.assign(GITHUB_AUTH_URL);
            }}
        >
            <BsGithub className={css.icon} />
            {loading ? "Logging in..." : "Login with Github"}
        </button>
    );
}

GithubLoginButton.propTypes = {
    onSuccess: PropTypes.func.isRequired,
};

export default GithubLoginButton;
