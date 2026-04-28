import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalBody,
    Form,
    Input
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faTimes, 
    faUser, 
    faPhoneAlt, 
    faEnvelope, 
    faCommentDots 
} from "@fortawesome/free-solid-svg-icons";
import { postDataApi } from "../../../services/ApiCaller";
import { errorAlert, successAlert } from "../../../utils";
import seatCoverImg from "../../../assets/images/assistance-seat-cover.png";

const AssistanceModal = ({ isOpen, toggleModal }) => {
    const [formData, setFormData] = useState({
        name: "",
        contact_no: "",
        email: "",
        message: ""
    });
    const [contactError, setContactError] = useState("");

    const [loading, setLoading] = useState(false);
    const [appearedFields, setAppearedFields] = useState([]);

    // Staggered Animation Logic
    useEffect(() => {
        if (isOpen) {
            const fields = ['name', 'contact', 'email', 'message'];
            fields.forEach((field, index) => {
                setTimeout(() => {
                    setAppearedFields(prev => [...prev, field]);
                }, index * 100);
            });
        } else {
            setAppearedFields([]);
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "contact_no") {
            // Remove non-digit characters and truncate to 10
            const cleaned = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleaned }));
            
            // Immediate validation for starting digit
            if (cleaned.length > 0 && !/^[6-9]/.test(cleaned)) {
                setContactError("Mobile number must start with 6, 7, 8, or 9");
            } else {
                setContactError("");
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        
        if (!formData.name) {
            errorAlert("Please fill in your Name.");
            return;
        }

        if (!formData.contact_no && !formData.email) {
            errorAlert("Please provide either your Mobile number or Email address so we can reach you.");
            return;
        }

        const indianMobileRegex = /^[6-9]\d{9}$/;
        if (formData.contact_no && !indianMobileRegex.test(formData.contact_no)) {
            errorAlert("Please enter a valid 10-digit Indian mobile number.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            errorAlert("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await postDataApi({
                path: '/pop-lead',
                data: {
                    customer_name: formData.name,
                    email: formData.email,
                    contact_no: formData.contact_no,
                    feedback: formData.message || "Expert Inquiry via Popup"
                }
            });

            if (response) {
                successAlert("Inquiry received! Our experts will call you shortly.");
                toggleModal();
                setFormData({ name: "", email: "", message: "", contact_no: "" });
            }
        } catch (err) {
            errorAlert(err.message || "Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            toggle={toggleModal}
            centered
            className="assistance-modal border-0"
            contentClassName="bg-transparent border-0"
        >
            <ModalBody className="p-0">
                <div className="amaze-duo-canvas">
                    {/* LEFT PANEL: Interlocked Headers & Slanted Fields */}
                    <div className="amaze-left-panel">
                        <div className="amaze-headers">
                            <div className="badge-dark-skew">
                                <h2>Need Assistance</h2>
                            </div>
                            <div className="badge-orange-skew">
                                <span>Talk to expert</span>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit} className="amaze-pill-container">
                            <div className={`amaze-pill ${appearedFields.includes('name') ? 'appeared' : ''}`}>
                                <div className="pill-icon-circle">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <Input 
                                    name="name" 
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </div>

                            <div className={`amaze-pill ${appearedFields.includes('contact') ? 'appeared' : ''}`}>
                                <div className="pill-icon-circle">
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                </div>
                                <Input 
                                    name="contact_no" 
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="10-Digit mobile"
                                    value={formData.contact_no}
                                    onChange={handleChange}
                                    className={contactError ? 'border-danger' : ''}
                                />
                                {contactError && <p className="text-danger text-[10px] font-bold mt-1 mb-0 absolute -bottom-5 left-12">{contactError}</p>}
                            </div>

                            <div className={`amaze-pill ${appearedFields.includes('email') ? 'appeared' : ''}`}>
                                <div className="pill-icon-circle">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </div>
                                <Input 
                                    name="email" 
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={`amaze-pill ${appearedFields.includes('message') ? 'appeared' : ''}`}>
                                <div className="pill-icon-circle">
                                    <FontAwesomeIcon icon={faCommentDots} />
                                </div>
                                <Input 
                                    name="message" 
                                    type="textarea"
                                    placeholder="Requirement message"
                                    value={formData.message}
                                    onChange={handleChange}
                                />
                            </div>
                        </Form>
                    </div>

                    {/* RIGHT PANEL: Dominating Product Image */}
                    <div className="amaze-right-panel">
                        <button className="amaze-close-btn" onClick={toggleModal}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <img 
                            src={seatCoverImg} 
                            alt="Premium Seat Cover" 
                            className="hero-image"
                        />
                    </div>

                    {/* ACTION: Bottom Center Submit Button */}
                    <button 
                        className="submit-precision-btn" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        <span>{loading ? "Sending..." : "Submit Inquiry"}</span>
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default AssistanceModal;
