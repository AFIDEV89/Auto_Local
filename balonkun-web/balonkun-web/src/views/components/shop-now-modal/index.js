import React from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { postDataApi } from "../../../services/ApiCaller";
import { errorAlert, successAlert } from "../../../utils";
import { howItWorks, logo } from "@assets/images";
import * as services from "../../../services/my-cart/MyCart";
import "@assets/scss/shop-now-modal.scss";
import { store } from '@redux/store';

const ShopNowModal = React.memo(({ isOpen, toggleModal, product }) => {
  const [number, setNumber] = React.useState("");
  const [error, setError] = React.useState("");
  
  const handleSubmit = async () => {
    if (!validatePhoneNumber(number)) {
      return;
    }
    try {
      // Fetch current cart items to include in lead snapshot
      let cartItems = [];
      const userToken = store?.getState()?.user?.token;
      
      if (userToken) {
        try {
          const cartResponse = await services.getCartProductList();
          if (cartResponse?.data?.data) {
            cartItems = cartResponse.data.data;
          }
        } catch (cartError) {
          console.warn("Could not fetch cart items for lead:", cartError);
        }
      }

      const response = await postDataApi({
        path: "/lead",
        data: {
          contact_no: number,
          product_id: product?.id,
          cart_snapshot: {
            current_product: {
              id: product?.id,
              name: product?.name,
              price: product?.discounted_price || product?.original_price
            },
            cart_items: cartItems.map(item => ({
              id: item.product_id,
              name: item.product?.name,
              quantity: item.quantity,
              price: item.product?.discounted_price || item.product?.original_price
            }))
          }
        },
      });
      if (response) {
        successAlert("We will call you back shortly!");
        toggleModal();
      }
    } catch (e) {
      // Catch specific errors from the lead creation itself
      errorAlert(e.message || "Something went wrong. Please try again.");
    }
  };

  const validatePhoneNumber = (number) => {
    if (!number) {
      setError("");
      return false;
    }
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(number)) {
      setError(number.length === 10 ? "Invalid Indian mobile number" : "Please enter a valid 10-digit number");
      return false;
    }
    setError("");
    return true;
  }

  const handleChangeNumber = (val) => {
    // Remove non-digit characters and truncate to 10
    const cleaned = val.replace(/\D/g, "").slice(0, 10);
    setNumber(cleaned);

    // Immediate validation for starting digit
    if (cleaned.length > 0 && !/^[6-9]/.test(cleaned)) {
      setError("Mobile number must start with 6, 7, 8, or 9");
    } else {
      setError("");
    }
  }

  return (
    <Modal
      className="premium-automotive-modal"
      isOpen={isOpen}
      toggle={toggleModal}
      backdrop="static"
      centered
      size="lg"
    >
      <ModalBody className="p-0 overflow-hidden bg-white rounded-[24px] shadow-2xl border-0">
        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Left Section: Brand Panel (Green) */}
          <div className="md:w-[40%] bg-brand-green relative overflow-hidden flex items-center justify-center p-10">
            <img 
              src={howItWorks} 
              alt="Brand Visual" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green via-brand-green/20 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <img src={logo} alt="Autoform Logo" className="h-8 object-contain brightness-0 invert mb-2" />
              <span className="inline-block px-3 py-1 rounded-full bg-[#ffb200] text-slate-900 text-[10px] font-black uppercase tracking-widest">
                Service Request
              </span>
              <h3 className="text-white text-3xl font-bold tracking-tight leading-tight">Expert <br/>Consultation</h3>
              <p className="text-gray-200 text-sm font-medium leading-relaxed">
                Premium care for your premium vehicle.
              </p>
            </div>
          </div>

          {/* Right Section: Form (Light) */}
          <div className="md:w-[60%] p-8 lg:p-12 flex flex-col justify-center relative bg-white">
            <button 
              onClick={toggleModal}
              className="absolute top-6 right-8 text-gray-400 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="mb-8">
              <h2 className="text-slate-900 text-[28px] font-bold tracking-tighter mb-2">Request a Callback</h2>
              <p className="text-gray-500 text-sm leading-relaxed">Enter your number and one of our specialists will reach out to you shortly.</p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 inline-block">
                  Phone Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`w-full bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-100 group-focus-within:border-[#ffb200] group-focus-within:bg-white'} rounded-xl px-4 py-3 text-slate-900 text-base font-semibold outline-none transition-all placeholder:text-slate-400`}
                  placeholder="e.g. 9876543210"
                  value={number}
                  onChange={(e) => handleChangeNumber(e.target.value)}
                />
                {error && <p className="absolute -bottom-5 left-0 text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</p>}
              </div>

              <div className="pt-2">
                <Button
                  className="w-full h-[54px] !bg-[#ffb200] hover:!bg-[#e6a100] text-slate-900 font-extrabold uppercase tracking-widest text-xs !flex !flex-row !items-center !justify-center gap-2 rounded-xl shadow-lg border-0 transition-all active:scale-[0.98]"
                  onClick={() => handleSubmit(product)}
                >
                  <span className="!leading-none">Confirm Request</span>
                  <span className="material-symbols-outlined text-[20px] !leading-none">call</span>
                </Button>
              </div>
            </div>

            <p className="mt-8 text-center text-[10px] text-gray-400 font-medium">
              We respect your privacy. No spam, just a professional callback.
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
});

export default ShopNowModal;
