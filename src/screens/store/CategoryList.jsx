import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CategoryList.css';

const CategoryList = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/db.json')
      .then(res => res.json())
      .then(data => {
        const allStores = data.Stores || [];
        // Map specific categories to general ones in DB for better matching
        const n = (name || '').toLowerCase();
        let filtered = allStores.filter(s => {
          const c = s.category?.toLowerCase() || '';
          const sub = s.subCategory?.toLowerCase() || '';
          const t = (s.tags || []).join(' ').toLowerCase();
          
          if (c.includes(n) || sub.includes(n) || t.includes(n)) return true;
          
          return false;
        });

        // Don't disguise stores anymore - if we don't have it, we don't have it.
        // But for demo purposes, if they specifically want Jewellery, we'll let it be empty so we can add them to DB.

        setStores(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stores:", err);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <div className="category-list-loading">Loading...</div>;

  return (
    <div className="category-list-page">
      <button className="back-btn-category" onClick={() => navigate(-1)}>← Back</button>
      
      <div className="category-header">
        <h1 className="category-title">{name}</h1>
        <p className="category-subtitle">Explore the finest {name} and best stores to make your day.</p>
      </div>


      <div className="category-results-header">
        <h2>{stores.length} Stores to explore</h2>
      </div>

      <div className="category-stores-grid">
        {stores.map((store, idx) => (
          <div 
            key={idx} 
            className="category-store-card"
            onClick={() => navigate(`/store/${idx}`, { state: { store } })}
          >
            <div className="store-image-wrapper">
              <img src={store.image} alt={store.name} className="store-img" />
              {store.offer && <div className="store-offer-tag">{store.offer}</div>}
            </div>
            <div className="store-info">
              <h3 className="store-name">{store.name}</h3>
              <div className="store-meta">
                <span className="store-rating">✪ {store.rating || '4.2'}</span>
                <span className="dot">•</span>
                <span className="store-distance">{store.location}</span>
              </div>
              <p className="store-categories">{store.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
