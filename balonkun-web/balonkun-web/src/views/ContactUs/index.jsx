import { faEnvelope, faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Col, Container, Row, Input, FormGroup, Label, Button } from "reactstrap";
import { postDataApi } from "../../services/ApiCaller";
import { errorAlert, successAlert } from '@utils';
import { Helmet } from "react-helmet";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: ""
    })

    const [loading, setLoading] = useState(false);

    const isValid = form.email && form.message && form.name;

    const submitForm = async () => {
        setLoading(true);
        try {
            const response = await postDataApi({
                path: '/contactus',
                data: form
            });

            if (response) {
                successAlert("Query posted successfully.")
                setForm({ name: "", email: "", message: "" });
            }
        } catch (e) {
            errorAlert(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="static-page-container bg-white">
            <Helmet>
                <title>Contact Us | Autoform India</title>
                <meta name='description' content="Get in touch with us at Autoform India for all your Seat Cover and Accessories needs." />
            </Helmet>

            <section className="static-hero mb-0 border-bottom-0 pb-8 pt-16" style={{ padding: '80px 20px 40px' }}>
                <h1>CONTACT US</h1>
                <p className="hero-subtitle">We're Here to Help You</p>
            </section>

            <div className="w-100 px-0">
                <div className="border-top border-slate-100">
                    <Row className="g-0 min-vh-75">
                        {/* Left Info Panel - Light Theme */}
                        <Col lg={5} className="bg-[#f8fafc] p-10 md:p-20 flex flex-col justify-center border-bottom border-slate-100 lg:border-bottom-0 lg:border-end">
                            <div className="max-w-[450px] mx-auto w-100">
                                <h3 className="text-[#0f172a] border-yellow-500 mb-8 mt-0 pl-0 border-l-0 text-3xl font-black uppercase tracking-tight">
                                    Get In <span className="text-[#ffb200]">Touch</span>
                                </h3>
                                <p className="text-slate-500 mb-12 text-lg leading-relaxed">
                                    Have questions about our products or need assistance with your order? Our team is ready to help.
                                </p>

                                <div className="space-y-10">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#ffb200] transition-transform group-hover:scale-110">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#ffb200] mb-0.5 text-xl tracking-tight leading-none">AMATO AUTOMOTIVE PVT LTD</p>
                                            <p className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-900 mb-2 leading-none">Marketing Office</p>
                                            <p className="text-slate-500 text-sm leading-relaxed mt-3">
                                                D-135, Sector 63 Rd, D Block, Sector 63, Noida, Hazratpur Wajidpur, Uttar Pradesh 201301
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#ffb200] transition-transform group-hover:scale-110">
                                            <FontAwesomeIcon icon={faPhoneAlt} className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1 text-lg">Phone Support</p>
                                            <p className="text-slate-500 text-sm">
                                                +91 9278411411 / +91 120 4358039
                                            </p>
                                            <p className="text-slate-400 text-xs mt-1 font-medium">10AM - 6PM (Mon-Sat)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 text-[#ffb200] transition-transform group-hover:scale-110">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 mb-1 text-lg">Email Us</p>
                                            <p className="text-slate-500 text-sm font-medium">marketing@autoformindia.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Right Form Panel */}
                        <Col lg={7} className="p-10 md:p-24 bg-white flex flex-col justify-center static-form-container">
                            <div className="max-w-[700px] mx-auto w-100">
                                <h3 className="mt-0 border-l-4 border-[#ffb200] pl-6 text-3xl font-black text-[#0f172a] mb-12 uppercase tracking-tight">
                                    Send a Message
                                </h3>

                                <FormGroup className="mb-8">
                                    <Label className="form-label uppercase tracking-widest text-[10px] font-black text-slate-400 mb-3">Your Full Name</Label>
                                    <Input
                                        placeholder="Enter your name"
                                        value={form.name}
                                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="form-control py-3 px-4 border-slate-200"
                                    />
                                </FormGroup>

                                <FormGroup className="mb-8">
                                    <Label className="form-label uppercase tracking-widest text-[10px] font-black text-slate-400 mb-3">Email Address</Label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="form-control py-3 px-4 border-slate-200"
                                    />
                                </FormGroup>

                                <FormGroup className="mb-10">
                                    <Label className="form-label uppercase tracking-widest text-[10px] font-black text-slate-400 mb-3">How can we help you?</Label>
                                    <Input
                                        type="textarea"
                                        rows={6}
                                        placeholder="Start typing your enquiry..."
                                        value={form.message}
                                        onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                                        className="form-control py-3 px-4 border-slate-200"
                                    />
                                </FormGroup>

                                <Button 
                                    className="btn-submit w-full md:w-auto px-12 py-4 uppercase font-black tracking-[0.2em] transform active:scale-95" 
                                    onClick={submitForm} 
                                    disabled={!isValid || loading}
                                >
                                    {loading ? 'Sending...' : 'Submit Enquiry'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default ContactUs;