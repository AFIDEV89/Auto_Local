import React from "react";
import { Helmet } from "react-helmet";

const Career = () => {
    return (
        <div className="static-page-container">
            <Helmet>
                <title>Careers | Join Autoform India</title>
                <meta name='description' content="Discover exciting career opportunities at Autoform India. Join our team and be part of an innovative automotive industry leader." />
            </Helmet>

            <section className="static-hero">
                <h1>CAREERS</h1>
                <p className="hero-subtitle">Join the Autoform India Family</p>
            </section>

            <div className="max-w-[1200px] mx-auto px-4 md:px-0">
                <div className="static-card text-center py-20">
                    <div className="w-20 h-20 bg-[#ffb200]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
                        <span className="material-symbols-outlined text-[#ffb200] text-4xl">work</span>
                    </div>
                    
                    <h3 className="border-l-0 pl-0 mt-0 text-3xl">WORK WITH US</h3>
                    
                    <p className="max-w-2xl mx-auto mt-6 text-lg">
                        We are always looking for passionate, driven, and innovative individuals to join our team and help shape the future of the automotive accessories industry. 
                        Whether you're an expert in manufacturing, marketing, or design, we'd love to hear from you.
                    </p>

                    <div className="section-divider max-w-xs mx-auto my-12"></div>

                    <div className="bg-slate-50 p-10 rounded-[32px] border border-slate-100 inline-block px-12 transition-transform hover:scale-[1.02]">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Current Opportunities</p>
                        <p className="text-slate-600 mb-6 font-medium">Please send your updated CV and portfolio to:</p>
                        <a 
                            href="mailto:careers@autoformindia.com" 
                            className="text-2xl md:text-3xl font-black text-[#ffb200] hover:text-[#0f172a] transition-all duration-300 decoration-[#ffb200]/30 underline underline-offset-8"
                        >
                            careers@autoformindia.com
                        </a>
                    </div>

                    <p className="mt-16 text-slate-400 text-sm">
                        Autoform India is an equal opportunity employer. 
                        We celebrate diversity and are committed to creating an inclusive environment for all employees.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Career;