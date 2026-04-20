import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProductPicture, formatNumberToIndian } from '@utils';
import { UncontrolledTooltip } from 'reactstrap';
import * as actions from '@redux/actions';
import Colors from "../../product/listing/components/colors";

const ProductCard = ({
    product,
    onClickProduct,
    showShopNowModal,
    onAddToCart,
    showColors = false
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLogin } = useSelector((state) => state.user);
    const cartItems = useSelector((state) => state.cart.items || []);

    // Determine if product is saleable based on e-commerce registry or flag
    const isSaleable = useMemo(() => {
        if (!product) return false;
        return !!product.ecommerce || !!product.is_saleable;
    }, [product]);

    // Find current quantity in cart
    const cartItem = useMemo(() => {
        if (!product) return null;
        return cartItems.find(item => item.product_id === product.id);
    }, [cartItems, product?.id]);

    const quantity = cartItem?.quantity || 0;

    if (!product) return null;

    const handleQuantityUpdate = (e, newQty) => {
        e.stopPropagation();
        if (!isLogin) {
            navigate('/login');
            return;
        }

        if (newQty > quantity) {
            // Increment
            if (quantity === 0) {
                dispatch(actions.cartProductCreate({ product_id: product.id, quantity: 1 }, () => {}));
            } else {
                dispatch(actions.cartProductUpdate({ id: cartItem.id, quantity: newQty }, () => {}));
            }
        } else if (newQty < quantity) {
            // Decrement
            if (newQty === 0) {
                dispatch(actions.cartProductDelete(cartItem.id, () => {}));
            } else {
                dispatch(actions.cartProductUpdate({ id: cartItem.id, quantity: newQty }, () => {}));
            }
        }
    };

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '').trim();
    };

    const picture = getProductPicture(product);
    const tooltipId = `tax-info-${product.id || Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="relative group/card bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-[#ffb200]/20 transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col h-full">
            {/* Image Container with Zoom Effect */}
            <div
                className="relative h-72 overflow-hidden bg-slate-50 cursor-pointer"
                onClick={() => onClickProduct(product)}
            >
                <img
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
                    src={picture}
                    loading="lazy"
                />
                
                {/* Top-Right Quick Add Stepper */}
                {isSaleable && (
                    <div className="absolute top-5 right-5 z-50 pointer-events-auto">
                        <div className={`
                            flex items-center gap-2 bg-white backdrop-blur-md p-1.5 rounded-2xl shadow-2xl border-2 border-[#ffb200]
                            transition-all duration-300 ease-out origin-right opacity-100
                        `}>
                            {quantity > 0 && (
                                <>
                                    <button 
                                        onClick={(e) => handleQuantityUpdate(e, quantity - 1)}
                                        className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-90"
                                    >
                                        <span className="material-symbols-outlined text-[18px] leading-none">remove</span>
                                    </button>
                                    <span className="min-w-[20px] text-center font-black text-slate-900 text-sm leading-none">{quantity}</span>
                                </>
                            )}
                            <button 
                                onClick={(e) => handleQuantityUpdate(e, quantity + 1)}
                                className={`
                                    w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90
                                    ${quantity > 0 ? 'bg-[#ffb200] text-black shadow-md' : 'bg-white text-[#ffb200] hover:bg-[#ffb200] hover:text-black'}
                                `}
                            >
                                <span className="material-symbols-outlined text-[18px] leading-none">{quantity === 0 ? 'shopping_cart' : 'add'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Corner Badges (Offset if stepper is visible) */}
                <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
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
                    className="text-xl font-medium text-slate-900 mb-2 line-clamp-1 group-hover/card:text-[#ffb200] transition-colors cursor-pointer tracking-tight"
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
                                    fade={false}
                                    className="premium-tooltip"
                                    innerClassName="!bg-white !text-slate-900 !text-[11px] !font-bold !px-3 !py-1.5 !rounded-lg !shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] !border !border-slate-100 !opacity-100 !tracking-tight"
                                    arrowClassName="!before:border-t-white"
                                >
                                    (incl. of all taxes)
                                </UncontrolledTooltip>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isSaleable ? (
                            <button
                                className="relative inline-flex items-center justify-center group/btn active:scale-95 transition-transform"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onAddToCart) {
                                        onAddToCart(product.id, true); // true for direct buy
                                    }
                                }}
                            >
                                <span className="px-6 py-3 bg-[#ffb200] text-black rounded-xl flex items-center gap-3 border-0 shadow-lg shadow-[#ffb200]/20 font-bold hover:scale-[1.02] transition-all">
                                    <span className="text-[12px] font-black uppercase tracking-[0.1em]">
                                        Buy Now
                                    </span>
                                    <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">payments</span>
                                </span>
                            </button>
                        ) : (
                            <button
                                className="relative inline-flex items-center justify-center group/btn active:scale-95 transition-transform"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showShopNowModal(product);
                                }}
                            >
                                <span className="px-6 py-3 bg-[#ffb200] text-black rounded-xl flex items-center gap-3 border-0 shadow-lg shadow-[#ffb200]/20 font-bold hover:scale-[1.02] transition-all">
                                    <span className="text-[12px] font-black uppercase tracking-[0.1em]">
                                        Enquiry Now
                                    </span>
                                    <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">contact_support</span>
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Subtle Hover Overlay */}
            <div className="absolute inset-0 bg-[#ffb200]/[0.02] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </div>
    );
};

export default ProductCard;
