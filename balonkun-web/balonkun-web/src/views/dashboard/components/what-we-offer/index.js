import WhatWeOfferList from "./MockData";
import WhatWeOfferVideo from "../../../../assets/images/What we offer GIF.webm";
import CompanyLogo from "../../../../assets/images/balonkun-logo.png";

const OverlayPoints = [
    { id: 1, title: 'Expert Support', subtitle: '24/7 Dedicated Assistance', icon: 'support_agent' },
    { id: 2, title: 'Perfect Fit', subtitle: 'Laser-Cut Precision', icon: 'fit_screen' },
    { id: 3, title: '100% Custom', subtitle: 'Tailored to Your Style', icon: 'settings_suggest' },
    { id: 4, title: 'Premium Quality', subtitle: 'Best-in-Class Materials', icon: 'verified' }
];

const WhatWeOffer = () => {
    return (
        <section className="w-full px-6 lg:px-12 pt-24 pb-12 bg-white">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
                <div className="w-full lg:w-1/2 h-[500px] lg:h-[600px] rounded-3xl overflow-hidden relative group">
                    <video 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={WhatWeOfferVideo} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                    
                    {/* Interactive Reveal Labels (MODERNIZED - Now Visible on Mobile) */}
                    <div className="absolute inset-y-0 left-0 flex flex-col justify-center gap-6 md:gap-12 p-6 md:p-10 z-20">
                        {OverlayPoints.map((point) => (
                            <div key={point.id} className="flex items-center gap-4 md:gap-8 group/item cursor-default">
                                <div className="size-10 md:size-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl md:rounded-2xl flex items-center justify-center text-[#ffb200] transition-all duration-500 group-hover/item:scale-110 group-hover/item:bg-[#ffb200] group-hover/item:text-black group-hover/item:shadow-[0_0_30px_rgba(255,178,0,0.3)]">
                                    <span className="material-symbols-outlined text-2xl md:text-3xl">{point.icon}</span>
                                </div>
                                <div className="transition-all duration-500 translate-x-0 cursor-default">
                                    <h4 className="text-[#ffb200] text-sm md:text-lg font-black uppercase tracking-tight leading-none mb-1 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-500 group-hover/item:scale-105">
                                        {point.title}
                                    </h4>
                                    <p className="text-white/80 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
                                        {point.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Top Left Logo Overlay (Responsive) */}
                    <div className="absolute top-4 left-6 md:top-5 md:left-8 pointer-events-none z-10">
                        <img src={CompanyLogo} alt="Balonkun Logo" className="w-16 md:w-24 object-contain grayscale brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none"></div>
                </div>
                <div className="w-full lg:w-1/2">
                    {/* Desktop Header (RESTORED - Zero Impact) */}
                    <div className="hidden lg:block">
                        <span className="text-[#ffb200] font-bold tracking-wider uppercase mb-2 block">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-slate-900 mb-10">
                            Experience Perfection in Every Detail.
                        </h2>
                    </div>

                    {/* Mobile Header (MODERNIZED - Mobile Only) */}
                    <div className="lg:hidden text-center mb-10">
                        <span className="text-[#ffb200] font-black tracking-[0.3em] uppercase mb-4 block opacity-80 text-[10px]">
                            Why Choose Us
                        </span>
                        <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                            Experience Perfection in Every Detail.
                            <div className="w-12 h-1 bg-[#ffb200] rounded-full mx-auto mt-6" />
                        </h2>
                    </div>

                    <div className="space-y-8">
                        {WhatWeOfferList.map((offer) => {
                            const { id, icon, title, desc } = offer;
                            return (
                                <div key={id}>
                                    {/* Desktop List Item (RESTORED - Zero Impact) */}
                                    <div className="hidden lg:flex gap-4">
                                        <div className="flex-shrink-0 size-12 rounded-full bg-[#ffb200]/10 flex items-center justify-center text-[#ffb200]">
                                            <span className="material-symbols-outlined text-2xl">{icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                                            <p className="text-gray-600">{desc}</p>
                                        </div>
                                    </div>

                                    {/* Mobile List Item (MODERNIZED - Mobile Only) */}
                                    <div className="lg:hidden flex flex-col items-center text-center gap-2 mb-8 last:mb-0">
                                        <div className="flex-shrink-0 size-12 rounded-full bg-[#ffb200]/10 flex items-center justify-center text-[#ffb200] mx-auto">
                                            <span className="material-symbols-outlined text-2xl">{icon}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
                                            <p className="text-gray-600 text-sm leading-snug">{desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhatWeOffer;
