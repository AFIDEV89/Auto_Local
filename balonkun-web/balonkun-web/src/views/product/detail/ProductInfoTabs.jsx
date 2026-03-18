import React, { useState } from 'react';
import { ProductReviews, RelatedProducts } from './modules';
import { infoTabs } from './mockData';

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
          product?.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} itemprop="description" />
          ) : (
            <div className="text-slate-500 italic">No Description available.</div>
          )
        )}

        {activeTab === 'Additional Info' && (
          product?.additional_info ? (
            <div dangerouslySetInnerHTML={{ __html: product.additional_info }} />
          ) : (
            <div className="text-slate-500 italic">No Additional Info available.</div>
          )
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
