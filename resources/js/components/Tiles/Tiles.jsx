import PropTypes from 'prop-types';

import "./Tiles.css";

const Tiles = ({ items, onItemClick }) => {

    return (
        <div className="tiles">
            {items.map((item, i) => (
                <div className="tile" key={i} onClick={() => onItemClick(item)}>{item.title}</div>
            ))}
        </div>
    );
}

Tiles.propTypes = {
    items: PropTypes.array.isRequired,
}

export default Tiles;