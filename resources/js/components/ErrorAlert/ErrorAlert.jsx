import PropTypes from 'prop-types';

// import { ReactComponent as Close } from "../../assets/close.svg";

import "./ErrorAlert.css";

const ErrorAlert = ({ message, onClose }) => {

    const closeAlert = (e) => {
        let errorAlert = e.target.closest(".errorAlert");

        errorAlert.classList.remove("errorAlert--fallDown");
        errorAlert.classList.add("errorAlert--fallUp");

        setTimeout(() => {
            errorAlert.style.display = "none";
            onClose();

        }, 500);
    }

    return (
        <div className="errorAlert errorAlert--fallDown">
            { message }
            <img
                src={`${process.env.MIX_REACT_APP_BASE_URL}/images/close.svg`}
                className="errorAlert--close"
                alt="Close"
                onClick={closeAlert}
            />
        </div>
    );
}


ErrorAlert.propTypes = {
    message: PropTypes.string.isRequired,
}

export default ErrorAlert;