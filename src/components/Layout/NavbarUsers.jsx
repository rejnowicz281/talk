import PropTypes from "prop-types";
import UserBox from "../User/UserBox";

function NavbarUsers({ loggedUsers }) {
    return (
        <nav>
            <h2>Active users:</h2>
            <ul>
                {loggedUsers.map((user) => (
                    <li key={user._id}>
                        <UserBox user={user} />
                    </li>
                ))}
            </ul>
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
