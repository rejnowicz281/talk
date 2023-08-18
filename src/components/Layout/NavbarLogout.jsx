import { useAuthStore } from "../../store";

function NavbarLogout() {
    const logout = useAuthStore((state) => state.logout);

    return (
        <button onClick={logout} className="current-navbar-heading-button">
            Click to Logout
        </button>
    );
}

export default NavbarLogout;
