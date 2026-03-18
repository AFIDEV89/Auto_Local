import React, { useState, useEffect, useCallback, useMemo } from "react";
import BannerImage from './Banner.png';
import RatingForm from "./RatingForm";
import { storeLocatorBannerPremium } from '../../assets/images';
import './StoreLocator.css';
import { FaStore, FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { MdDirections } from "react-icons/md";
import { FaShare } from "react-icons/fa6";
import debounce from 'lodash.debounce';
import ReactSelect from "../../views/components/react-select";

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    minHeight: "52px",
    padding: "0 12px",
    border: state.isFocused ? "2px solid #ffb200" : "1px solid #e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(255, 178, 0, 0.05)" : "none",
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      background: "white",
      borderColor: "#cbd5e1"
    }
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected ? "#ffb200" : state.isFocused ? "rgba(255, 178, 0, 0.08)" : "white",
    color: state.isSelected ? "#0f172a" : "#475569",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    "&:active": {
      background: "#ffb200"
    }
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "20px",
    padding: "8px",
    marginTop: "12px",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
    border: "1px solid #f1f5f9",
    backdropFilter: "blur(20px)",
    background: "white",
    overflow: "hidden"
  }),
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "600"
  }),
  singleValue: (base) => ({
    ...base,
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: "700"
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#ffb200",
    "&:hover": { color: "#e6a100" }
  }),
  indicatorSeparator: () => ({ display: "none" })
};

const StoreCard = ({ 
  store, 
  timingsData, 
  ratingsData, 
  onOpenRatingForm 
}) => {
  const phoneNumber = "9278411411";
  
  const timings = timingsData?.timings || "Timings not available";
  const closedInfo = timingsData?.closed || "";
  const rating = ratingsData?.average || 0;
  const ratingCount = ratingsData?.count || 0;

  const renderStars = (average) => {
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star-filled">★</span>
        ))}
        {hasHalfStar && <span className="star-half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star-empty">☆</span>
        ))}
      </>
    );
  };

  const whatsappShareLink = `https://wa.me/?text=Check Out AutoForm Brand Store: ${store.StoreName}%0A Address: ${store.StoreAdd}%0A Timings: ${timings}%0A Contact: ${phoneNumber}%0A Location: ${encodeURIComponent(store.StoreLoc)}`;

  return (
    <div className="card">
      <div className="store-info">
        <div className="store-detail">
          <h3 className="store-name">{store.StoreName}</h3>
          
          <div className="store-item">
            <span className="store-icon-wrapper"><FaMapMarkerAlt /></span>
            <span>{store.StoreAdd}</span>
          </div>

          <div className="store-item">
            <span className="store-icon-wrapper"><FaClock /></span>
            <div className="flex flex-col gap-1">
              <span>{timings}</span>
              <div className="flex items-center gap-2">
                {timings.toLowerCase().includes("closed") ? (
                  <span className="status-badge closed">Closed</span>
                ) : (
                  <span className="status-badge open">Open</span>
                )}
                {closedInfo && (
                  <small className="text-red-500 font-bold">{closedInfo}</small>
                )}
              </div>
            </div>
          </div>

          <div className="ratings">
            <div className="stars">{renderStars(rating)}</div>
            <span className="score">{rating.toFixed(1)}</span>
            <span className="rating-count">({ratingCount})</span>
            <button 
              className="add-rating" 
              onClick={() => onOpenRatingForm(store.StoreID)}
            >
              Add Rating
            </button>
          </div>

          <div className="store-item">
            <span className="store-icon-wrapper"><FaPhoneAlt /></span>
            <a href={`tel:${phoneNumber}`} className="text-[#0f172a] font-bold hover:text-[#ffb200] transition-colors">
              {phoneNumber}
            </a>
          </div>
        </div>
      </div>

      <div className="btons">
        <a href={store.StoreLoc} target="_blank" rel="noopener noreferrer" className="no-underline">
          <button className="locate-button">
            <MdDirections className="text-xl" />
            Directions
          </button>
        </a>

        <a href={whatsappShareLink} target="_blank" rel="noopener noreferrer" className="no-underline">
          <button className="share-button">
            <FaShare className="text-lg" />
            Share
          </button>
        </a>
      </div>
    </div>
  );
};

const StoreLocator = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState({
    states: false,
    cities: false,
    stores: false,
    search: false,
    data: false
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [storeTimings, setStoreTimings] = useState({});
  const [storeRatings, setStoreRatings] = useState({});
  const [activeRatingStoreId, setActiveRatingStoreId] = useState(null);
  
  const API_BASE_URL = 'https://emporio1-1blc.vercel.app';

  useEffect(() => {
    fetchStates();
  }, []);

  const debouncedSearch = useCallback(
    debounce(() => {
      if (searchQuery.trim()) {
        setSelectedState("");
        setSelectedCity("");
        setCities([]);
        searchStoresByLocation();
      } else {
        resetDropdowns();
      }
    }, 500),
    [searchQuery]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch();
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    if (stores.length > 0) {
      batchFetchStoreData();
    }
  }, [stores]);

  const resetDropdowns = () => {
    setSelectedState("");
    setSelectedCity("");
    setCities([]);
    setStores([]);
    setIsDataLoaded(false);
  };

  const fetchStates = async () => {
    try {
      setIsLoading(prev => ({ ...prev, states: true }));
      const response = await fetch(`${API_BASE_URL}/getallstate`);
      const data = await response.json();
      setStates(data);
    } catch (err) {
      console.error('Error fetching states:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, states: false }));
    }
  };

  const fetchCitiesByState = async (stateId) => {
    if (!stateId) return;
    try {
      setIsLoading(prev => ({ ...prev, cities: true }));
      const response = await fetch(`${API_BASE_URL}/getCitiesByState`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state_id: stateId }),
      });
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, cities: false }));
    }
  };

  const fetchStoresByCity = async (cityId) => {
    if (!cityId) return;
    setIsLoading(prev => ({ ...prev, stores: true }));
    setStores([]);
    try {
      const response = await fetch(`${API_BASE_URL}/getStore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityid: cityId }),
      });
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, stores: false }));
      setIsDataLoaded(true);
    }
  };

  const searchStoresByLocation = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(prev => ({ ...prev, search: true }));
    setStores([]);
    try {
      const stateResponse = await fetch(`${API_BASE_URL}/getStorebyState`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stateid: searchQuery }),
      });
      if (stateResponse.ok) {
        const stateData = await stateResponse.json();
        if (stateData.length > 0) {
          setStores(stateData);
        } else {
          await searchStoresByCity(searchQuery);
        }
      } else {
        await searchStoresByCity(searchQuery);
      }
    } catch (error) {
      console.error('Error searching stores:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, search: false }));
      setIsDataLoaded(true);
    }
  };

  const searchStoresByCity = async (cityName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/getStorebyname`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityname: cityName }),
      });
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores by city name:', error);
    }
  };

  const batchFetchStoreData = async () => {
    if (!stores.length) return;
    setIsLoading(prev => ({ ...prev, data: true }));
    const storeIds = stores.map(store => store.StoreID);
    
    const timingsPromises = storeIds.map(storeId => 
      fetch(`${API_BASE_URL}/getStoreTimings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeid: storeId }),
      }).then(res => res.json()).catch(() => ({}))
    );
    
    const ratingsPromises = storeIds.map(storeId => 
      fetch(`${API_BASE_URL}/getRatings/${storeId}`)
      .then(res => res.json()).catch(() => ({}))
    );
    
    try {
      const [timingsResults, ratingsResults] = await Promise.all([
        Promise.all(timingsPromises),
        Promise.all(ratingsPromises)
      ]);
      
      const timingsMap = {};
      const ratingsMap = {};
      
      timingsResults.forEach((data, index) => {
        const storeId = storeIds[index];
        timingsMap[storeId] = { 
          timings: data.timings || "Timings not available", 
          closed: data.Closed || data.closed || "" 
        };
      });
      
      ratingsResults.forEach((data, index) => {
        const storeId = storeIds[index];
        ratingsMap[storeId] = { 
          average: parseFloat(data.averageRating) || 0, 
          count: parseInt(data.ratingCount) || 0 
        };
      });
      
      setStoreTimings(timingsMap);
      setStoreRatings(ratingsMap);
    } finally {
      setIsLoading(prev => ({ ...prev, data: false }));
    }
  };

  const handleStateChange = (selectedOption) => {
    const stateId = selectedOption?.value || "";
    setSelectedState(stateId);
    setSelectedCity("");
    setStores([]);
    setIsDataLoaded(false);
    if(stateId) {
      setSearchQuery("");
      fetchCitiesByState(stateId);
    }
  };

  const handleCityChange = (selectedOption) => {
    const cityId = selectedOption?.value || "";
    setSelectedCity(cityId);
    if(cityId){
      setSearchQuery("");
      fetchStoresByCity(cityId);
    } else {
      setStores([]);
      setIsDataLoaded(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchStoresByLocation();
    }
  };

  const handleOpenRatingForm = (storeId) => setActiveRatingStoreId(storeId);
  const handleCloseRatingForm = () => {
    setActiveRatingStoreId(null);
    if (stores.length > 0) batchFetchStoreData();
  };

  const anyLoading = isLoading.stores || isLoading.search || isLoading.data;

  return (
    <div className="store-locator-page">
      {/* Cinematic Hero Section */}
      <section className="hero-locator">
        <div className="hero-locator-bg">
          <img src={storeLocatorBannerPremium} alt="Premium Network" />
        </div>
        <div className="hero-locator-overlay"></div>
        <div className="hero-locator-content">
          <h1 className="animate-fade-in">Find Your Nearest <br /><span className="accent">Autoform Experience</span></h1>
          <p className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover India's leading destination for premium car interiors and accessories. 
            350+ franchise stores ready to serve you.
          </p>
        </div>
      </section>

      {/* Glassmorphic Filters Container */}
      <div className="container mx-auto px-6 lg:px-12 -mt-20">
        <div className="glass-filters animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="filter-grid">
            <ReactSelect
              options={states.map(s => ({ value: s.StateID, label: s.StateName }))}
              onChange={handleStateChange}
              value={selectedState ? { value: selectedState, label: states.find(s => s.StateID === selectedState)?.StateName } : null}
              placeholder={isLoading.states ? "Loading States..." : "Select State"}
              isLoading={isLoading.states}
              style={customSelectStyles}
            />

            <ReactSelect
              options={cities.map(c => ({ value: c.CityID, label: c.CityName }))}
              isDisabled={!selectedState || isLoading.cities}
              onChange={handleCityChange}
              value={selectedCity ? { value: selectedCity, label: cities.find(c => c.CityID === selectedCity)?.CityName } : null}
              placeholder={isLoading.cities ? "Loading Cities..." : "Select City"}
              isLoading={isLoading.cities}
              style={customSelectStyles}
            />

            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input-modern"
                placeholder="Search by brand store, city or pin code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                disabled={isLoading.search}
              />
              <span className="material-symbols-outlined search-icon-modern">search</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-20">
        {/* Brand Mission Statement */}
        {!isDataLoaded && !anyLoading && (
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Uncompromising Quality, Everywhere.</h2>
            <p className="text-slate-500 leading-relaxed text-lg">
              Autoform India is committed to enhancing your driving experience through innovation and craftsmanship. 
              Our extensive network of authorized franchise stores ensures that premium quality is always within reach.
            </p>
          </div>
        )}

        {/* Store Results Grid */}
        {anyLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffb200]"></div>
            <p className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-sm">Searching Network...</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 staggered-entry">
            {stores.length > 0 ? (
              stores.map(store => (
                <StoreCard 
                  key={store.StoreID} 
                  store={store} 
                  timingsData={storeTimings[store.StoreID]}
                  ratingsData={storeRatings[store.StoreID]}
                  onOpenRatingForm={handleOpenRatingForm}
                />
              ))
            ) : isDataLoaded ? (
              <div className="empty-state">
                <span className="material-symbols-outlined empty-state-icon">location_off</span>
                <h3>No Stores Found</h3>
                <p>We couldn't find any stores matching your criteria. Try widening your search.</p>
              </div>
            ) : (
              <div className="empty-state">
                <span className="material-symbols-outlined empty-state-icon text-slate-200">storefront</span>
                <h3>Enter location above to start</h3>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating Popup */}
      {activeRatingStoreId && (
        <div className="popup-overlay fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="popup-content bg-white p-0 rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <RatingForm 
              storeId={activeRatingStoreId} 
              onClose={handleCloseRatingForm} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreLocator;
