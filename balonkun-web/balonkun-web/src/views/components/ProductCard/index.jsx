import React from "react";
import { getProductPicture, formatNumberToIndian } from '@utils';
import { UncontrolledTooltip } from 'reactstrap';
import Colors from "../../product/listing/components/colors";

const ProductCard = ({
    product,
    onClickProduct,
    showShopNowModal,
    showColors = false
}) => {
    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '').trim();
    };

    const picture = getProductPicture(product);
    const tooltipId = `tax-info-${product.id || Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="relative group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#ffb200]/20 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col h-full">
            {/* Image Container with Zoom Effect */}
            <div
                className="relative h-72 overflow-hidden bg-slate-50 cursor-pointer"
                onClick={() => onClickProduct(product)}
            >
                <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    src={picture}
                    loading="lazy"
                />
                {/* Corner Badges */}
                <div className="absolute top-5 right-5 flex flex-col gap-2 z-20">
                    {product.is_new && (
                        <div className="bg-[#ffb200] text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                            NEW
                        </div>
                    )}
                    {product.discount > 0 && (
                        <div className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
                            SALE
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col relative z-10 flex-grow">
                <h3
                    className="text-xl font-medium text-slate-900 mb-2 line-clamp-1 group-hover:text-[#ffb200] transition-colors cursor-pointer tracking-tight"
                    onClick={() => onClickProduct(product)}
                >
                    {product.name}
                </h3>

                {/* Optional Colors Component for Listing Page */}
                {showColors && (
                    <div className="mb-2">
                        <Colors product={product} />
                    </div>
                )}

                <p className="text-slate-500 font-normal text-[14px] mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {stripHtml(product.description || product.short_description) || "Premium quality vehicle accessories."}
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1">Starts From</span>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-light text-slate-900 tracking-tighter flex items-baseline">
                                <span className="text-[#ffb200] font-normal mr-1 text-lg">₹</span>{formatNumberToIndian(product.original_price)}
                            </span>
                            <div className="relative inline-flex items-center ml-1.5 group/info">
                                <span
                                    id={tooltipId}
                                    className="text-[15px] font-bold text-slate-300 hover:text-[#ffb200] cursor-help transition-all duration-300 leading-none select-none"
                                >
                                    𝓲
                                </span>
                                <UncontrolledTooltip
                                    placement="top"
                                    target={tooltipId}
                                    fade={true}
                                    className="premium-tooltip"
                                    innerClassName="!bg-white !text-slate-900 !text-[11px] !font-bold !px-3 !py-1.5 !rounded-lg !shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] !border !border-slate-100 !opacity-100 !tracking-tight"
                                    arrowClassName="!before:border-t-white"
                                >
                                    (incl. of all taxes)
                                </UncontrolledTooltip>
                            </div>
                        </div>
                    </div>

                    <button
                        className="relative inline-flex items-center justify-center group/btn active:scale-95 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            showShopNowModal(product);
                        }}
                    >
                        <span className="px-6 py-3 bg-[#ffb200] text-black rounded-xl flex items-center gap-3 border-0 shadow-lg shadow-[#ffb200]/20 font-bold hover:scale-[1.02] transition-all">
                            <span className="text-[12px] font-black uppercase tracking-[0.1em]">Shop Now</span>
                            <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Subtle Hover Overlay */}
            <div className="absolute inset-0 bg-[#ffb200]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
    );
};

export default ProductCard;
