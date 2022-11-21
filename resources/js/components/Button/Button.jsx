import PropTypes from 'prop-types';

import "./Button.css";


const Button = ({ text, onClick }) => {

    return (
        <button className="button" onClick={onClick}>
            {text}
        </button>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onclick: PropTypes.func,
}

export default Button;