import React, { useEffect, useRef, useState } from "react";
import { img1, img2, img3, img4, img5, img6, img7, img8, img9 } from "@assets/images";

const SocialUpdatesDesktop = ({ title }) => {
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
        <section className="py-12 bg-[#fcfcfc]">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header Section */}
                <div className="max-w-2xl text-left mb-6 pb-4 border-b border-gray-100">
                    <span className="text-[#ffb200] font-black text-xs uppercase tracking-[0.3em] mb-3 block">Community Hub</span>
                    <div className="relative inline-block mb-3" ref={headerRef}>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] tracking-tight leading-none">
                            Social Connect.
                        </h2>
                        <div 
                            className={`absolute -bottom-2 left-0 h-[4px] bg-[#ffb200] rounded-full transition-all duration-1000 ease-out origin-left ${
                                isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
                            }`}
                        ></div>
                    </div>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed mt-2">
                        Stay updated with our latest style trends and luxury car collections.
                    </p>
                </div>

            {/* Restored Original Grid Layout */}
            <div className="flex justify-center flex-wrap gap-0">
                {/* Column 1 */}
                <div className="w-[400px] flex flex-wrap">
                    <div className="w-full h-[400px]">
                        <a href="https://www.instagram.com/reel/C2aj5lRhYLZ/?igsh=b2F3c2gyY25reWZ0" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img1} alt="social" />
                        </a>
                    </div>
                    <div className="w-1/2 h-[200px]">
                        <a href="https://www.instagram.com/reel/C4iSJJUB8lE/?igsh=MXFyZDdxdm5hMmZuZg==" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img2} alt="social" />
                        </a>
                    </div>
                    <div className="w-1/2 h-[200px]">
                        <a href="https://www.instagram.com/reel/C7lTVtANev-/?igsh=cGY0czg3d29udXk3" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img3} alt="social" />
                        </a>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="w-[400px] flex flex-wrap">
                    <div className="w-1/2 h-[200px]">
                        <a href="https://www.instagram.com/reel/C4P0D25rmbn/?igsh=bjFocWpwNjlrNzA1" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img4} alt="social" />
                        </a>
                    </div>
                    <div className="w-1/2 h-[200px]">
                        <a href="https://www.instagram.com/reel/C2XF091L-M3/?igsh=MnhpdWdtbTBkcmUx" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img5} alt="social" />
                        </a>
                    </div>
                    <div className="w-full h-[400px]">
                        <a href="https://www.instagram.com/reel/C3DDo6DBftO/?igsh=d3o1dDkwbTJ4N3Fz" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img6} alt="social" />
                        </a>
                    </div>
                </div>

                {/* Column 3 */}
                <div className="w-[400px] flex flex-wrap">
                    <div className="w-full h-[400px]">
                        <a href="https://www.instagram.com/reel/C6x_XLSNRBM/?igsh=dGQ1dnVjMnE3ajM4" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img7} alt="social" />
                        </a>
                    </div>
                    <div className="w-1/2 h-[200px]">
                        <a href="https://www.instagram.com/reel/C5N_zyQhmtD/?igsh=MWNraHR3eG5weGx6bg==" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img8} alt="social" />
                        </a>
                    </div>
                    <div className="w-1/2 h-[200px]">
                        <a href="https://www.instagram.com/reel/C8CeEThBso4/?igsh=MTFrNmZzdW1yeXJ0aw==" target="_blank" rel="noreferrer">
                            <img className="w-full h-full object-cover" src={img9} alt="social" />
                        </a>
                    </div>
                </div>
            </div>
            </div>
        </section>
    );
};

export default SocialUpdatesDesktop;