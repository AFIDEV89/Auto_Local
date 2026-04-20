import React, { useCallback, useEffect, useState } from "react";
import { getProductPicture, formatNumberToIndian } from '@utils';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as actions from '@redux/actions';
import {
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from 'reactstrap';
import { getDataApi } from "@services/ApiCaller";
import { ShopNowModal, ProductCard } from '@views/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import { fourWheeler as FourWheelerSVG, twoWheeler as TwoWheelerSVG, FourWheeler, TwoWheeler } from "@assets/images";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const TRENDING_URLS = {
  "2W": {
    "Seat Covers": "two-wheeler-seat-covers",
    "Accessories": "car-accessories",
    "Mats": "autoform-car-mats"
  },
  "4W": {
    "Accessories": "car-accessories",
    "Mats": "autoform-car-mats",
    "Seat Covers": "car-seat-covers"
  }
};

const getTrendingUrl = (vehicleType, categoryType) => {
  return vehicleType && categoryType ? TRENDING_URLS[vehicleType][categoryType] : "";
};

const ProductSlider = ({
  categoryList = [],
  onClickProduct = () => { },
}) => {
  const { isLogin } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').trim();
  };

  const [products4W, setProducts4W] = useState([]);
  const [products2W, setProducts2W] = useState([]);
  const [isLoading4W, setIsLoading4W] = useState(false);
  const [isLoading2W, setIsLoading2W] = useState(false);
  const [activeCategory4W, setActiveCategory4W] = useState('');
  const [activeCategory2W, setActiveCategory2W] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDropdownOpen4W, setIsDropdownOpen4W] = useState(false);
  const [isDropdownOpen2W, setIsDropdownOpen2W] = useState(false);

  const fetchProductsRow = useCallback(async (category, vehicleType, setProducts, setLoading) => {
    setLoading(true);
    try {
      getDataApi({ path: `user/dashboard/get-product-list?category=${category}&vehicle_type=${vehicleType}` })
        .then(res => {
          setProducts(res?.data?.data || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch (error) {
      console.error(`Error fetching trending products for ${vehicleType}:`, error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (categoryList.length > 0) {
      if (!activeCategory4W) setActiveCategory4W(categoryList[0].name);
      if (!activeCategory2W) setActiveCategory2W(categoryList[0].name);
    }
  }, [categoryList, activeCategory4W, activeCategory2W]);

  useEffect(() => {
    if (activeCategory4W) {
      fetchProductsRow(activeCategory4W, '4W', setProducts4W, setIsLoading4W);
    }
  }, [activeCategory4W, fetchProductsRow]);

  useEffect(() => {
    if (activeCategory2W) {
      fetchProductsRow(activeCategory2W, '2W', setProducts2W, setIsLoading2W);
    }
  }, [activeCategory2W, fetchProductsRow]);

  const handleAddToCart = (productId, isDirectBuy = false) => {
    if (!isLogin) {
      navigate('/login');
      return;
    }
    
    dispatch(actions.cartProductCreate({ product_id: productId, quantity: 1 }, (res) => {
      if (isDirectBuy) {
        navigate('/my-cart');
      }
    }));
  };

  const showShopNowModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const toggleModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {[1, 2, 3].map(i => (
        <div key={i} className="animate-pulse bg-white rounded-2xl h-[400px] shadow-sm border border-slate-100">
          <div className="h-48 bg-slate-50 rounded-t-2xl" />
          <div className="p-5 space-y-4">
            <div className="h-4 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-50 rounded w-full" />
            <div className="h-6 bg-slate-50 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const CategoryNavigation = ({ active, onSelect }) => (
    <div className="flex items-center gap-8">
      {categoryList.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.name)}
          className={`group relative py-1 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${active === cat.name
            ? 'text-slate-900'
            : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {cat.display || cat.name}
          <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-[#ffb200] rounded-full transition-all duration-300 ${active === cat.name ? 'w-full' : 'w-0 group-hover:w-1/2'
            }`} />
        </button>
      ))}
    </div>
  );

  return (
    <section className="relative bg-[#FAF9F6] py-12 overflow-hidden">
      <Container className="max-w-[1440px] relative z-10 px-6 lg:px-12">
        <Row className="justify-center">
          <Col lg={12}>
            {/* Header Section */}
            <div className="text-center mb-10">
              <span className="text-[#ffb200] font-bold text-[11px] tracking-[0.5em] uppercase block mb-2">
                Handcrafted Luxury
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter uppercase mb-2">
                Trending <span className="text-[#ffb200] italic">This Season</span>
              </h2>
            </div>

            {/* Row 1: 4-Wheelers */}
            <div className="mb-12">
              {/* Desktop Header (RESTORED - Zero impact) */}
              <div className="hidden md:flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                <h3 className="group/title text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-4 cursor-default">
                  <span className="w-10 h-1 bg-[#ffb200] rounded-full transition-all duration-500 group-hover/title:w-16" />
                  <span>For Your 4-Wheeler</span>
                </h3>

                <div className="flex items-center gap-12">
                  <CategoryNavigation active={activeCategory4W} onSelect={setActiveCategory4W} />

                  <Link
                    to={`/${getTrendingUrl("4W", activeCategory4W)}?search=trending`}
                    className="group flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all"
                  >
                    Browse All <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">trending_flat</span>
                  </Link>
                </div>
              </div>

              {/* Mobile "For Your" Header (MODERNIZED - Mobile Only) */}
              <div className="md:hidden mb-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 bg-[#ffb200] rounded-full shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-bold text-lg leading-tight">For Your</span>
                    <span className="text-slate-900 font-extrabold text-2xl leading-tight">4-Wheeler</span>
                  </div>
                </div>

                {/* Category Sliding Pill Navigation (MODERNIZED - Mobile Only) */}
                <div className="relative bg-slate-100/50 p-1 rounded-full flex items-center">
                  {/* Sliding Background Pill */}
                  <div 
                    className="absolute h-[calc(100%-8px)] bg-[#ffb200] rounded-full shadow-sm transition-all duration-300 ease-out z-0"
                    style={{
                      width: `${100 / categoryList.length}%`,
                      left: `calc(${(categoryList.findIndex(c => c.name === activeCategory4W)) * (100 / categoryList.length)}% + 4px)`,
                    }}
                  />
                  
                  {categoryList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory4W(cat.name)}
                      className={`relative flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-center transition-colors duration-300 z-10 ${activeCategory4W === cat.name ? 'text-white' : 'text-slate-400'}`}
                    >
                      {cat.display || cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group/carousel">
                {isLoading4W ? <LoadingSkeleton /> : (
                  <Swiper
                    key={`swiper-4w-${activeCategory4W}-${products4W.length}`}
                    modules={[Autoplay, Navigation]}
                    spaceBetween={32}
                    slidesPerView={1}
                    loop={products4W.length > 1}
                    observer={true}
                    observeParents={true}
                    watchSlidesProgress={true}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    navigation={{
                      prevEl: '.prev-4w',
                      nextEl: '.next-4w',
                    }}
                    breakpoints={{
                      640: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    className="!pb-6"
                  >
                    {products4W.map((product, idx) => (
                      <SwiperSlide key={product.id || idx} className="!h-auto">
                        <ProductCard 
                          product={product} 
                          onClickProduct={onClickProduct} 
                          showShopNowModal={showShopNowModal} 
                          onAddToCart={handleAddToCart}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {/* Custom Navigation - 4W */}
                <button className="prev-4w absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#ffb200] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:hidden">
                  <span className="material-symbols-outlined !text-3xl">chevron_left</span>
                </button>
                <button className="next-4w absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#ffb200] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:hidden">
                  <span className="material-symbols-outlined !text-3xl">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Row 2: 2-Wheelers */}
            <div className="mb-8">
              {/* Desktop Header (RESTORED - Zero impact) */}
              <div className="hidden md:flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                <h3 className="group/title text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-4 cursor-default">
                  <span className="w-10 h-1 bg-[#ffb200] rounded-full transition-all duration-500 group-hover/title:w-16" />
                  <span>For Your 2-Wheeler</span>
                </h3>

                <div className="flex items-center gap-12">
                  <CategoryNavigation active={activeCategory2W} onSelect={setActiveCategory2W} />

                  <Link
                    to={`/${getTrendingUrl("2W", activeCategory2W)}?search=trending`}
                    className="group flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-all"
                  >
                    Browse All <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">trending_flat</span>
                  </Link>
                </div>
              </div>

              {/* Mobile "For Your" Header (MODERNIZED - Mobile Only) */}
              <div className="md:hidden mb-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1 h-12 bg-[#ffb200] rounded-full shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-slate-900 font-bold text-lg leading-tight">For Your</span>
                    <span className="text-slate-900 font-extrabold text-2xl leading-tight">2-Wheeler</span>
                  </div>
                </div>

                {/* Category Sliding Pill Navigation (MODERNIZED - Mobile Only) */}
                <div className="relative bg-slate-100/50 p-1 rounded-full flex items-center">
                  {/* Sliding Background Pill */}
                  <div 
                    className="absolute h-[calc(100%-8px)] bg-[#ffb200] rounded-full shadow-sm transition-all duration-300 ease-out z-0"
                    style={{
                      width: `${100 / categoryList.length}%`,
                      left: `calc(${(categoryList.findIndex(c => c.name === activeCategory2W)) * (100 / categoryList.length)}% + 4px)`,
                    }}
                  />
                  
                  {categoryList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory2W(cat.name)}
                      className={`relative flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] text-center transition-colors duration-300 z-10 ${activeCategory2W === cat.name ? 'text-white' : 'text-slate-400'}`}
                    >
                      {cat.display || cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group/carousel">
                {isLoading2W ? <LoadingSkeleton /> : (
                  <Swiper
                    key={`swiper-2w-${activeCategory2W}-${products2W.length}`}
                    modules={[Autoplay, Navigation]}
                    spaceBetween={32}
                    slidesPerView={1}
                    loop={products2W.length > 1}
                    observer={true}
                    observeParents={true}
                    watchSlidesProgress={true}
                    autoplay={{
                      delay: 3500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true
                    }}
                    navigation={{
                      prevEl: '.prev-2w',
                      nextEl: '.next-2w',
                    }}
                    breakpoints={{
                      640: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    className="!pb-6"
                  >
                    {products2W.map((product, idx) => (
                      <SwiperSlide key={product.id || idx} className="!h-auto">
                        <ProductCard 
                          product={product} 
                          onClickProduct={onClickProduct} 
                          showShopNowModal={showShopNowModal} 
                          onAddToCart={handleAddToCart}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}

                {/* Custom Navigation - 2W */}
                <button className="prev-2w absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#ffb200] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:hidden">
                  <span className="material-symbols-outlined !text-3xl">chevron_left</span>
                </button>
                <button className="next-2w absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 border border-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-400 hover:text-[#ffb200] hover:scale-110 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:hidden">
                  <span className="material-symbols-outlined !text-3xl">chevron_right</span>
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {selectedProduct && (
        <ShopNowModal
          isOpen={isModalVisible}
          toggleModal={toggleModal}
          product={selectedProduct}
        />
      )}
    </section>
  );
};

export default ProductSlider;