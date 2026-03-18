import React, { useState } from 'react';
import { Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/constants';

// Importing generated premium assets via centralized index
import {
    seatCoversExplore,
    carMatsExplore,
    accessoriesExplore,
    twoWheelerSeatCoversExplore,
    twoWheelerAccessoriesExplore,
    twoWheelerBodyCoversExplore
} from '@assets/images';

const ExploreCategories = () => {
    const [activeTab, setActiveTab] = useState('4w');

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
            name: '3D/7D Mats',
            description: 'Precision fit mats designed to protect your vehicle\'s floor in style.',
            image: carMatsExplore,
            link: '/autoform-car-mats'
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
            name: 'Bike Accessories',
            description: 'Essential add-ons to enhance your ride\'s comfort and style.',
            image: twoWheelerAccessoriesExplore,
            link: '/car-accessories'
        },
        {
            id: 6,
            name: 'Body Covers',
            description: 'All-weather protection to keep your bike looking pristine.',
            image: twoWheelerBodyCoversExplore,
            link: '/car-accessories'
        }
    ];

    const currentCategories = activeTab === '4w' ? categories4w : categories2w;

    return (
        <section className="relative bg-[#1A1A1A] pt-12 pb-20 px-4 md:px-0 mt-[-20px] overflow-hidden">
            {/* Cinematic Spotlight Highlight */}
            <div
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#ffb200]/10 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            />

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <span className="text-[#ffb200] font-bold text-sm tracking-[0.2em] uppercase block mb-2">
                            Our Products
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Explore <span className="text-[#ffb200]">Categories</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Toggle — subtle, no yellow */}
                        <div className="hidden md:flex items-center gap-0">
                            <button
                                onClick={() => setActiveTab('4w')}
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
                                onClick={() => setActiveTab('2w')}
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
                            to={ROUTES.CATEGORY_LISTING}
                            className="hidden md:flex items-center gap-2 text-white/70 hover:text-[#ffb200] font-normal text-sm transition-colors whitespace-nowrap"
                        >
                            View All Categories <span className="material-symbols-outlined text-base">arrow_outward</span>
                        </Link>
                    </div>
                </div>

                {/* Categories Grid */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500`}
                >
                    {currentCategories.map((cat, index) => (
                        <div
                            key={cat.id}
                            className="relative h-[480px] rounded-2xl overflow-hidden group"
                        >
                            <img
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                                src={cat.image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-7 w-full">
                                <h3 className="text-white text-2xl font-bold mb-2">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                                    {cat.description}
                                </p>
                                <Link
                                    to={cat.link}
                                    className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all backdrop-blur-md shadow-lg active:scale-95"
                                >
                                    Explore Range <span className="material-symbols-outlined text-base">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreCategories;
