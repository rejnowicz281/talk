import PropTypes from "prop-types";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import AsyncButton from "../shared/AsyncButton";
import css from "./styles/DemoLoginButton.module.css";

function DemoLoginButton({ mainAction }) {
    return (
        <AsyncButton
            className={css.button}
            content={
                <>
                    <BiSolidSkipNextCircle className={css.icon} /> Demo Login
                </>
            }
            loadingContent={
                <>
                    <BiSolidSkipNextCircle className={css.icon} /> Logging in...
                </>
            }
            mainAction={mainAction}
        />
    );
}

DemoLoginButton.propTypes = {
    mainAction: PropTypes.func.isRequired,
};

export default DemoLoginButton;
