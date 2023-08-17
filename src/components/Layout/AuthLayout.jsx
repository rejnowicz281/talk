import { Outlet } from "react-router-dom";
import "./Layout.css";

function AuthLayout() {
    return (
        <div className="auth-container">
            <Outlet />
        </div>
    );
}

export default AuthLayout;
