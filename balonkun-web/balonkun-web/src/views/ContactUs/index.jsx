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
        <div id="contact-us-page-final" className="static-page-container bg-white">
            <Helmet>
                <title>Contact Us | Autoform India</title>
                <meta name='description' content="Get in touch with us at Autoform India for all your Seat Cover and Accessories needs." />
            </Helmet>

            <section className="static-hero mb-0 border-bottom-0 pb-8 pt-16 px-6" style={{ padding: '80px 24px 40px' }}>
                <h1>CONTACT US</h1>
                <p className="hero-subtitle">We're Here to Help You</p>
            </section>

            {/* Mobile Layout (sm:hidden) */}
            <div className="block sm:hidden px-4 pb-12 overflow-hidden">
                {/* Contact Info Cards Stack */}
                <div className="space-y-4 mb-10">
                    <div className="bg-[#f8fafc] border border-slate-100 px-4 py-5 rounded-[24px] flex items-start gap-3 shadow-sm">
                        <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#ffb200] flex-shrink-0">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffb200] mb-1">Marketing Office</p>
                            <p className="font-bold text-slate-900 text-sm mb-1 leading-tight">AMATO AUTOMOTIVE PVT LTD</p>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                D-135, Sector 63 Rd, D Block, Sector 63, Noida, Uttar Pradesh 201301
                            </p>
                            <a href="https://maps.app.goo.gl/3f9nS2R6G7" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-[#ffb200] font-bold text-[10px] uppercase tracking-wider">
                                View on Map <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <a href="tel:+919278411411" className="bg-[#f8fafc] border border-slate-100 px-4 py-5 rounded-[24px] flex items-center gap-3 shadow-sm active:scale-95 transition-transform no-underline">
                            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#ffb200] flex-shrink-0">
                                <FontAwesomeIcon icon={faPhoneAlt} className="text-lg" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffb200] mb-1">Call Us</p>
                                <p className="font-bold text-slate-900 text-sm mb-1">+91 9278411411</p>
                                <p className="text-slate-500 text-[10px] font-medium opacity-80">9:30 AM - 6:00 PM (Mon-Sat)</p>
                            </div>
                        </a>

                        <a href="mailto:marketing@autoformindia.com" className="bg-[#f8fafc] border border-slate-100 px-4 py-5 rounded-[24px] flex items-center gap-3 shadow-sm active:scale-95 transition-transform no-underline">
                            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-[#ffb200] flex-shrink-0">
                                <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ffb200] mb-1">Email Support</p>
                                <p className="font-bold text-slate-900 text-[13px] truncate">marketing@autoformindia.com</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Main Contact Form Card */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 static-form-container">
                    <h3 className="mt-0 border-l-4 border-[#ffb200] pl-4 text-2xl font-black text-[#0f172a] mb-8 uppercase tracking-tight">
                        Send a Message
                    </h3>

                    <FormGroup className="mb-6">
                        <Label className="form-label uppercase tracking-widest text-[9px] font-black text-slate-400 mb-2">Full Name</Label>
                        <Input
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                            className="form-control py-3 px-4 border-slate-200"
                        />
                    </FormGroup>

                    <FormGroup className="mb-6">
                        <Label className="form-label uppercase tracking-widest text-[9px] font-black text-slate-400 mb-2">Email Address</Label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                            className="form-control py-3 px-4 border-slate-200"
                        />
                    </FormGroup>

                    <FormGroup className="mb-8">
                        <Label className="form-label uppercase tracking-widest text-[9px] font-black text-slate-400 mb-2">How can we help?</Label>
                        <Input
                            type="textarea"
                            rows={4}
                            placeholder="Type your enquiry..."
                            value={form.message}
                            onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                            className="form-control py-3 px-4 border-slate-200"
                        />
                    </FormGroup>

                    <Button 
                        className="btn-submit w-full py-4 uppercase font-black tracking-[0.2em] transform active:scale-95" 
                        onClick={submitForm} 
                        disabled={!isValid || loading}
                    >
                        {loading ? 'Sending...' : 'Submit Enquiry'}
                    </Button>
                </div>

                {/* Integrated Map Section */}
                <div className="mt-10 rounded-[24px] overflow-hidden border border-slate-100 shadow-sm">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.3592473179274!2d77.38246637528856!3d28.618993275672175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ceff73b45ba67%3A0x1d4ba6b777ee7088!2sAUTOFORM%20INDIA!5e0!3m2!1sen!2sin!4v1774335132329!5m2!1sen!2sin"
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Autoform India Location"
                    ></iframe>
                </div>
            </div>

            {/* Desktop Layout (hidden sm:block) */}
            <div className="hidden sm:block">
                <div className="max-w-[1240px] mx-auto px-6 py-16">
                    <Row className="gx-5">
                        {/* Left Info Panel */}
                        <Col lg={5} className="pr-lg-10">
                            <div className="max-w-[450px] ml-auto mr-0">
                                <h3 className="text-[38px] font-black text-[#0f172a] mb-6 uppercase tracking-tighter leading-none">
                                    Get In <span className="text-[#ffb200]">Touch</span>
                                </h3>
                                <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">
                                    Have questions about our products or need assistance with your order? Our team is ready to help.
                                </p>
                                
                                <div className="space-y-8">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-[#f8fafc] rounded-2xl flex items-center justify-center flex-shrink-0 text-[#ffb200] border border-slate-100 transition-all group-hover:bg-[#ffb200] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#ffb200]/20">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#ffb200] mb-1 text-sm uppercase tracking-[0.2em]">Marketing Office</p>
                                            <p className="font-bold text-[#0f172a] text-xl mb-2">AMATO AUTOMOTIVE PVT LTD</p>
                                            <p className="text-slate-500 text-sm leading-relaxed max-w-[320px]">
                                                D-135, Sector 63 Rd, D Block, Sector 63, Noida, Hazratpur Wajidpur, Uttar Pradesh 201301
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-[#f8fafc] rounded-2xl flex items-center justify-center flex-shrink-0 text-[#ffb200] border border-slate-100 transition-all group-hover:bg-[#ffb200] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#ffb200]/20">
                                            <FontAwesomeIcon icon={faPhoneAlt} className="text-2xl" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#ffb200] mb-1 text-sm uppercase tracking-[0.2em]">Phone Support</p>
                                            <p className="font-bold text-[#0f172a] text-xl mb-1">+91 9278411411</p>
                                            <p className="text-slate-400 text-xs font-bold font-montserrat">9:30 AM - 6:00 PM (Mon-Sat)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-6 group">
                                        <div className="w-14 h-14 bg-[#f8fafc] rounded-2xl flex items-center justify-center flex-shrink-0 text-[#ffb200] border border-slate-100 transition-all group-hover:bg-[#ffb200] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#ffb200]/20">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
                                        </div>
                                        <div>
                                            <p className="font-black text-[#ffb200] mb-1 text-sm uppercase tracking-[0.2em]">Email Us</p>
                                            <p className="font-bold text-[#0f172a] text-xl">marketing@autoformindia.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        
                        {/* Right Form Panel */}
                        <Col lg={7} className="pl-lg-10 static-form-container border-left">
                            <div className="max-w-[700px] ml-0 mr-auto w-full">
                                <h3 className="mt-0 border-l-4 border-[#ffb200] pl-6 text-[32px] font-black text-[#0f172a] mb-10 uppercase tracking-tight">
                                    Send a <span className="text-[#ffb200]">Message</span>
                                </h3>

                                <FormGroup className="mb-6">
                                    <Label className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400 mb-3">Your Full Name</Label>
                                    <Input
                                        placeholder="Enter your name"
                                        value={form.name}
                                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="form-control py-3 px-4 border-slate-200 bg-slate-50/50"
                                    />
                                </FormGroup>

                                <FormGroup className="mb-6">
                                    <Label className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400 mb-3">Email Address</Label>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={form.email}
                                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="form-control py-3 px-4 border-slate-200 bg-slate-50/50"
                                    />
                                </FormGroup>

                                <FormGroup className="mb-8">
                                    <Label className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400 mb-3">How can we help you?</Label>
                                    <Input
                                        type="textarea"
                                        rows={5}
                                        placeholder="Start typing your enquiry..."
                                        value={form.message}
                                        onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                                        className="form-control py-3 px-4 border-slate-200 bg-slate-50/50"
                                    />
                                </FormGroup>

                                <Button 
                                    className="btn-submit px-12 py-4 uppercase font-black tracking-[0.2em] transform active:scale-95" 
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