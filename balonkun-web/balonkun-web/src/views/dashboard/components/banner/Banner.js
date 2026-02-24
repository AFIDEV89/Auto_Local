import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./banner.scss"; // Assuming your SCSS file is named banner.scss

const Banner = ({ bannerList = [] }) => {
    const [isActive, setIsActive] = useState(0);
    const navigate = useNavigate();
    const intervalRef = useRef(null);
    const touchStartX = useRef(null);

    useEffect(() => {
        // Auto-slide functionality (optional)
        const startAutoSlide = () => {
            intervalRef.current = setInterval(() => {
                setIsActive((prevIndex) => (prevIndex + 1) % bannerList.length);
            }, 5000); // Change slide every 5 seconds
        };

        const stopAutoSlide = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

        if (bannerList.length > 1) {
            startAutoSlide();

            // Clean up the interval on component unmount and when the user interacts
            return () => {
                stopAutoSlide();
            };
        }
    }, [bannerList.length]);

    const moveNext = () => {
        setIsActive((prevIndex) => (prevIndex + 1) % bannerList.length);
    };

    const movePrev = () => {
        setIsActive((prevIndex) => (prevIndex === 0 ? bannerList.length - 1 : prevIndex - 1));
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!touchStartX.current) {
            return;
        }

        const touchMoveX = e.touches[0].clientX;
        const deltaX = touchStartX.current - touchMoveX;

        // You can adjust the sensitivity (e.g., deltaX threshold)
        if (deltaX > 50) {
            moveNext();
            touchStartX.current = null; // Reset touch start
        } else if (deltaX < -50) {
            movePrev();
            touchStartX.current = null; // Reset touch start
        }
    };

    const handleTouchEnd = () => {
        touchStartX.current = null; // Ensure touch start is reset even if no significant move
    };

    if (!bannerList || bannerList.length === 0) {
        return (
            <section className="banner-2">
                <div className="skeleton-loader">
                    <img src="/assets/images/loader-image.png" alt="Loading Banner" />
                </div>
            </section>
        );
    }

    return (
        <section
            className="banner-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {bannerList.length > 1 && (
                <>
                    <button className="swiper-button-prev" onClick={movePrev}>
                        {/* You can use an icon here, e.g., <i className="fas fa-chevron-left"></i> */}
                        &lt;
                    </button>
                    <button className="swiper-button-next" onClick={moveNext}>
                        {/* You can use an icon here, e.g., <i className="fas fa-chevron-right"></i> */}
                        &gt;
                    </button>
                </>
            )}

            {bannerList.map((item, index) => (
                <div
                    key={index}
                    className={`slide ${isActive === index ? "active" : ""}`}
                    style={{
                        backgroundImage: `url("${encodeURI(item.image)}")`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: isActive === index ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                        transition: 'opacity 0.5s ease-in-out',
                        opacity: isActive === index ? 1 : 0,
                        position: 'absolute', // Ensure slides are positioned on top of each other
                        top: 0,
                        left: 0,
                    }}
                >
                    {isActive === index && (
                        <div className="slide-content">
                            <div
                                className="legend"
                                dangerouslySetInnerHTML={{ __html: item.title }}
                            />
                            {item.url && (
                                <button
                                    className="shop-now-btn"
                                    onClick={() => navigate(item.url)}
                                >
                                    SHOP NOW
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {bannerList.length > 1 && (
                <div className="pagination">
                    {bannerList.map((_, index) => (
                        <span
                            key={index}
                            className={isActive === index ? "active" : ""}
                            onClick={() => setIsActive(index)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Banner;