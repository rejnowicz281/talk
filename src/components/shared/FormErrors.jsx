import PropTypes from "prop-types";

function FormErrors({ errors }) {
    return (
        <>
            {errors.map((error) => (
                <div className="text-rosy" key={error.msg}>
                    {error.msg}
                </div>
            ))}
        </>
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
