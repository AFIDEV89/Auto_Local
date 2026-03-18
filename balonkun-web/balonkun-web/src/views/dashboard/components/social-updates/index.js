import React, { useEffect, useRef, useState } from "react";
import { Container } from "reactstrap";
import Masonry from '@mui/lab/Masonry';
import { img1, img2, img3, img4, img5, img6, img7, img8, img9 } from "@assets/images";

const data = [
    { href: "https://www.instagram.com/reel/C2aj5lRhYLZ/?igsh=b2F3c2gyY25reWZ0", url: img1, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C4iSJJUB8lE/?igsh=MXFyZDdxdm5hMmZuZg==", url: img2, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C7lTVtANev-/?igsh=cGY0czg3d29udXk3", url: img3, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C4P0D25rmbn/?igsh=bjFocWpwNjlrNzA1", url: img4, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C2XF091L-M3/?igsh=MnhpdWdtbTBkcmUx", url: img5, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C3DDo6DBftO/?igsh=d3o1dDkwbTJ4N3Fz", url: img6, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C6x_XLSNRBM/?igsh=dGQ1dnVjMnE3ajM4", url: img7, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C5N_zyQhmtD/?igsh=MWNraHR3eG5weGx6bg==", url: img8, alt: "Social connect" },
    { href: "https://www.instagram.com/reel/C8CeEThBso4/?igsh=MTFrNmZzdW1yeXJ0aw==", url: img9, alt: "Social connect" },
];

const SocialUpdates = ({ title }) => {
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

            <Container className="p-0">
                <Masonry columns={{ xs: 3, md: 4 }} spacing={0}>
                    {data.map((item, index) => (
                        <a key={index} href={item.href} target="_blank" rel="noreferrer">
                            <img className="w-full block" src={item.url} alt={item.alt} loading="lazy" />
                        </a>
                    ))}
                </Masonry>
            </Container>
            </div>
        </section>
    );
};

export default SocialUpdates;