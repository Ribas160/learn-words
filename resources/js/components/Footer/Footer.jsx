import { Link } from 'react-router-dom';

// import { ReactComponent as HomeIcon } from "../../assets/home.svg";
// import { ReactComponent as GridView } from "../../assets/grid_view.svg"

import "./Footer.css";

const Footer = () => {

    return (
        <footer className="footer">
            <Link 
                to="/" 
                className={`footer--icon`}
            >
                <img
                    src={`${process.env.MIX_REACT_APP_BASE_URL}/images/home.svg`}
                    alt="Home image"
                />
                {/* <HomeIcon /> */}
            </Link>
            <Link 
                to="/groups" 
                className={`footer--icon`}
            >
                <img
                    src={`${process.env.MIX_REACT_APP_BASE_URL}/images/grid_view.svg`}
                    alt="Grid image"
                />
            </Link>
        </footer>
    );
}

export default Footer;