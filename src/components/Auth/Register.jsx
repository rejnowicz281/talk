import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRegister } from "../../../helpers/API";
import { useAuthStore } from "../../store";
import ImagePicker from "../shared/PhotoPicker";

function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [errors, setErrors] = useState([]);
    const loginWithToken = useAuthStore((state) => state.loginWithToken);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await apiRegister(email, username, password, passwordConfirm, avatar);

        if (res.status == 200) {
            localStorage.setItem("token", res.data.token);
            loginWithToken(res.data.token);
        } else {
            setErrors(res.data.errors);
        }
    };

    return (
        <div className="auth-box">
            {errors.map((error) => (
                <div className="text-center text-rosy" key={error.msg}>
                    {error.msg}
                </div>
            ))}
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
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <div className="form-field">
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        placeholder="Confirm your password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="avatar">Avatar</label>
                    <ImagePicker id="avatar" setImage={setAvatar} />
                </div>
                <button className="register-button" type="submit">
                    Register
                </button>
            </form>
            <div className="auth-link-box">
                <Link className="auth-link" to="/talk/login">
                    Login <div className="auth-link-arrow">→</div>
                </Link>
            </div>
        </div>
    );
}

export default Register;
