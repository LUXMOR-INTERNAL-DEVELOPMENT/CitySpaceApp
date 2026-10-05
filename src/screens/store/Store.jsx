import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';
import Footer from '../footer/Footer';
import { FiSearch, FiChevronRight, FiMapPin, FiChevronDown, FiCrosshair, FiX } from 'react-icons/fi';
import Filter, { useStoreFilters } from './Filter';
import SearchSuggestions from './SearchSuggestions';

const StoreImage = ({ offer }) => {
  return (
    <div className="store-card-image" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="image-skeleton" style={{ position: 'absolute', inset: 0, background: '#e5e7eb', animation: 'skeleton-pulse 1.5s infinite' }} />
      {offer && <div className="store-offer-banner">{offer}</div>}
    </div>
  );
};

const Store = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [districtOffers, setDistrictOffers] = useState([]);
  const [isOffersLoading, setIsOffersLoading] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [showAllStores, setShowAllStores] = useState(false);
  const { activeFilters, filteredStores, toggleFilter, clearFilters } = useStoreFilters(stores);

  // Location filter states
  const [userLocation, setUserLocation] = useState(() => localStorage.getItem('districtLocation') || 'Chennai');
  const [searchRadius, setSearchRadius] = useState(() => Number(localStorage.getItem('districtRadius')) || 50);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Save location to local storage when changed
  useEffect(() => {
    localStorage.setItem('districtLocation', userLocation);
    localStorage.setItem('districtRadius', searchRadius.toString());
    
    // Simulate loading state when location changes
    setIsOffersLoading(true);
    const timer = setTimeout(() => setIsOffersLoading(false), 800);
    return () => clearTimeout(timer);
  }, [userLocation, searchRadius]);

  // Search states
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleHeroSearchChange = (e) => {
    const query = e.target.value;
    setHeroSearchQuery(query);
    setShowSuggestions(query.length > 0);
  };

  const handleSearchSubmit = () => {
    if (heroSearchQuery.trim()) {
      navigate(`/store-search?q=${encodeURIComponent(heroSearchQuery)}`);
    }
  };

  const filteredDistrictOffers = districtOffers.filter(offer => {
    const locMatch = (offer.city || '').toLowerCase().includes(userLocation.toLowerCase()) || 
                     (offer.address || '').toLowerCase().includes(userLocation.toLowerCase());
    const distMatch = (offer.distance || 0) <= searchRadius;
    return locMatch && distMatch;
  });

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        if (data.StoreCategories) setCategories(data.StoreCategories);
        if (data.Stores) setStores(data.Stores);
        if (data.DistrictOffers) setDistrictOffers(data.DistrictOffers);
        if (data.Locations) setAvailableLocations(data.Locations);
      })
      .catch(err => console.error("Error fetching store data:", err));
  }, []);

  const handleSelectLocation = (loc) => {
    setUserLocation(loc);
    setIsLocationModalOpen(false);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // For demo, map to nearest known city or just set a generic string
        handleSelectLocation('Chennai'); 
      },
      (error) => {
        setIsLocating(false);
        alert("Unable to retrieve your location. Please check your permissions.");
      }
    );
  };

  const filteredLocations = availableLocations.filter(loc => 
    loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
  );

  return (
    <div className="store-page-container">
      <section className="store-hero" style={{ marginTop: '40px' }}>
            <div className="hero-search" style={{ position: 'relative', border: '1px solid #eaeaea' }}>
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="What are you looking for today?" 
                value={heroSearchQuery}
                onChange={handleHeroSearchChange}
                onFocus={() => { if(heroSearchQuery) setShowSuggestions(true); }}
                // Delay hiding suggestions so clicks can register
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleSearchSubmit(); }}
              />
              {heroSearchQuery && (
                <button 
                  onClick={() => { setHeroSearchQuery(''); setShowSuggestions(false); }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', marginRight: '8px', fontSize: '18px' }}
                >
                  <FiX />
                </button>
              )}
              <button className="search-btn" onClick={handleSearchSubmit}><FiChevronRight /></button>

              {showSuggestions && heroSearchQuery && (
                <SearchSuggestions
                  query={heroSearchQuery}
                  stores={stores}
                  categories={categories}
                  offers={districtOffers}
                />
              )}
            </div>
      </section>

      <section className="store-categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="category-card" 
              onClick={() => navigate(`/store-category/${encodeURIComponent(cat.name)}`)}
              style={{ cursor: 'pointer' }}
            >
              <span className="category-name">{cat.name}</span>
              <img src={cat.img} alt={cat.name} className="category-image" />
            </div>
          ))}
        </div>
      </section>

      <section className="store-district-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>In your District</h2>
          <div 
            className="current-location-selector"
            onClick={() => setIsLocationModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d1512d', cursor: 'pointer', fontWeight: 600, fontSize: '15px', background: '#fff0eb', padding: '10px 18px', borderRadius: '30px', transition: 'background 0.2s' }}
          >
            <FiMapPin /> {userLocation} ({searchRadius} km) <FiChevronDown />
          </div>
        </div>

        {isOffersLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888', fontSize: '18px' }}>
            Loading offers near {userLocation}...
          </div>
        ) : filteredDistrictOffers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#f9f9f9', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>No offers found near {userLocation}</h3>
            <p style={{ margin: '0 0 24px 0', color: '#777' }}>Try changing your location or increasing the search radius.</p>
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              style={{ background: '#222', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Change Location
            </button>
          </div>
        ) : (
          <div className="district-columns">
            <div className="district-col">
              <h3 className="col-title">Split & Pay In 3</h3>
              <p className="col-subtitle">Multiple stores • Up to ₹500 OFF</p>
              <div className="district-list">
                {filteredDistrictOffers.map((item, idx) => (
                  <div key={idx} className="district-item">
                    <div className="item-logo"></div>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.address}</p>
                      <span className="offer-tag">{item.offer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="district-col">
              <h3 className="col-title">Steals of the week</h3>
              <p className="col-subtitle">Exclusive offers near you</p>
              <div className="district-list">
                {/* Randomize slightly for variety if same data */}
                {[...filteredDistrictOffers].reverse().map((item, idx) => (
                  <div key={idx} className="district-item">
                    <div className="item-logo"></div>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.address}</p>
                      <span className="offer-tag">{item.offer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="district-col">
              <h3 className="col-title">Save Easy</h3>
              <p className="col-subtitle">Get the best offers near you</p>
              <div className="district-list">
                {filteredDistrictOffers.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="district-item">
                    <div className="item-logo"></div>
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.address}</p>
                      <span className="offer-tag">{item.offer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="all-stores-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>All Stores <span style={{ fontSize: '1.2rem', color: '#6b7280', fontWeight: 'normal' }}>({filteredStores.length})</span></h2>
          {activeFilters.length > 0 && (
            <button 
              onClick={clearFilters}
              style={{ background: 'none', border: 'none', color: '#d1512d', cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}
            >
              Clear All
            </button>
          )}
        </div>
        
        <Filter
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
        />

        {filteredStores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fcfcfc', border: '1px dashed #e5e5e5', borderRadius: '16px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No stores found</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666' }}>Try adjusting or clearing your filters to see more results.</p>
            <button 
              onClick={clearFilters}
              style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="stores-grid">
              {(showAllStores ? filteredStores : filteredStores.slice(0, 9)).map((store, idx) => (
                <div 
                  key={idx} 
                  className="store-card"
                  onClick={() => navigate(`/store/${idx}`, { state: { store } })}
                  style={{ cursor: 'pointer' }}
                >
                  <StoreImage src={store.image} alt={store.name} offer={store.offer} />
                  <div className="store-card-info">
                    <div className="store-brand-logo"></div>
                    <div className="store-brand-details">
                      <h4>{store.name}</h4>
                      <p>{store.location}</p>
                      <span className="store-category">{store.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStores.length > 9 && (
              <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
                <button 
                  onClick={() => setShowAllStores(!showAllStores)}
                  style={{ 
                    background: '#fff', 
                    color: '#111', 
                    border: '1px solid #ccc', 
                    padding: '12px 28px', 
                    borderRadius: '30px', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.background = '#f9f9f9'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.background = '#fff'; }}
                >
                  {showAllStores ? 'Show Less' : `Show All Stores (${filteredStores.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />

      {isLocationModalOpen && (
        <div className="loc-selector-overlay" onClick={() => setIsLocationModalOpen(false)}>
          <div className="loc-selector-modal" onClick={e => e.stopPropagation()}>
            <div className="loc-selector-header">
              <h3>Select Location</h3>
              <button className="close-btn" onClick={() => setIsLocationModalOpen(false)}><FiX /></button>
            </div>

            <div className="loc-search-box">
              <FiSearch className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for your city or locality" 
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
              />
            </div>

            <button className="use-current-loc-btn" onClick={handleCurrentLocation}>
              <FiCrosshair className="crosshair-icon" />
              <span>{isLocating ? 'Detecting location...' : 'Use my current location'}</span>
            </button>

            <div className="radius-selector">
              <h4>Distance Radius</h4>
              <div className="radius-options">
                {[2, 5, 10, 20, 50].map(r => (
                  <button 
                    key={r}
                    className={`radius-btn ${searchRadius === r ? 'active' : ''}`}
                    onClick={() => setSearchRadius(r)}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>

            <div className="popular-locations">
              <h4>Popular Locations</h4>
              <ul className="loc-list">
                {filteredLocations.map(loc => (
                  <li key={loc} onClick={() => handleSelectLocation(loc)}>
                    <FiMapPin className="pin-icon" /> {loc}
                  </li>
                ))}
                {locationSearchQuery && filteredLocations.length === 0 && (
                  <li className="no-result" onClick={() => handleSelectLocation(locationSearchQuery)}>
                    <FiMapPin className="pin-icon" /> Use "{locationSearchQuery}"
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
