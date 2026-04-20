import React, { useState } from 'react';
import { ProductReviews } from './modules';
import { infoTabs } from './mockData';

const CollapsibleContent = ({ children, isMobileOnly = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex flex-col items-start w-full">
      <div 
        className={`w-full overflow-hidden transition-all duration-500 relative ${
          !isExpanded && isMobileOnly ? 'max-h-[320px] sm:max-h-none' : 'max-h-[5000px]'
        }`}
      >
        <div className="text-left w-full">
          {children}
        </div>
        
        {/* Mobile Fade Overlay */}
        {!isExpanded && isMobileOnly && (
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent sm:hidden pointer-events-none" />
        )}
      </div>

      {/* Toggle Button - Mobile Only */}
      {isMobileOnly && (
        <div className="w-full flex justify-center sm:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-[#ffb200] font-extrabold text-[12px] uppercase tracking-[0.2em] flex items-center gap-1 py-2 group"
          >
            {isExpanded ? "View Less" : "View All"}
            <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

const ProductInfoTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('Description');

  const filteredInfoTabs = infoTabs.filter(tab => tab.shouldRender(product));

  return (
    <div className="flex flex-col w-full bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-100 mb-8 pb-4 gap-8">
        {filteredInfoTabs.map((tab) => {
          const isActive = tab.tabName === activeTab;
          return (
            <button
              key={tab.tabName}
              className={`relative py-2 text-[13px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
              onClick={() => setActiveTab(tab.tabName)}
            >
              {tab.tabName}
              {isActive && (
                <span className="absolute -bottom-[17px] left-0 w-full h-1 bg-[#ffb200] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-headings:text-slate-900 prose-headings:font-bold prose-ul:list-disc prose-ul:pl-5 prose-ul:text-slate-700 marker:text-[#ffb200] prose-li:my-2">
        {activeTab === 'Description' && (
          <CollapsibleContent>
            {product?.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} itemprop="description" />
            ) : (
              <div className="text-slate-500 italic">No Description available.</div>
            )}
          </CollapsibleContent>
        )}

        {activeTab === 'Additional Info' && (
          <CollapsibleContent>
            {product?.additional_info ? (
              <div dangerouslySetInnerHTML={{ __html: product.additional_info }} />
            ) : (
              <div className="text-slate-500 italic">No Additional Info available.</div>
            )}
          </CollapsibleContent>
        )}

        {activeTab === 'Reviews' && (
          <div className="not-prose mt-2">
            <ProductReviews productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductInfoTabs;
