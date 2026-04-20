import React, { useState, useEffect } from "react"
import { formatNumberToIndian, titleCase } from "@utils"
import { Colors } from "../../../listing/components"
import { ProductMaterials } from ".."
import { useDispatch, useSelector } from "react-redux"
import * as actions from '@redux/actions'

const SideProductInfo = ({ product }) => {
    const dispatch = useDispatch();
    const globalPincode = useSelector(state => state.pincode?.pincode);
    const [pincode, setPincode] = useState("");
    const [showEstimate, setShowEstimate] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState("");

    // SYNC: When global pincode changes (e.g. from home page), update local state and check
    useEffect(() => {
        if (globalPincode && globalPincode.toString().length === 6) {
            const pinStr = globalPincode.toString();
            setPincode(pinStr);
            validatePincode(pinStr);
        }
    }, [globalPincode]);

    const discount = product.discounted_price && product.original_price 
        ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)
        : 0;

    const currentPrice = product.discounted_price || product.original_price;
    const mrp = product.discounted_price ? product.original_price : null;

    const isMajorCategory = (product.category?.name || "").toLowerCase().includes("seat cover") || 
                           (product.category?.name || "").toLowerCase().includes("mat");
    
    const deliveryDays = isMajorCategory ? "10-12" : "5-7";

    const validatePincode = async (targetPin) => {
        const pinToCheck = targetPin || pincode;
        if (pinToCheck.toString().length !== 6) {
            if (!targetPin) setError("Please enter a valid 6-digit pincode");
            setShowEstimate(false);
            return;
        }

        setIsValidating(true);
        setError("");
        setShowEstimate(false);

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pinToCheck}`);
            const data = await response.json();

            if (data[0] && data[0].Status === "Success") {
                if (!targetPin) dispatch(actions.setPincode({ locationPinCode: pinToCheck }));
                setShowEstimate(true);
            } else {
                if (!targetPin) setError("Invalid Indian pincode. Please try again.");
            }
        } catch (err) {
            console.error("Pincode validation failed:", err);
            setShowEstimate(true);
        } finally {
            setIsValidating(false);
        }
    };

    const handlePincodeCheck = () => validatePincode();

    return (
        <div className="flex flex-col gap-5 w-full font-sans text-slate-900 mt-2">
            {/* Social Proof Badges */}
            <div className="flex flex-nowrap sm:flex-wrap gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <div className="flex items-center gap-1 bg-[#fff8e1] text-[#b45309] px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[11px] font-bold border border-[#fef3c7] uppercase tracking-wider shadow-sm whitespace-nowrap">
                    <span className="material-symbols-outlined text-[11px] sm:text-[14px]">star_rate</span>
                    Top Rated
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[11px] font-bold border border-emerald-100 uppercase tracking-wider shadow-sm whitespace-nowrap">
                    <span className="material-symbols-outlined text-[11px] sm:text-[14px]">diamond</span>
                    Premium Material
                </div>
                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[9px] sm:text-[11px] font-bold border border-blue-100 uppercase tracking-wider shadow-sm whitespace-nowrap">
                    <span className="material-symbols-outlined text-[11px] sm:text-[14px]">check_circle</span>
                    Perfect Fit
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {/* Ratings & Price */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#388e3c] text-white px-2 py-0.5 rounded text-[12px] font-bold flex items-center gap-0.5 shadow-sm h-fit">
                            {product.ratings || '5'} <span className="material-symbols-outlined text-[12px]">star</span>
                        </div>
                        <span className="text-slate-400 font-bold text-[13px]">2,143 Ratings & 324 Reviews</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-slate-900">₹{formatNumberToIndian(currentPrice)}</span>
                        {mrp && (
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 line-through text-lg">₹{formatNumberToIndian(mrp)}</span>
                                <span className="text-green-600 font-bold text-lg">{discount}% off</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Highlights Grid */}
                <div className="flex flex-col gap-4 py-2">
                    <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-4 w-1 bg-[#ffb200] inline-block"></span>
                        Key Highlights
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Brand", value: titleCase(product.vehicle_detail?.brand?.name || '-'), icon: "business" },
                            { label: "Model", value: titleCase(product.vehicle_detail?.brand_model?.name || '-'), icon: "directions_car" },
                            { label: "Code", value: product.product_code || '-', icon: "qr_code_2" },
                            { label: "Material", value: <ProductMaterials product={product} />, icon: "layers" },
                            { label: "Type", value: titleCase(product.category?.name || '-'), icon: "category" },
                            { label: "Availability", value: product.availability === 'yes' ? 'In Stock' : 'Out of Stock', icon: "check_circle", isStatus: true }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-3">
                                <span className="material-symbols-outlined text-slate-400 text-[20px] bg-slate-100 p-1.5 rounded-lg">{item.icon}</span>
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</span>
                                    <span className={`text-[13px] font-bold leading-tight ${item.isStatus ? (product.availability === 'yes' ? 'text-emerald-600' : 'text-rose-500') : 'text-slate-700'}`}>
                                        {item.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color Section */}
                <div className="flex flex-col gap-4 mt-2">
                    <h3 className="text-[15px] font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-4 w-1 bg-[#ffb200] inline-block"></span>
                        Available Colors
                    </h3>
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <Colors product={product} />
                    </div>
                </div>

                {/* Delivery Checker */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-2">
                    <div className="flex items-center gap-2 mb-3 text-slate-800">
                        <span className="material-symbols-outlined text-[20px] text-slate-500">local_shipping</span>
                        <span className="text-[14px] font-bold uppercase tracking-wide">Check Delivery</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-[3] sm:flex-1">
                            <input 
                                type="text"
                                maxLength="6"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-white border border-slate-200 px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-[#ffb200] transition-colors"
                            />
                        </div>
                        <button 
                            onClick={handlePincodeCheck}
                            disabled={isValidating}
                            className="bg-brand-green text-white px-3 sm:px-5 py-2.5 text-[10px] sm:text-xs font-bold rounded-lg shadow-[0_4px_12px_-2px_rgba(45,71,57,0.3)] hover:bg-[#3d5a4a] hover:shadow-[0_6px_15px_-2px_rgba(45,71,57,0.4)] hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest transition-all duration-200 disabled:opacity-50 flex-1 sm:flex-none"
                        >
                            {isValidating ? "..." : "Check"}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-2 text-rose-500 text-[12px] font-medium flex items-center gap-1 uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            {error}
                        </div>
                    )}
                    {showEstimate && (
                        <div className="mt-3 flex items-center gap-2 text-emerald-700 text-[13px] font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <span>Estimate Delivery: {deliveryDays} days</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SideProductInfo