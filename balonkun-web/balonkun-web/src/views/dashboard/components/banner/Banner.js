import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants';

const Banner = ({ bannerList = [] }) => {
    const [isActive, setIsActive] = useState(0);
    const navigate = useNavigate();
    const intervalRef = useRef(null);
    const touchStartX = useRef(null);

    useEffect(() => {
        const startAutoSlide = () => {
            intervalRef.current = setInterval(() => {
                setIsActive((prevIndex) => (prevIndex + 1) % bannerList.length);
            }, 5000);
        };

        const stopAutoSlide = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

        if (bannerList.length > 1) {
            startAutoSlide();
            return () => stopAutoSlide();
        }
    }, [bannerList.length]);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!touchStartX.current) return;
        const deltaX = touchStartX.current - e.touches[0].clientX;
        if (deltaX > 50) {
            setIsActive((prev) => (prev + 1) % bannerList.length);
            touchStartX.current = null;
        } else if (deltaX < -50) {
            setIsActive((prev) => (prev === 0 ? bannerList.length - 1 : prev - 1));
            touchStartX.current = null;
        }
    };

    const handleTouchEnd = () => {
        touchStartX.current = null;
    };

    if (!bannerList || bannerList.length === 0) {
        return (
        <section className="relative h-[85vh] w-full bg-gray-900 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-48 h-48 bg-gray-700 rounded-2xl mb-6"></div>
                    <div className="h-8 bg-gray-700 rounded w-96 mb-4"></div>
                    <div className="h-4 bg-gray-700 rounded w-64"></div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="relative h-[85vh] w-full bg-gray-900 overflow-hidden group"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Cycling Background Images */}
            {bannerList.map((item, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isActive === index ? "opacity-60" : "opacity-0"}`}
                >
                    <img
                        alt={item.title || "Autoform Banner"}
                        className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isActive === index ? "scale-110" : "scale-105"}`}
                        src={encodeURI(item.image)}
                    />
                </div>
            ))}

            {/* Dark cinematic overlay */}
            <div className="absolute inset-0 z-[5]" style={{
                background: 'linear-gradient(120deg, rgba(10,14,12,0.56) 10%, rgba(10,14,12,0.22) 52%, rgba(10,14,12,0.62) 100%), radial-gradient(550px 280px at 75% 22%, rgba(255,178,0,0.2), transparent 70%)'
            }}></div>

            {/* Static Hero Content — exact match from template */}
            <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col justify-end pb-32 lg:pb-40">
                <div className="max-w-3xl animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6" style={{ textShadow: '0 14px 24px rgba(0,0,0,0.3)' }}>
                        Crafting <span className="text-[#ffb200]">Premium</span><br />Interiors Since 1994
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-xl">
                        Experience unparalleled luxury and comfort with India's finest automotive accessories.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            className="bg-[#ffb200] hover:bg-[#e6a100] text-slate-900 px-7 py-3 rounded-lg text-base font-bold transition-colors"
                            onClick={() => navigate('/products')}
                        >
                            Explore Products
                        </button>
                        <button
                            className="border border-white/30 hover:bg-white/10 text-white px-7 py-3 rounded-lg text-base font-bold transition-colors backdrop-blur-sm"
                            onClick={() => navigate(ROUTES.STORE_LOCATOR)}
                        >
                            Find a Store
                        </button>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            {bannerList.length > 1 && (
                <div className="absolute inset-x-0 bottom-24 z-30 flex justify-center gap-3">
                    {bannerList.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-500 ${isActive === index ? "bg-[#ffb200] w-10" : "bg-white/30 w-6"}`}
                            onClick={() => setIsActive(index)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Banner;