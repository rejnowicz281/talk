import { useState } from "react";
import { Link } from "react-router-dom";
import { apiDemoLogin, apiLogin } from "../../../helpers/API";
import { useAuthStore } from "../../store";
import DemoLoginButton from "./DemoLoginButton";
import cssAuth from "./styles/Auth.module.css";
import cssLogin from "./styles/Login.module.css";

function Login() {
    const loginWithToken = useAuthStore((state) => state.loginWithToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await apiLogin(email, password);
        setLoading(false);

        handleLoginResponse(res);
    };

    async function handleDemoLogin() {
        const res = await apiDemoLogin();

        handleLoginResponse(res);
    }

    function handleLoginResponse(res) {
        if (res.status == 200) {
            localStorage.setItem("token", res.data.token);
            loginWithToken(res.data.token);
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
                    <button className={cssAuth.continue} type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Continue"}
                    </button>
                </form>
                <DemoLoginButton mainAction={handleDemoLogin} />
                <div className={cssAuth["auth-link-container"]}>
                    Don't have an account? <Link to="/talk/register">Register</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
