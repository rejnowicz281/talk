import { useState } from "react";
import { Link } from "react-router-dom";
import { apiDemoLogin, apiLogin } from "../../../helpers/API";
import { useAuthStore } from "../../store";
import "./Auth.css";

function Login() {
    const loginWithToken = useAuthStore((state) => state.loginWithToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await apiLogin(email, password);

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
        <div className="auth-box">
            {error && <div className="text-center text-rosy">{error}</div>}
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="login-button" type="submit">
                    Log In
                </button>
                <button onClick={handleDemoLogin} className="demo-login-button" type="button">
                    Demo Login
                </button>
            </form>
            <div className="auth-link-box">
                <Link to="/talk/register" className="auth-link">
                    Register <span className="auth-link-arrow">→</span>
                </Link>
            </div>
        </div>
    );
}

export default Login;
