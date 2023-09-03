import { useState } from "react";
import { Link } from "react-router-dom";
import { apiDemoLogin, apiGithubLogin, apiLogin } from "../../../API/auth";
import { useAuthStore } from "../../store";
import DemoLoginButton from "./DemoLoginButton";
import GithubLoginButton from "./GithubLoginButton";
import cssAuth from "./styles/Auth.module.css";
import cssLogin from "./styles/Login.module.css";

function Login() {
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [persist, setPersist] = useState(true);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        const res = await apiLogin(email, password);
        setLoading(false);

        handleLoginResponse(res);
    }

    async function handleGithubResponse(res) {
        const loginResponse = await apiGithubLogin(res.data.token);

        handleLoginResponse(loginResponse);
    }

    async function handleDemoLogin() {
        const res = await apiDemoLogin();

        handleLoginResponse(res);
    }

    function handleLoginResponse(res) {
        if (res.status == 200) {
            localStorage.setItem("persist", persist);
            login(res.data.access_token);
        } else {
            setError(res.data.message);
        }
    }

    return (
        <div className={cssAuth.wrapper}>
            <div className={cssAuth.container}>
                <h1 className={cssAuth.heading}>Login</h1>
                {error && <div className={cssLogin.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className={cssAuth["form-field"]}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={cssAuth["form-field"]}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={cssLogin["remember-me-field"]}>
                        <input
                            onChange={(e) => setPersist(e.target.checked)}
                            checked={persist}
                            type="checkbox"
                            id="remember-me"
                        />
                        <label htmlFor="remember-me">Remember me</label>
                    </div>
                    <button className={cssAuth.continue} type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Continue"}
                    </button>
                </form>
                <DemoLoginButton mainAction={handleDemoLogin} />
                <GithubLoginButton onSuccess={handleGithubResponse} />
                <div className={cssAuth["auth-link-container"]}>
                    Don't have an account? <Link to="/talk/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
