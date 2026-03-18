import React, { useState } from 'react';
import { FranchiseModal } from '@views/components';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@shared/constants';

const DealerNetwork = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <section className="bg-brand-green py-32 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-full md:w-1/2 opacity-20 pointer-events-none">
                {/* Abstract Map Graphic */}
                <img
                    alt="Abstract map of India representing network coverage"
                    className="w-full h-full object-cover mix-blend-overlay"
                    data-location="India Map"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLJkGksqZ_frZ4IHwQzrVgo7nFq6TYLpYyuqoK1vK2z7fWy_h-BRSthtIyhiI_HNu4sMKkMIXEKvoV73R5rMej3vzDY5Ar-2BMizaAJ11vqWXb0lJkfD-sYGBk1A63TNHdXQ2k6z31r9xRDhcmGVpAoUbNUoZvo3o0q3Pj5QAJKaT5JTz4HRMWQrgiMJ5ZafiPhoWEzaj1USINud4wKAH5gnVKKmsRYDXOlpSajb2Ma3hH3LqFDPXPdqmuxq-jnf0umt5KedeQ1Sk"
                />
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Nationwide Franchise Network
                    </h2>

                    <p className="text-gray-300 text-base mb-8 max-w-lg">
                        With over 350+ Exclusive Franchise Stores across India and millions of happy customers,
                        premium Autoform quality is always within your reach.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                            className="bg-[#ffb200] hover:bg-[#e6a100] text-slate-900 px-6 py-3 rounded-lg text-sm font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            onClick={() => navigate(ROUTES.STORE_LOCATOR)}
                        >
                            <span className="material-symbols-outlined font-bold !text-xl">location_on</span>
                            Locate a Franchise
                        </button>

                        <button 
                            className="border border-white/30 hover:bg-white/10 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            onClick={toggleModal}
                        >
                            <span className="material-symbols-outlined font-bold !text-xl">handshake</span>
                            Become a Franchise
                        </button>
                    </div>
                </div>
            </div>

            <FranchiseModal isOpen={isModalOpen} toggleModal={toggleModal} />
        </section>
    );
};

export default DealerNetwork;
