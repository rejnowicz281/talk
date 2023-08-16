import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function UserBox({ user }) {
    return (
        <>
            <img height={50} width={50} src={user.avatar} />
            <Link to={"/talk/users/" + user.username}>{user.username}</Link>
        </>
    );
}

UserBox.propTypes = {
    // user with shape required
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserBox;
