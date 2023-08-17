import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
}

export default AuthLayout;
