import PropTypes from "prop-types";
import { useState } from "react";
import "./PhotoPicker.css";

function ImagePicker({ setImage, id }) {
    const [imageIsSet, setImageIsSet] = useState(false);

    function handleImageChange(e) {
        setImage(e.target.files[0]);
        setImageIsSet(true);
    }

    function handleCancelImage() {
        setImage(null);
        setImageIsSet(false);
        document.getElementById("avatar").value = "";
    }

    return (
        <div className="photo-picker-box">
            {imageIsSet && (
                <button className="cancel-image-button" type="button" onClick={handleCancelImage}>
                    ☓
                </button>
            )}
            <input className="photo-picker" type="file" id={id} onChange={handleImageChange} />
        </div>
    );
}

ImagePicker.propTypes = {
    id: PropTypes.string.isRequired,
    setImage: PropTypes.func.isRequired,
};

export default ImagePicker;
