import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function UserBox({ user }) {
    return (
        <>
            <img height={50} width={50} src={user.avatar} alt="?" />
            <Link to={"/talk/users/" + user.username}>{user.username}</Link>
        </>
    );
}

UserBox.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserBox;
