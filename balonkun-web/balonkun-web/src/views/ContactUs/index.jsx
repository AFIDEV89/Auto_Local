import { faHome, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { postDataApi } from "../../services/ApiCaller";
import { errorAlert, successAlert } from '@utils';
import { Helmet } from "react-helmet";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    })

    const isValid = form.email && form.message && form.name;

    const submitForm = async () => {
        try {
            const response = await postDataApi({
                path: '/contactus',
                data: form
            });

            if (response) {
                successAlert("Query posted successfully.")
            }
        } catch (e) {
            errorAlert(e.message);
        }

    }

    return (
        <Container className="contactUsWrapper">
            <Row>
                <Col md={4} className="contact">
                    <Helmet>
                        <title>Contact us | Get in touch with us at Autoform India</title>
                        <meta name='description' content="Get in touch with us at Autoform India for all your Seat Cover and Accessories needs. Contact our team for inquiries, support, or feedback. We're here to help!" />
                    </Helmet>
                    <div className="content">

                        <p className="title">AMATO AUTOMOTIVE PVT LTD</p>

                        <div className="info">
                            <FontAwesomeIcon icon={faHome} />
                            <p>
                                Marketing Office: D-135, Sector 63 Rd, D Block, Sector 63, Noida,
                                Hazratpur Wajidpur, Uttar Pradesh 201301
                            </p>
                        </div>
                        <div className="info">
                            <FontAwesomeIcon icon={faPhone} />
                            <div>
                                <p>
                                    +91 9278411411 / +91 120 4358039
                                </p>
                                <p>
                                    10AM - 6PM
                                </p>
                            </div>

                        </div>
                    </div>

                </Col>
                <Col md={8} className="form">
                    <div className="content">
                        <p className="title">CONTACT FORM</p>

                        <div className="form-elements">
                            <TextField
                                id="name"
                                placeholder="Your Name"
                                required
                                value={form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                className="choose-select"
                            />
                            <TextField
                                id="email"
                                required
                                placeholder="E-Mail Address"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                className="choose-select"
                            />
                            <TextField
                                id="enquiry"
                                placeholder="Enquiry"
                                multiline
                                minRows={5}
                                required
                                value={form.message}
                                onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                                className="choose-select"
                            />

                            <Button variant="contained" onClick={submitForm} disabled={!isValid}>Submit</Button>
                        </div>


                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default ContactUs;