import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES, VEHICLE_TYPE_ID } from '@shared/constants';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import '@assets/scss/explore-categories.scss';

// Importing generated premium assets via centralized index
import {
    seatCoversExplore,
    carMatsExplore,
    accessoriesExplore,
    twoWheelerSeatCoversExplore,
    twoWheelerAccessoriesExplore,
    twoWheelerBodyCoversExplore,
    lightUtilityExplore,
    audioSecurityExplore,
    careFragranceExplore,
    FourWheeler,
    TwoWheeler
} from '@assets/images';

const ExploreCategories = () => {
    const [activeTab, setActiveTab] = useState('4w');
    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperRef, setSwiperRef] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const categories4w = [
        {
            id: 1,
            name: 'Seat Covers',
            description: 'Hand-stitched leather perfection tailored for your specific vehicle model.',
            image: seatCoversExplore,
            link: '/car-seat-covers'
        },
        {
            id: 3,
            name: 'Accessories',
            description: 'Neck pillows, steering covers, and organizers for a complete interior.',
            image: accessoriesExplore,
            link: '/car-accessories'
        },
        {
            id: 2,
            name: 'Mats',
            description: 'Precision fit mats designed to protect your vehicle\'s floor in style.',
            image: carMatsExplore,
            link: '/autoform-car-mats'
        },
        {
            id: 7,
            name: 'Light & Utility',
            description: 'Advanced lighting and essential utility gear for a smarter drive.',
            image: lightUtilityExplore,
            link: '/utilities'
        },
        {
            id: 8,
            name: 'Audio & Security',
            description: 'Premium sound systems and advanced security for peace of mind.',
            image: audioSecurityExplore,
            link: '/products?vid=2&pcid=13'
        },
        {
            id: 9,
            name: 'Care & Fragrance',
            description: 'Professional detailing and luxury perfumes to keep your car fresh.',
            image: careFragranceExplore,
            link: '/car-care'
        },
        {
            id: 10,
            name: 'Steering Covers',
            description: 'Premium grip steering covers for enhanced comfort and control.',
            image: accessoriesExplore,
            link: '/steering-covers'
        },
        {
            id: 11,
            name: 'Organisers',
            description: 'Smart storage solutions to keep your car interior neat and organized.',
            image: accessoriesExplore,
            link: '/organisers'
        },
        {
            id: 12,
            name: 'Tissue Boxes',
            description: 'Elegant tissue box holders that complement your car\'s premium interior.',
            image: accessoriesExplore,
            link: '/tissue-boxes'
        },
        {
            id: 13,
            name: 'Padded Seat Cover',
            description: 'Extra cushioned seat covers for maximum comfort on long drives.',
            image: seatCoversExplore,
            link: '/padded-seat-cover'
        },
        {
            id: 14,
            name: 'EV Accessories',
            description: 'Specialized accessories designed for electric vehicle owners.',
            image: lightUtilityExplore,
            link: '/ev-accessories'
        },
        {
            id: 15,
            name: 'Mobile Accessories',
            description: 'Car phone mounts and mobile charging solutions for your drive.',
            image: lightUtilityExplore,
            link: '/mobile-holders'
        }
    ];

    const categories2w = [
        {
            id: 4,
            name: '2W Seat Covers',
            description: 'Durable, stylish seat covers designed for every two-wheeler.',
            image: twoWheelerSeatCoversExplore,
            link: '/two-wheeler-seat-covers'
        },
        {
            id: 5,
            name: '2W Accessories',
            description: 'Essential add-ons to enhance your ride\'s comfort and style.',
            image: twoWheelerAccessoriesExplore,
            link: '/products?vid=1&pcid=11'
        },
        {
            id: 6,
            name: 'Body Covers',
            description: 'All-weather protection to keep your bike looking pristine.',
            image: twoWheelerBodyCoversExplore,
            link: '/bike-body-covers'
        },
        {
            id: 22,
            name: '2W Mats',
            description: 'Precision fit mats designed to protect your two-wheeler in style.',
            image: carMatsExplore,
            link: '/products?vid=1&pcid=12'
        }
    ];

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setActiveIndex(0);
        if (swiperRef && !swiperRef.destroyed) {
            swiperRef.slideTo(0, 0, false);
        }
    };

    const currentCategories = activeTab === '4w' ? categories4w : categories2w;

    const handleDropdownSelect = (idx) => {
        if (swiperRef && !swiperRef.destroyed) {
            swiperRef.slideTo(idx);
        }
        setIsDropdownOpen(false);
    };

    return (
        <section className="relative bg-[#1A1A1A] pt-12 pb-12 md:pb-24 px-0 md:px-0 mt-[-2px] overflow-hidden category-section-mobile">
            {/* Cinematic Spotlight Highlight */}
            <div
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ffb200]/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />

            <div className="max-w-[1440px] mx-auto relative z-10 px-0 lg:px-12">
                {/* Desktop Header Layer (RESTORED - Zero impact on desktop) */}
                <div className="hidden md:flex flex-row justify-between items-end mb-12 gap-8 px-0">
                    <div className="text-left">
                        <span className="text-[#ffb200] font-bold text-sm tracking-[0.2em] uppercase block mb-2 underline decoration-[#ffb200] underline-offset-8">
                            Our Products
                        </span>
                        <h2 className="text-5xl font-bold text-white leading-tight">
                            Explore <span className="text-[#ffb200]">Categories</span>
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-10">
                        {/* Desktop Toggles */}
                        <div className="flex items-center gap-0">
                            <button
                                onClick={() => handleTabChange('4w')}
                                className={`relative px-4 py-2 text-sm font-normal transition-all duration-300 ${activeTab === '4w'
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                4-Wheeler
                                <span
                                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-white transition-all duration-300 ${activeTab === '4w' ? 'w-[75%]' : 'w-0'
                                        }`}
                                />
                            </button>
                            <button
                                onClick={() => handleTabChange('2w')}
                                className={`relative px-4 py-2 text-sm font-normal transition-all duration-300 ${activeTab === '2w'
                                    ? 'text-white'
                                    : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                2-Wheeler
                                <span
                                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-white transition-all duration-300 ${activeTab === '2w' ? 'w-[75%]' : 'w-0'
                                        }`}
                                />
                            </button>
                        </div>

                        <Link
                            to={`${ROUTES.CATEGORY_LISTING}?type=${activeTab}`}
                            className="flex items-center gap-2 text-white/70 hover:text-[#ffb200] font-normal text-sm transition-colors whitespace-nowrap"
                        >
                            View All <span className="material-symbols-outlined text-base">arrow_outward</span>
                        </Link>
                    </div>
                </div>

                {/* Mobile "Attractive Header" (MODERNIZED - Mobile Only) */}
                <div className="flex md:hidden flex-col items-center text-center mb-10 px-6">
                    <span className="text-[#ffb200] font-bold text-[10px] tracking-[0.3em] uppercase block mb-3 opacity-80">
                        Signature Collections
                    </span>
                    <h2 className="text-4xl font-bold text-white leading-tight">
                        The <span className="text-[#ffb200]">Autoform</span> Edition
                    </h2>
                    <p className="text-white/50 text-sm mt-3 font-light leading-relaxed max-w-[280px]">
                        Meticulously crafted interior perfection for your ride.
                    </p>

                    {/* Mobile Text-Based Underline Toggle (RESTRICTED TO MOBILE) */}
                    <div className=" flex items-center justify-center">
                        <button
                            onClick={() => handleTabChange('4w')}
                            className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeTab === '4w' ? 'text-white' : 'text-white/40'}`}
                        >
                            4-Wheeler
                            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#ffb200] transition-all duration-300 ${activeTab === '4w' ? 'w-[75%]' : 'w-0'}`} />
                        </button>
                        <button
                            onClick={() => handleTabChange('2w')}
                            className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeTab === '2w' ? 'text-white' : 'text-white/40'}`}
                        >
                            2-Wheeler
                            <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#ffb200] transition-all duration-300 ${activeTab === '2w' ? 'w-[75%]' : 'w-0'}`} />
                        </button>
                    </div>
                </div>

                {/* Categories Carousel */}
                <div className="relative group/swiper px-0">
                    <Swiper
                        key={activeTab}
                        modules={[Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        loop={false}
                        observer={true}
                        observeParents={true}
                        watchSlidesProgress={true}
                        onSwiper={setSwiperRef}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 24, loop: false },
                            1024: { slidesPerView: 3, spaceBetween: 24, loop: false },
                        }}
                        className="categorySwiper"
                    >
                        {currentCategories.map((cat) => (
                            <SwiperSlide key={cat.id}>
                                <div className="relative h-[580px] md:h-[520px] rounded-3xl overflow-hidden group shadow-2xl transition-transform duration-500 category-card-mobile mx-4 md:mx-0">
                                    <img
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                                        src={cat.image}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-500">
                                        <h3 className="text-white text-3xl md:text-3xl font-bold mb-3 tracking-tight">
                                            {cat.name}
                                        </h3>
                                        <p className="text-gray-300 text-base md:text-sm mb-8 leading-relaxed max-w-[95%] font-light">
                                            {cat.description}
                                        </p>
                                        <Link
                                            to={cat.link}
                                            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 hover:bg-[#ffb200] hover:text-black hover:border-[#ffb200] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-sm font-bold transition-all backdrop-blur-md active:scale-95 group/btn"
                                        >
                                            Explore Range 
                                            <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="md:hidden flex justify-center mt-6">
                    <Link
                        to={`${ROUTES.CATEGORY_LISTING}?type=${activeTab}`}
                        className="flex items-center gap-2 text-white/50 hover:text-[#ffb200] font-normal text-sm transition-colors"
                    >
                        View All Categories <span className="material-symbols-outlined text-base">arrow_outward</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ExploreCategories;
