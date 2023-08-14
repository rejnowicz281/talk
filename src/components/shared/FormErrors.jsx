import PropTypes from "prop-types";

function FormErrors({ errors }) {
    return (
        <ul>
            {errors.map((error) => (
                <li key={error.msg}>{error.msg}</li>
            ))}
        </ul>
    );
}

FormErrors.propTypes = {
    errors: PropTypes.arrayOf(
        PropTypes.shape({
            msg: PropTypes.string.isRequired,
        })
    ),
};

export default FormErrors;
