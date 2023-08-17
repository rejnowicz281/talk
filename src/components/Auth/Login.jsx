import { useState } from "react";
import { Link } from "react-router-dom";
import { apiLogin } from "../../../helpers/API";
import { useAuthStore } from "../../store";

function Login() {
    const loginWithToken = useAuthStore((state) => state.loginWithToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await apiLogin(email, password);

        if (res.status == 200) {
            localStorage.setItem("token", res.data.token);
            loginWithToken(res.data.token);
        } else {
            setError(res.data.message);
        }
    };

    return (
        <div>
            {error && <div>{error}</div>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Log In</button>
            </form>
            <div>
                <Link to="/talk/register">Register →</Link>
            </div>
        </div>
    );
}

export default Login;
