import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errors, setErrors] = useState([]);
    const register = useAuthStore((state) => state.register);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(email, username, password, passwordConfirm);

        if (res.status !== 200) setErrors(res.data.errors);
    };

    return (
        <div>
            {errors.length !== 0 && (
                <ul>
                    {errors.map((error) => (
                        <li key={error.msg}>{error.msg}</li>
                    ))}
                </ul>
            )}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    placeholder="Enter a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="passwordConfirm">Confirm Password</label>
                <input
                    type="password"
                    id="passwordConfirm"
                    placeholder="Confirm your password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />
                <button type="submit">Log In</button>
            </form>
            <div>
                <Link to="/talk/login">Login →</Link>
            </div>
        </div>
    );
}

export default Register;
