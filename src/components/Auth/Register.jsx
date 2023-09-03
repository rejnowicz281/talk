import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRegister } from "../../../API/auth";
import { useAuthStore } from "../../store";
import ImagePicker from "../shared/ImagePicker";
import cssAuth from "./styles/Auth.module.css";
import cssRegister from "./styles/Register.module.css";

function Register() {
    const loginWithToken = useAuthStore((state) => state.loginWithToken);

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await apiRegister(email, username, password, passwordConfirm, avatar);
        setLoading(false);

        if (res.status == 200) {
            localStorage.setItem("token", res.data.token);
            loginWithToken(res.data.token);
        } else {
            setErrors(res.data.errors);
        }
    };

    return (
        <div className={cssAuth.wrapper}>
            <div className={cssAuth.container}>
                <h1 className={cssAuth.heading}>Register</h1>
                {errors.length !== 0 && (
                    <div className={cssRegister.errors}>
                        {errors.map((error) => (
                            <li key={error.msg} className={cssRegister.error}>
                                {error.msg}
                            </li>
                        ))}
                    </div>
                )}
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
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className={cssRegister["double-form-field"]}>
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
                        <div className={cssAuth["form-field"]}>
                            <label htmlFor="passwordConfirm">Confirm Password</label>
                            <input
                                type="password"
                                id="passwordConfirm"
                                placeholder="Confirm your password"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={cssAuth["form-field"]}>
                        <label htmlFor="avatar">Avatar (optional)</label>
                        <ImagePicker id="avatar" setImage={setAvatar} />
                    </div>
                    <button className={cssAuth.continue} type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Continue"}
                    </button>
                </form>
                <div className={cssAuth["auth-link-container"]}>
                    Already have an account? <Link to="/talk/login">Log In</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
