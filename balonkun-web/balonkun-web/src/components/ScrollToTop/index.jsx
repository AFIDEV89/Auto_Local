import React, { useState, useEffect } from 'react';
import '../../assets/scss/scroll-to-top.scss';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // Show button when page is scrolled up to a certain distance
    const toggleVisibility = () => {
        if (window.pageYOffset > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top coordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        setIsRunning(true);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // Animation duration - matching the shake effect
        setTimeout(() => {
            setIsRunning(false);
        }, 500);
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div
            id="scroll-to-top"
            className={`${isVisible ? 'show-car' : ''} ${isRunning ? 'car-run' : ''}`}
            onClick={scrollToTop}
        >
            <div className="headlight headlight-left"></div>
            <div className="headlight headlight-right"></div>
        </div>
    );
};

export default ScrollToTop;
