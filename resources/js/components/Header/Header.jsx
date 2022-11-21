import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// import { ReactComponent as ArrowBack } from "../../assets/arrow_back.svg";

import "./Header.css";

const Header = ({ title, returnBtn }) => {
    return (
        <header className="header">
            { returnBtn && 
                <Link to={"../"} className="header--arrow--back">
                    <img
                        src={`${process.env.MIX_REACT_APP_BASE_URL}/images/arrow_back.svg`}
                        alt="Arrow back"
                    />
                </Link> }
            <h1>{ title }</h1>
        </header>
    );
}

Header.defaultProps = {
    returnBtn: true,
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    returnBtn: PropTypes.bool,
}

export default Header;