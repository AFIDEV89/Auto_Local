import React, { useEffect, useState, useRef } from "react";
import anime from 'animejs';
import { Container } from "reactstrap";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Box, Grid } from "@mui/material";
import { getDataApi } from "@services/ApiCaller";
import { Link } from "react-router-dom";
import { FaLayerGroup, FaShieldAlt, FaAward, FaStar } from 'react-icons/fa';
import { GiCarSeat, GiSpeaker, GiFogLight, GiSpray, GiCarWheel } from 'react-icons/gi';
import { FiWind, FiLayers, FiSettings, FiSpeaker, FiSun, FiActivity } from 'react-icons/fi';
import { FranchiseModal } from '@views/components';

// Importing Premium Assets
import { 
    seatCoversExplore, 
    carMatsExplore, 
    accessoriesExplore, 
    lightUtilityExplore, 
    audioSecurityExplore,
    careFragranceExplore,
    storeLocatorBannerPremium,
    logo as brandLogo
} from "@assets/images";

const CENTER_INDIA = [20.5937, 78.9629]

const AnimatedNumber = ({ value, suffix = "" }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (isNaN(end)) return;
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <>{count}{suffix}</>;
};

const TextScramble = ({ text }) => {
    const [display, setDisplay] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#";
    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplay(text.split("").map((char, index) => {
                if (char === " ") return " ";
                if (index < iteration) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(""));
            if (iteration >= text.length) clearInterval(interval);
            iteration += 1/3;
        }, 30);
        return () => clearInterval(interval);
    }, [text]);
    return <>{display}</>;
};


const RetailFranchise = () => {
    const [storesLocation, setStoresLocation] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const fetchStoreLocation = async (location) => {
        const result = await getDataApi({ path: 'store/get-list', location });
        if (result?.data?.data) {

            const locations = result.data.data.map(e => ({
                id: e.id,
                name: e.name,
                lat: Number((e.address.latitude || "").replace(",", ".")),
                long: Number((e.address.longitude || "").replace(",", ".")),
                address: e.address?.street_address ?? ""
            })).filter(store => store.lat && store.long);

            setStoresLocation(locations)
        }
    };

    useEffect(() => {
        fetchStoreLocation()
    }, [])

    const solutionRefs = useRef([]);
    const sectionRef = useRef(null);

    const solutions = [
        { image: seatCoversExplore, title: "Seat Covers", subtitle: "Precision Tailored Comfort", path: "/car-seat-covers" },
        { image: accessoriesExplore, title: "Accessories", subtitle: "Bespoke Cabin Luxury", path: "/comfort-accessories" },
        { image: carMatsExplore, title: "Matts", subtitle: "All-Weather Elite Protection", path: "/autoform-car-mats" },
        { image: audioSecurityExplore, title: "Audio & Security", subtitle: "Concierge Safety & Sound", path: "/products?vid=2&pcid=13" },
        { image: lightUtilityExplore, title: "Light & Utility", subtitle: "Visionary Illumination", path: "/utilities" },
        { image: careFragranceExplore, title: "Care & Fragrance", subtitle: "Sensory Rejuvenation", path: "/car-care" },
    ];

    useEffect(() => {
        if (!sectionRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                anime({
                    targets: solutionRefs.current,
                    translateY: [50, 0],
                    opacity: [0, 1],
                    scale: [0.95, 1],
                    delay: anime.stagger(100),
                    easing: 'easeOutElastic(1, .8)',
                    duration: 1200
                });
                observer.unobserve(sectionRef.current);
            }
        }, { threshold: 0.1 });

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleMouseMove = (e, index) => {
        const card = solutionRefs.current[index];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        // Tilt Logic
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (centerY - y) / 10;
        const rotateY = (x - centerX) / 10;
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    const handleMouseLeave = (index) => {
        const card = solutionRefs.current[index];
        if (card) {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        }
    };

    return (
        <>
            <Box className="franchiseHero">
                <div className="heroBg">
                    <img src={storeLocatorBannerPremium} alt="Autoform Prestige Background" />
                </div>
                
                <div className="heroBadge">
                    <span className="statusDot"></span>
                    Retail Franchise
                </div>

                <div className="heroContent">
                    <div className="brandFocus">
                        <div className="heroLogo">
                            <img src={brandLogo} alt="Autoform Logo" />
                        </div>
                        <h1 className="mainTagline">
                            India’s No. 1  <br/>
                            <span className="highlight">Automotive Interiors</span>
                        </h1>
                    </div>
                    
                    <div className="heroCTA">
                        <button 
                            className="glassCTA"
                            onClick={toggleModal}
                        >
                            <span className="material-symbols-outlined !text-xl font-black">handshake</span>
                            Become a Franchise
                        </button>
                    </div>
                </div>

                <div className="heroStats">
                    <div className="statBlock">
                        <span className="statLabel">Heritage</span>
                        <span className="statValue">
                            <AnimatedNumber value="35" suffix="+ Years" />
                        </span>
                    </div>
                    <div className="statBlock">
                        <span className="statLabel">Network</span>
                        <span className="statValue">
                            <AnimatedNumber value="14" suffix="+ OEMs" />
                        </span>
                    </div>
                    <div className="statBlock">
                        <span className="statLabel">Scale</span>
                        <span className="statValue">
                            <TextScramble text="600k Sq Ft" />
                        </span>
                    </div>
                    <div className="statBlock">
                        <span className="statLabel">Quality</span>
                        <span className="statValue">
                            <TextScramble text="ISO/TS 16949" />
                        </span>
                    </div>
                </div>
            </Box>

            <FranchiseModal isOpen={isModalOpen} toggleModal={toggleModal} />

            <Container className="main-content pt-5">
                <Box className="brandNarrative mt-5">
                    <div className="glassFeatureCard">
                        <h2 className="franchiseSectionTitle text-center">
                            <span className="highlight">AFAC India Pvt. Ltd.</span> <br/>
                            A Legacy of Precision & Automotive Leadership
                        </h2>
                        
                        <Grid container spacing={4} className="narrativeGrid">
                            <Grid item md={6} sm={12}>
                                <div className="narrativeItem">
                                    <div className="itemIcon">
                                        <FaAward />
                                    </div>
                                    <p className="narrativeText">
                                        AFAC India stands as a renowned leader in the automotive interiors industry, specialising in premium car seat covers. With a <span className="brand-accent">35-year legacy</span>, we are dedicated to providing top-tier products that meet the highest international standards of quality.
                                    </p>
                                </div>
                            </Grid>
                            <Grid item md={6} sm={12}>
                                <div className="narrativeItem">
                                    <div className="itemIcon">
                                        <FaShieldAlt />
                                    </div>
                                    <p className="narrativeText">
                                        Our world-class manufacturing plant in <span className="brand-accent">Dehradun, Uttarakhand</span>, spans a massive 600,000 square feet. As an <span className="brand-accent">ISO/TS 16949 certified leader</span>, we adhere to rigorous quality management systems recognised globally.
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Box>

                <h2 className="franchiseSectionTitle mt-0">Precision Interiors, <span className="highlight">Infinite Solutions</span></h2>
                <div className="solutionGrid" ref={sectionRef}>
                    {solutions.map((item, index) => (
                        <Link 
                            to={item.path} 
                            key={index} 
                            className="solutionLink"
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                        >
                            <div 
                                className="solutionItem" 
                                ref={el => solutionRefs.current[index] = el}
                            >
                                <div className="cardGlow"></div>
                                <div className="iconWrapper">
                                    <img src={item.image} alt={item.title} className="solutionImage" />
                                </div>
                                <div className="cardContent">
                                    <h3 className="solutionTitle">{item.title}</h3>
                                    <p className="solutionSubtitle">{item.subtitle}</p>
                                    <div className="discoveryCTA">
                                        Explore Collection <span className="material-symbols-outlined">arrow_forward</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Box className="manufacturingExcellence mt-5">
                    <div className="glassFeatureCard industrial">
                        <h2 className="franchiseSectionTitle text-center">
                            State-of-the-Art <span className="highlight">Manufacturing Excellence</span>
                        </h2>
                        <p className="sectionSubtitle text-center mb-5">Driven by International Standards & Precision Engineering</p>
                        
                        <Grid container spacing={3} className="techGrid">
                            {[
                                { icon: <FiSettings />, title: "German Technology", desc: "Advanced CNC Auto Cutters for Millimeter Precision" },
                                { icon: <FiActivity />, title: "Japanese Precision", desc: "Automatic Stitching Machines for Superior Durability" },
                                { icon: <FiLayers />, title: "Massive Scale", desc: "600,000 SQ FT World-Class Production Facility" }
                            ].map((tech, i) => (
                                <Grid item md={4} sm={6} key={i}>
                                    <div className="techCard">
                                        <div className="techIcon">{tech.icon}</div>
                                        <h4>{tech.title}</h4>
                                        <p>{tech.desc}</p>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </Box>

                <h2 className="franchiseSectionTitle mt-5">Unmatched <span className="highlight">Quality Assurance</span></h2>
                <div className="uspGrid mt-4">
                    {[
                        { label: "14+ OEM Approved", desc: "Only Brand Approved with 14 Global Auto Companies", icon: <FaStar /> },
                        { label: "2-Year Warranty", desc: "Quality Assurance with 24x7 Post-Sales Service", icon: <FaShieldAlt /> },
                        { label: "Material Safety", desc: "No Hazardous Materials & Zero Chemical Odour", icon: <FaLayerGroup /> },
                        { label: "Hygienic Grade", desc: "Anti-Bacterial and Anti-Fungus Certified Materials", icon: <FiSun /> },
                        { label: "Original Fitment", desc: "Multiple Tape Wires Used for Original Bucket Fitment", icon: <FiWind /> },
                        { label: "Premium Feel", desc: "Automotive Grade PU/PVC with High Foam Strength", icon: <FiLayers /> }
                    ].map((usp, i) => (
                        <div className="uspBadge" key={i}>
                            <div className="uspIcon">{usp.icon}</div>
                            <div className="uspInfo">
                                <h5>{usp.label}</h5>
                                <p>{usp.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <h2 className="franchiseSectionTitle mt-5">Our Nationwide Network</h2>
                <Box className="mapWrapper">
                    <MapContainer center={CENTER_INDIA} zoom={4.5} scrollWheelZoom>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {
                            storesLocation.map(store => {
                                return (
                                    <Marker position={[store.lat, store.long]} key={store.id}>
                                        <Popup>
                                            <p className="storeName">{store.name}</p>
                                            <p className="storeAddress">{store.address}</p>
                                        </Popup>
                                    </Marker>
                                )
                            })
                        }
                    </MapContainer>
                </Box>
            </Container>
        </>
    )
}

export default RetailFranchise;