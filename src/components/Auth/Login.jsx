import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);

        if (res.status !== 200) setError(res.data.message);
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
