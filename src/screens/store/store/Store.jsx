import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Store.css';
import Footer from '../../footer/Footer';
import Filter, { useStoreFilters } from '../filter/Filter';

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
  const [showAllStores, setShowAllStores] = useState(false);
  const { activeFilters, filteredStores, toggleFilter, clearFilters } = useStoreFilters(stores);

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        if (data.StoreCategories) setCategories(data.StoreCategories);
        if (data.Stores) setStores(data.Stores);
      })
      .catch(err => console.error("Error fetching store data:", err));
  }, []);

  return (
    <div className="store-page-container">
      <section className="store-categories-section">
        <h2>Explore by Category</h2>
        <div className="category-marquee" aria-label="Store categories">
          <div className="category-marquee-track">
            {[0, 1].map(copy => (
              <div className="category-marquee-group" key={copy} aria-hidden={copy === 1}>
                {categories.map((cat, idx) => (
                  <button
                    type="button"
                    key={`${cat.name}-${idx}`}
                    className="category-card"
                    onClick={() => navigate(`/store-category/${encodeURIComponent(cat.name)}`)}
                    tabIndex={copy === 1 ? -1 : 0}
                  >
                    <img src={cat.img} alt="" className="category-image" />
                    <span className="category-name">{cat.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
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
                  onClick={() => navigate(`/store/${encodeURIComponent(store.id || store.name)}`, { state: { store } })}
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
    </div>
  );
};

export default Store;
