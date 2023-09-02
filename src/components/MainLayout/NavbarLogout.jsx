import { useAuthStore } from "../../store";
import css from "./styles/Navbar.module.css";

function NavbarLogout() {
    const logout = useAuthStore((state) => state.logout);

    return (
        <button onClick={logout} className={css["main-button"]}>
            Click to Logout
        </button>
    );
}

export default NavbarLogout;
