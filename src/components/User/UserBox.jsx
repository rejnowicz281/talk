import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import css from "./styles/UserBox.module.css";

function UserBox({ user, adminTag = false }) {
    return (
        <div className={css.box}>
            <img height={50} width={50} src={user.avatar} alt="?" />
            <Link to={"/talk/users/" + user.username}>
                {user.username} {adminTag && "(Admin)"}
            </Link>
        </div>
    );
}

UserBox.propTypes = {
    adminTag: PropTypes.bool,
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
    }).isRequired,
};

export default UserBox;
