import React from "react"
import { formatNumberToIndian, titleCase } from "@utils"
import { Colors } from "../../../listing/components"
import { ProductMaterials } from ".."
import Rating from "@mui/material/Rating"
import { UncontrolledTooltip } from "reactstrap"

const SideProductInfo = ({ product }) => {
    const tooltipId = `tax-info-${product.id || Math.random().toString(36).substr(2, 9)}`;

    const discount = product.discounted_price && product.original_price 
        ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)
        : 0;

    const currentPrice = product.discounted_price || product.original_price;
    const mrp = product.discounted_price ? product.original_price : null;

    return (
        <div className="flex flex-col gap-4 w-full font-sans text-slate-900 mt-[-8px]">
            {/* Ratings Summary Section - Top level for Flipkart feel */}
            <div className="flex items-center gap-3">
                <div className="bg-[#388e3c] text-white px-2 py-0.5 rounded text-[12px] font-bold flex items-center gap-0.5 shadow-sm h-fit">
                    {product.ratings || '5'} <span className="material-symbols-outlined text-[12px]">star</span>
                </div>
                <span className="text-slate-400 font-bold text-[13px]">2,143 Ratings & 324 Reviews</span>
            </div>

            {/* Price Section */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">₹{formatNumberToIndian(currentPrice)}</span>
                    {mrp && (
                        <div className="flex items-center gap-2">
                             <span className="text-slate-400 line-through text-lg">₹{formatNumberToIndian(mrp)}</span>
                             <span className="text-green-600 font-bold text-lg">{discount}% off</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Highlights Section */}
            <div className="flex flex-col gap-3 py-4 border-y border-slate-100 mt-2">
                <h3 className="text-[16px] font-bold flex items-center gap-2 text-slate-800">
                    Highlights
                </h3>
                <div className="grid grid-cols-1 gap-y-2">
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="w-24 text-slate-400 font-medium">Brand</span>
                        <span className="text-slate-700 font-bold">{titleCase(product.vehicle_detail?.brand?.name || '-')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="w-24 text-slate-400 font-medium">Model</span>
                        <span className="text-slate-700 font-bold">{titleCase(product.vehicle_detail?.brand_model?.name || '-')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="w-24 text-slate-400 font-medium">Product Code</span>
                        <span className="text-slate-700 font-bold">{product.product_code || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="w-24 text-slate-400 font-medium">Material</span>
                        <span className="text-slate-700 font-bold"><ProductMaterials product={product} /></span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="w-24 text-slate-400 font-medium">Type</span>
                        <span className="text-slate-700 font-bold">{titleCase(product.category?.name || '-')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[14px]">
                        <span className="w-24 text-slate-400 font-medium">Availability</span>
                        <span className={product.availability === 'yes' ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                            {product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Variant / Color Section */}
            <div className="flex flex-col gap-3">
                <h3 className="text-[16px] font-bold text-slate-800">
                    Color
                </h3>
                <div>
                    <Colors product={product} />
                </div>
            </div>
        </div>
    )
}

export default SideProductInfo