import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";

// Styles
import "swiper/css";
import "swiper/css/navigation";

// Assets & Constants
import { placeholder } from "@assets/images";
import { LATEST_BLOG_VIEW_ID } from "@shared/constants";

const Blogs = ({
    blogs = []
}) => {
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

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
        <section id={LATEST_BLOG_VIEW_ID} className="bg-white py-12 overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-6 gap-8 pb-4 border-b border-gray-100">
                    <div className="max-w-2xl text-left">
                        <span className="text-[#ffb200] font-black text-xs uppercase tracking-[0.3em] mb-3 block">Knowledge Base</span>
                        <div className="relative inline-block mb-3" ref={headerRef}>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-none">
                                Latest Insights.
                            </h2>
                            <div 
                                className={`absolute -bottom-2 left-0 h-[4px] bg-[#ffb200] rounded-full transition-all duration-1000 ease-out origin-left ${
                                    isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
                                }`}
                            ></div>
                        </div>
                        <p className="text-gray-400 font-medium text-lg leading-relaxed mt-2">
                            Expert advice on automotive comfort, style, and maintenance.
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-6 mb-2">
                        <button className="blog-prev flex items-center gap-2 text-gray-300 hover:text-[#1a1a1a] transition-all group/btn">
                            <span className="material-symbols-outlined text-3xl group-hover/btn:-translate-x-1 transition-transform">west</span>
                            <span className="text-[9px] font-black uppercase tracking-widest">PREVIOUS</span>
                        </button>
                        <div className="w-px h-6 bg-gray-200"></div>
                        <button className="blog-next flex items-center gap-2 text-gray-300 hover:text-[#1a1a1a] transition-all group/btn">
                            <span className="text-[9px] font-black uppercase tracking-widest">NEXT</span>
                            <span className="material-symbols-outlined text-3xl group-hover/btn:translate-x-1 transition-transform">east</span>
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={32}
                        slidesPerView={1}
                        autoplay={{
                            delay: 6000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            nextEl: ".blog-next",
                            prevEl: ".blog-prev",
                        }}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                        }}
                        className="!pb-8"
                    >
                        {blogs.map((blog, index) => (
                            <SwiperSlide key={blog.id || index}>
                                <div 
                                    onClick={() => navigate(`/blog/${blog.id}`)}
                                    className="group cursor-pointer flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-[0_5px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img 
                                            src={blog.image || placeholder} 
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={({ currentTarget }) => {
                                                currentTarget.onerror = null;
                                                currentTarget.src = placeholder;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Date Badge */}
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
                                            <span className="text-[#1a1a1a] font-black text-lg leading-none">
                                                {new Date(blog.createdAt).getDate()}
                                            </span>
                                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
                                                {new Date(blog.createdAt).toLocaleString('default', { month: 'short' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        {/* Meta Tags */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#ffb200] text-sm">person</span>
                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{blog.creator_name || "Admin"}</span>
                                            </div>
                                            <div className="size-1 rounded-full bg-gray-200"></div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-gray-300 text-sm">schedule</span>
                                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">5 Min Read</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-extrabold text-[#1a1a1a] mb-4 group-hover:text-[#ffb200] transition-colors line-clamp-2 leading-tight">
                                            {blog.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                                            "{blog.description}"
                                        </p>

                                        {/* Read More Button */}
                                        <div className="mt-auto flex items-center gap-3 text-[#1a1a1a] font-black text-xs tracking-widest group/more">
                                            <span className="group-hover/more:mr-2 transition-all">READ ARTICLE</span>
                                            <div className="w-8 h-[2px] bg-[#ffb200] group-hover/more:w-12 transition-all"></div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Mobile Navigation */}
                    <div className="flex md:hidden items-center justify-center gap-8 mt-4">
                        <button className="blog-prev text-gray-300 hover:text-[#1a1a1a] transition-all">
                            <span className="material-symbols-outlined text-3xl">west</span>
                        </button>
                        <button className="blog-next text-gray-300 hover:text-[#1a1a1a] transition-all">
                            <span className="material-symbols-outlined text-3xl">east</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Blogs;
