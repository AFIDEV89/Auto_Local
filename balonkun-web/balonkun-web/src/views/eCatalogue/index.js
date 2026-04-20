import React from 'react';
import { Helmet } from 'react-helmet';

const Catalouge = () => {
    return (
        <div className="static-page-container">
            <Helmet>
                <title>Catalouge | Autoform India</title>
                <meta name='description' content="Explore our premium collection of car seat covers and accessories in our latest Catalouge. Flip through for inspiration." />
            </Helmet>

            <section className="static-hero !pb-10">
                <h1>CATALOUGE</h1>
                <p className="hero-subtitle">Visual Experience & Collections</p>
                <div className="max-w-[800px] mx-auto mt-4 px-4">
                    <p className="text-slate-500 text-lg leading-relaxed">
                        Dive into the world of premium automotive aesthetics. Our digital catalouge 
                        showcases the perfect blend of craftsmanship, comfort, and style designed 
                        exclusively for your vehicle.
                    </p>
                </div>
            </section>

            <div className="w-full mb-20">
                <div className="overflow-hidden border-none shadow-sm">
                    <div className="ratio ratio-16x9" style={{ minHeight: '85vh', backgroundColor: '#f8fafc' }}>
                        <iframe
                            allowFullScreen={true}
                            allow="clipboard-write"
                            scrolling="no"
                            className="fp-iframe w-full h-full"
                            src="https://heyzine.com/flip-book/ec6e735b83.html"
                            style={{ border: 'none', minHeight: window.innerWidth < 768 ? '65vh' : '85vh' }}
                            title="Catalouge Flipbook"
                        ></iframe>
                    </div>
                </div>
                
                <div className="mt-8 text-center px-4">
                    <p className="text-slate-400 italic text-sm">
                        * Click on the corners or use the navigation bar to flip through the pages.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Catalouge;

