import { useState } from "react";
import { Link } from "react-router-dom";
import { loginResponse } from "../../../helpers/API";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await loginResponse(email, password);

        if (res.status === 200) {
            const token = res.data.token;
            localStorage.setItem("token", token);
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
                <button type="submit">Sign In</button>
            </form>
            <div>
                <Link to="/talk/register">Register →</Link>
            </div>
        </div>
    );
}

export default Login;
