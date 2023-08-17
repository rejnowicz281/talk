import PropTypes from "prop-types";
import UserBox from "../User/UserBox";

function NavbarUsers({ loggedUsers }) {
    return (
        <nav className="current-navbar">
            <h2 className="current-navbar-heading">Active users</h2>
            <div className="current-navbar-list">
                {loggedUsers.map((user) => (
                    <div className="navbar-active-user-container" key={user._id}>
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
