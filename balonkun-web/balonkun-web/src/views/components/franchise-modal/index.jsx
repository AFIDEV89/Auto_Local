import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import { postDataApi } from "../../../services/ApiCaller";
import { errorAlert, successAlert } from "../../../utils";

import { howItWorks, logo } from "@assets/images";

const FranchiseModal = ({ isOpen, toggleModal }) => {
  const [formData, setFormData] = useState({
    contact_person_name: "",
    email: "",
    mobile_number: "",
    store_name: "",
    location: "",
    store_area: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is mandatory";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.mobile_number)
      newErrors.mobile_number = "Mobile number is mandatory";
    else if (!/^\d{10}$/.test(formData.mobile_number))
      newErrors.mobile_number = "Mobile number must be 10 digits";

    if (!formData.contact_person_name)
      newErrors.contact_person_name = "Name is mandatory";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await postDataApi({
        path: "/franchise/franchise-inquiry",
        data: formData,
      });

      if (response) {
        successAlert("Your inquiry has been submitted successfully! We will contact you soon.");
        toggleModal();
        setFormData({
          contact_person_name: "",
          email: "",
          mobile_number: "",
          store_name: "",
          location: "",
          store_area: "",
          category: "",
        });
      }
    } catch (err) {
      errorAlert(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggleModal}
      centered
      size="xl"
      className="franchise-modal border-0 overflow-hidden rounded-2xl"
      contentClassName="border-0 overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      <ModalBody className="p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full min-h-[550px]">
          {/* Left Panel: Luxury Brand Imagery */}
          <div className="hidden lg:flex w-[40%] bg-brand-green relative overflow-hidden items-center justify-center">
            <img 
              src={howItWorks} 
              alt="Franchise Branding" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/20 to-transparent" />
            
            <div className="relative z-10 px-12 text-white">
              <div className="mb-6">
                <img src={logo} alt="Autoform Logo" className="h-8 object-contain brightness-0 invert" />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffb200] text-slate-900 text-[10px] font-black uppercase tracking-widest mb-4">
                Franchise Network
              </span>
              <h2 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
                Partner with the <br />Best in India
              </h2>
              <p className="text-gray-200 text-sm leading-relaxed max-w-xs font-medium">
                Join a legacy of excellence and millions of happy customers across the nation.
              </p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ffb200] group-hover:text-slate-900 transition-all duration-300">
                    <span className="material-symbols-outlined !text-xl">trending_up</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Fast Growth</h4>
                    <p className="text-xs text-gray-400">High demand across all regions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#ffb200] group-hover:text-slate-900 transition-all duration-300">
                    <span className="material-symbols-outlined !text-xl">workspace_premium</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Brand Value</h4>
                    <p className="text-xs text-gray-400">Established premium reputation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Clean Modern Form */}
          <div className="flex-1 p-8 lg:p-10 relative bg-white">
            <button 
              onClick={toggleModal}
              className="absolute top-6 right-8 text-gray-400 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Inquiry Details</h3>
              <p className="text-sm text-gray-500 mt-1">Tell us about your proposed venture.</p>
            </div>

            <Form onSubmit={handleSubmit} className="space-y-4">
              <FormGroup className="relative group/field">
                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                  Contact Person Name*
                </Label>
                <div className="relative">
                  <Input
                    name="contact_person_name"
                    placeholder="Enter Full Name"
                    value={formData.contact_person_name}
                    onChange={handleChange}
                    invalid={!!errors.contact_person_name}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  />
                  {errors.contact_person_name && <p className="text-[10px] text-red-500 mt-1 font-bold absolute right-0">{errors.contact_person_name}</p>}
                </div>
              </FormGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup className="relative group/field">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                    Email Address*
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    invalid={!!errors.email}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  />
                  {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.email}</p>}
                </FormGroup>

                <FormGroup className="relative group/field">
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                    Mobile Number*
                  </Label>
                  <Input
                    name="mobile_number"
                    placeholder="10-digit number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    invalid={!!errors.mobile_number}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  />
                  {errors.mobile_number && <p className="text-[10px] text-red-500 mt-1 font-bold">{errors.mobile_number}</p>}
                </FormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                    Store Name
                  </Label>
                  <Input
                    name="store_name"
                    placeholder="Autoform Elite"
                    value={formData.store_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                    Location
                  </Label>
                  <Input
                    name="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  />
                </FormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                <FormGroup>
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                    Store Area (Sqft)
                  </Label>
                  <Input
                    name="store_area"
                    placeholder="e.g. 500"
                    value={formData.store_area}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 py-2 text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 inline-block">
                    Category
                  </Label>
                  <Input
                    name="category"
                    type="select"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-slate-100 rounded-xl px-4 h-[40px] text-sm focus:bg-white focus:border-[#ffb200] transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="4-Wheeler">4 Wheeler</option>
                    <option value="2-Wheeler">2 Wheeler</option>
                    <option value="Both">Both</option>
                  </Input>
                </FormGroup>
              </div>

              <Button
                color="warning"
                block
                className="bg-[#ffb200] hover:bg-[#e6a100] text-slate-900 border-0 font-black py-3 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>
            </Form>

            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium">
              By submitting this form, you agree to our Franchise Privacy Terms.
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FranchiseModal;
