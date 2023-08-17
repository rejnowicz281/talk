import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./User.css";

function UserBox({ user }) {
    return (
        <div className="userbox">
            <img height={50} width={50} src={user.avatar} alt="?" />
            <Link to={"/talk/users/" + user.username}>{user.username}</Link>
        </div>
    );
}

UserBox.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserBox;
