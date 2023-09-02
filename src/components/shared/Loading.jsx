import PropTypes from "prop-types";
import css from "./styles/Loading.module.css";

function Loading({ text }) {
    return <div className={css.loading}>{text ? text : "Loading..."}</div>;
}

Loading.propTypes = {
    text: PropTypes.string,
};

export default Loading;
