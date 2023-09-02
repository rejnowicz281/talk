import PropTypes from "prop-types";

export const userPropType = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
});

export const messagePropType = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    user: userPropType.isRequired,
    createdAt: PropTypes.string.isRequired,
});

export const roomPropType = PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    admin: PropTypes.string.isRequired, // admin id
    chatters: PropTypes.arrayOf(userPropType).isRequired,
    messages: PropTypes.arrayOf(messagePropType).isRequired,
});
