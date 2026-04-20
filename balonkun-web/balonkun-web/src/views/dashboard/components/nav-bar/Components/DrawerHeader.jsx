import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { newLogo } from "@assets/images";

const DrawerHeader = ({
    onClose
}) => {
    return (
        <div className="drawerHeader">
            <Link to="/" className="drawer-logo-wrapper" onClick={onClose}>
                <img src={newLogo} className="autoform-logo" alt="Autoform" />
            </Link>

            <FontAwesomeIcon icon={faXmark} onClick={onClose} className="drawer-close-icon" />
        </div>
    )
}

export default DrawerHeader