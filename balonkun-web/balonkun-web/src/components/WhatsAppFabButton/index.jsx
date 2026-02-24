import React from "react";
import "./WhatsAppFabButton.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const WhatsAppFabButton = () => {
    return (
        <a className="whatsapp-fab" aria-label="Chat on WhatsApp" href="https://wa.me/7217014601" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} alt="Chat on WhatsApp" />
        </a>
    )
}

export default WhatsAppFabButton;