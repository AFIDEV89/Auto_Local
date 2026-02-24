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
            <Link to="/">
                <img src={newLogo} className="autoform-logo" />
            </Link>

            <FontAwesomeIcon icon={faXmark} onClick={onClose} />
        </div>
    )
}

export default DrawerHeader