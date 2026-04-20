import React from "react";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CONTACT_INFO } from "../Config";

const ContactInfo = () => {
    return (<div className="contacts-wrapper">
        <p className="contact-header">
            GET IN TOUCH
        </p>

        <div className="contacts">
            <div className="contact">
                <div className="contact-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div className="contact-details">
                    <a href="mailto:marketing@autoformindia.com" className="link" target="_blank" rel="noreferrer">
                        {CONTACT_INFO.email}
                    </a>
                </div>
            </div>
            <div className="contact">
                <div className="contact-icon">
                    <FontAwesomeIcon icon={faPhone} />
                </div>
                <div className="contact-details">
                    <a href="tel:+91 9278411411" className="link" target="_blank" rel="noreferrer">
                        {CONTACT_INFO.phone1}
                    </a>
                    <a href="tel:+91 120 4247861" className="link shadow-link" target="_blank" rel="noreferrer">
                        {CONTACT_INFO.phone2}
                    </a>
                </div>
            </div>
        </div>
    </div>)
}

export default ContactInfo