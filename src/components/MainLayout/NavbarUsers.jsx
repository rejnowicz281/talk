import PropTypes from "prop-types";
import UserBox from "../User/UserBox";
import cssNavbar from "./styles/Navbar.module.css";
import cssNavbarUsers from "./styles/NavbarUsers.module.css";

function NavbarUsers({ loggedUsers }) {
    return (
        <nav className={cssNavbar.container}>
            <div className={cssNavbar.list}>
                {loggedUsers.map((user) => (
                    <div className={cssNavbarUsers["user-wrapper"]} key={user._id}>
                        <UserBox user={user} />
                    </div>
                ))}
            </div>
        </nav>
    );
}

NavbarUsers.propTypes = {
    loggedUsers: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
            socketId: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default NavbarUsers;
