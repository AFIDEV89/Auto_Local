import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { NAVBAR_LIST } from '../dashboard/components/nav-bar/Config';
import '@assets/scss/category-listing.scss';

// Importing essential shared assets
import {
    seatCoversExplore,
    carMatsExplore,
    accessoriesExplore,
    twoWheelerSeatCoversExplore,
    twoWheelerAccessoriesExplore,
    twoWheelerBodyCoversExplore,
    lightUtilityExplore,
    audioSecurityExplore,
    careFragranceExplore
} from '@assets/images';

const CategoryListing = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('4w');

    // Sync state with URL parameter
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get('type');
        if (type === '4w' || type === '2w') {
            setActiveTab(type);
        }
    }, [location]);

    // Enhanced Category Data derived from Navbar Config and premium assets
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
            link: '/products?vid=1&pcid=11'
        },
        {
            id: 16,
            name: 'Scooty Body Covers',
            description: 'Tailored body covers for scooters, built to withstand all weather.',
            image: twoWheelerBodyCoversExplore,
            link: '/scooty-body-covers'
        },
        {
            id: 17,
            name: 'Tank Covers',
            description: 'Protective tank covers that guard against scratches and wear.',
            image: twoWheelerAccessoriesExplore,
            link: '/tank-covers'
        },
        {
            id: 18,
            name: 'Mobile Holders',
            description: 'Sturdy and secure mobile mounts for hands-free navigation.',
            image: twoWheelerAccessoriesExplore,
            link: '/mobile-holders'
        },
        {
            id: 19,
            name: 'Bags',
            description: 'Durable riding bags and saddlebags for storage on the go.',
            image: twoWheelerAccessoriesExplore,
            link: '/bags'
        },
        {
            id: 20,
            name: 'Microfibre Cleaning Cloth',
            description: 'Premium microfibre cloths for a scratch-free, spotless clean.',
            image: careFragranceExplore,
            link: '/microfibre-cleaning-cloth'
        },
        {
            id: 21,
            name: 'Bungee Ropes',
            description: 'Heavy-duty elastic cords for securing luggage on your ride.',
            image: twoWheelerAccessoriesExplore,
            link: '/bungee-ropes'
        },
        {
            id: 22,
            name: '2W Mats',
            description: 'Precision fit mats designed to protect your two-wheeler in style.',
            image: carMatsExplore,
            link: '/products?vid=1&pcid=12'
        }
    ];

    const currentCategories = activeTab === '4w' ? categories4w : categories2w;

    return (
        <div className="category-listing-page" style={{ overflowX: 'hidden' }}>
            <div className="premium-hero">
                <Container>
                    <div className="hero-content">
                        <span className="brand-tag">Signature Collections</span>
                        <h1 className="hero-title">
                            EXPLORE <span className="highlight">CATEGORIES</span>
                        </h1>
                        <p className="hero-subtitle">
                            Meticulously crafted perfection for every journey. 
                            Discover our premium range of automotive essentials.
                        </p>
                    </div>
                </Container>
                <div className="accent-line"></div>
            </div>

            <div className="tab-navigation shadow-glass">
                <Container>
                    <div className="tab-toggle">
                        <button 
                            className={`tab-btn ${activeTab === '4w' ? 'active' : ''}`}
                            onClick={() => setActiveTab('4w')}
                        >
                            4-Wheeler
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === '2w' ? 'active' : ''}`}
                            onClick={() => setActiveTab('2w')}
                        >
                            2-Wheeler
                        </button>
                    </div>
                </Container>
            </div>

            <section className="category-section">
                <Container>
                    <Row className="g-4">
                        {currentCategories.map((cat) => (
                            <Col lg={4} md={6} key={cat.id}>
                                <div className="category-card shadow-glass">
                                    <div className="card-image">
                                        <img src={cat.image} alt={cat.name} loading="lazy" />
                                        <div className="image-overlay"></div>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="card-title">{cat.name}</h3>
                                        <p className="card-text">{cat.description}</p>
                                        
                                        <Link to={cat.link} className="btn-explore">
                                            Explore Range <span className="material-symbols-outlined">arrow_forward</span>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default CategoryListing;
