import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';
import Footer from '../footer/Footer';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districtOffers, setDistrictOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        if (data.StoreCategories) setCategories(data.StoreCategories);
        if (data.Stores) setStores(data.Stores);
        if (data.DistrictOffers) setDistrictOffers(data.DistrictOffers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [query]);

  const lowerQ = query.toLowerCase();
  
  const matchedStores = stores.filter(s => s.name.toLowerCase().includes(lowerQ) || s.location.toLowerCase().includes(lowerQ) || s.category.toLowerCase().includes(lowerQ));
  const matchedCategories = categories.filter(c => c.name.toLowerCase().includes(lowerQ));
  const matchedOffers = districtOffers.filter(o => o.title.toLowerCase().includes(lowerQ));

  const hasResults = matchedStores.length > 0 || matchedCategories.length > 0 || matchedOffers.length > 0;

  return (
    <div style={{ padding: '20px 0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 20px', flex: 1 }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, padding: '10px 0', marginBottom: '20px' }}
        >
          <FiChevronLeft /> Back
        </button>

        <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Search Results for "{query}"</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>Searching...</div>
        ) : !hasResults ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '16px', margin: '40px 0' }}>
            <FiSearch style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>No results found for "{query}"</h3>
            <p style={{ color: '#777', margin: 0 }}>Try checking your spelling or using different keywords.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {matchedStores.length > 0 && (
              <section>
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Stores ({matchedStores.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                  {matchedStores.map((store, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/store/${encodeURIComponent(store.id || store.name)}`, { state: { store } })}
                      style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', background: 'white' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ height: '160px', background: `url(${store.image}) center/cover` }}>
                        <div style={{ background: '#d1512d', color: 'white', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', margin: '12px', borderRadius: '4px' }}>
                          {store.offer}
                        </div>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{store.name}</h4>
                        <p style={{ margin: '0 0 8px 0', color: '#777', fontSize: '14px' }}>{store.location}</p>
                        <span style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: '#555' }}>{store.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {matchedCategories.length > 0 && (
              <section>
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Categories ({matchedCategories.length})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {matchedCategories.map((cat, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigate(`/store-category/${encodeURIComponent(cat.name)}`)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '120px', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
                    >
                      <img src={cat.img} alt={cat.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }} />
                      <span style={{ fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {matchedOffers.length > 0 && (
              <section>
                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Brands & Offers ({matchedOffers.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {matchedOffers.map((offer, idx) => (
                    <div key={idx} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', background: 'white' }}>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{offer.title}</h4>
                      <p style={{ margin: '0 0 12px 0', color: '#777', fontSize: '14px' }}>{offer.address} ({offer.city})</p>
                      <div style={{ color: '#267E3E', fontWeight: 600, background: '#e6f7eb', padding: '8px 12px', borderRadius: '8px', display: 'inline-block' }}>
                        {offer.offer}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
