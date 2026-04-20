import React, { useEffect, useRef, useState } from "react";
import API from "../../../../api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";

// Import Swiper styles if not already globally available
import "swiper/css";
import "swiper/css/navigation";

const TestimonialSlider = () => {
    const [activeTab, setActiveTab] = useState('carOwners');
    const headerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [testimonials, setTestimonials] = useState({ carOwners: [], franchisePartners: [] });
    const [loading, setLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await API.get(`testimonials?status=Active`);
            if (response?.data?.statusCode === 200) {
                const list = response.data.data.rows || [];
                const carOwners = list.filter(item => item.type === 'carOwners');
                const franchisePartners = list.filter(item => item.type === 'franchisePartners');
                setTestimonials({ carOwners, franchisePartners });
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            if (headerRef.current) {
                observer.unobserve(headerRef.current);
            }
        };
    }, []);

    return (
        <section className="bg-[#fafafa] py-12 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center md:text-left">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-6 gap-8 pb-4 border-b border-gray-100">
                    <div className="max-w-2xl text-left">
                        <span className="text-[#ffb200] font-black text-xs uppercase tracking-[0.3em] mb-3 block">Testimonials</span>
                        <div className="relative inline-block mb-3" ref={headerRef}>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-none">
                                Premium Stories.
                            </h2>
                            <div 
                                className={`absolute -bottom-2 left-0 h-[4px] bg-[#ffb200] rounded-full transition-all duration-1000 ease-out origin-left ${
                                    isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
                                }`}
                            ></div>
                        </div>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed mt-2">
                            Crafting comfort for thousands of journeys across the country.
                        </p>
                    </div>
                    
                    {/* Desktop Toggle (RESTORED - Zero Impact) */}
                    <div className="hidden md:flex gap-8 lg:gap-12 pb-1 relative">
                        <button
                            onClick={() => setActiveTab('carOwners')}
                            className={`pb-4 font-black text-xs lg:text-sm uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'carOwners'
                                ? 'text-[#1a1a1a]'
                                : 'text-gray-300 hover:text-gray-600'
                                }`}
                        >
                            CUSTOMERS
                            {activeTab === 'carOwners' && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ffb200] rounded-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('franchisePartners')}
                            className={`pb-4 font-black text-xs lg:text-sm uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'franchisePartners'
                                ? 'text-[#1a1a1a]'
                                : 'text-gray-300 hover:text-gray-600'
                                }`}
                        >
                            PARTNERS
                            {activeTab === 'franchisePartners' && (
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ffb200] rounded-full"></div>
                            )}
                        </button>
                    </div>

                    {/* Mobile Sliding Pill Toggle (MODERNIZED - Mobile Only) */}
                    <div className="md:hidden relative w-full max-w-[280px] mx-auto bg-slate-100 p-1 rounded-full flex items-center mb-10">
                        {/* Sliding Background Pill */}
                        <div 
                            className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-[#ffb200] rounded-full shadow-sm transition-all duration-300 ease-out z-0"
                            style={{
                                left: activeTab === 'carOwners' ? '4px' : 'calc(50% + 2px)',
                            }}
                        />
                        
                        <button
                            onClick={() => setActiveTab('carOwners')}
                            className={`relative flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-center transition-colors duration-300 z-10 ${activeTab === 'carOwners' ? 'text-white' : 'text-slate-400'}`}
                        >
                            CUSTOMERS
                        </button>
                        <button
                            onClick={() => setActiveTab('franchisePartners')}
                            className={`relative flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-center transition-colors duration-300 z-10 ${activeTab === 'franchisePartners' ? 'text-white' : 'text-slate-400'}`}
                        >
                            PARTNERS
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <Swiper
                        key={activeTab}
                        modules={[Autoplay, Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: ".testi-next",
                            prevEl: ".testi-prev",
                        }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                        }}
                        className="!pb-16"
                    >
                        {testimonials[activeTab]?.map((item) => (
                            <SwiperSlide key={item.id} className="!h-auto">
                                <div className="group h-full bg-white border-l-4 border-[#ffb200] p-8 flex flex-col relative shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-r-xl overflow-hidden min-h-[340px]">
                                    
                                    {/* Subtle Perforated Pattern */}
                                    <div className="absolute top-0 right-0 size-24 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:10px_10px] opacity-10 pointer-events-none"></div>

                                    {/* Quote Icon */}
                                    <div className="mb-4">
                                        <span className="material-symbols-outlined text-[#ffb200] text-3xl font-light">format_quote</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow flex flex-col">
                                        <p className="text-[#1a1a1a] text-base lg:text-lg font-bold leading-relaxed mb-6 italic">
                                            "{item.description}"
                                        </p>
                                        
                                        {/* Stars (MODERNIZED - Centered on Mobile) */}
                                        <div className="flex gap-1 justify-center md:justify-start mb-6 mt-auto">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-xs ${i < item.rating ? 'text-[#ffb200] fill-current' : 'text-gray-200'}`}>star</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Identity Section */}
                                    <div className="flex items-center gap-4 pt-6 border-t border-dashed border-gray-100">
                                        <div className="size-12 rounded-full border border-gray-100 p-1 bg-white shadow-sm overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {item.image ? (
                                                <img
                                                    alt={item.clientName}
                                                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    src={item.image.startsWith('http') ? item.image : `${process.env.REACT_APP_API_BASE_URL}${item.image}`}
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="font-extrabold text-[#ffb200] text-lg">{item.clientName?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#1a1a1a] text-sm uppercase tracking-tight mb-0.5">
                                                {item.clientName}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="size-1 rounded-full bg-[#ffb200]"></span>
                                                <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em]">
                                                    {item.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Decorative Stitching Decor */}
                                    <div className="absolute bottom-2 right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                        <span className="text-3xl font-black text-[#1a1a1a]">AUTOFORM</span>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Bar */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30">
                        <button className="testi-prev flex items-center gap-3 text-gray-300 hover:text-[#1a1a1a] transition-all group/btn">
                            <span className="material-symbols-outlined text-3xl group-hover/btn:-translate-x-1.5 transition-transform">west</span>
                            <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">PREVIOUS</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <button className="testi-next flex items-center gap-3 text-gray-300 hover:text-[#1a1a1a] transition-all group/btn">
                            <span className="text-[9px] font-black uppercase tracking-widest hidden md:block">NEXT</span>
                            <span className="material-symbols-outlined text-3xl group-hover/btn:translate-x-1.5 transition-transform">east</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>


    );
};

export default TestimonialSlider;
