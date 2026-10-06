import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiNavigation, FiShare, FiPhone } from 'react-icons/fi';
import './StoreDetail.css';

const DynamicImage = ({ src, alt, className }) => {
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="image-skeleton" style={{ position: 'absolute', inset: 0, background: '#e5e7eb', animation: 'skeleton-pulse 1.5s infinite' }} />
      {src && <img src={src} alt={alt || ''} className={className} style={{ position: 'relative' }} />}
    </div>
  );
};

const StoreDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    let isActive = true;

    const loadStore = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const response = await fetch('/db.json');
        if (!response.ok) {
          throw new Error(`Store data request failed (${response.status})`);
        }

        const data = await response.json();
        const stores = Array.isArray(data.Stores) ? data.Stores : [];
        const storeKey = id || '';
        const routeMatch = stores.find(item =>
          String(item.id ?? '').toLowerCase() === storeKey.toLowerCase() ||
          item.name?.toLowerCase() === storeKey.toLowerCase()
        );
        const navigationStore = location.state?.store;
        const navigationMatch = navigationStore && stores.find(item =>
          (navigationStore.id != null && String(item.id) === String(navigationStore.id)) ||
          item.name?.toLowerCase() === navigationStore.name?.toLowerCase()
        );
        const numericIndex = /^\d+$/.test(storeKey) ? Number(storeKey) : -1;
        const selectedStore = routeMatch || navigationMatch || stores[numericIndex];

        if (!selectedStore) {
          throw new Error('Store not found.');
        }

        if (isActive) {
          const storeProducts = data.StoreProducts?.[selectedStore.name];
          setStore(selectedStore);
          setProducts(
            Array.isArray(storeProducts)
              ? storeProducts
              : Array.isArray(selectedStore.products)
                ? selectedStore.products
                : []
          );
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
        if (isActive) setLoadError(error.message || 'Unable to load store details.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadStore();
    return () => {
      isActive = false;
    };
  }, [id, location.state]);

  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState({});
  const filteredProducts = products.filter(item =>
    (item.name || item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.desc || item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateCart = (idx, delta) => {
    setCart(prev => {
      const current = prev[idx] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      }
      return { ...prev, [idx]: next };
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleViewCart = () => {
    const cartItems = Object.keys(cart).map(idx => ({
      ...filteredProducts[idx],
      quantity: cart[idx]
    }));
    navigate('/checkout', { state: { cartItems, storeName: store.name } });
  };

  const handleDirections = () => {
    const query = encodeURIComponent(`${store.name} ${store.location || ''} ${store.city || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store.name,
        text: `Check out ${store.name} on CitySpace!`,
        url: window.location.href,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCall = () => {
    if (store.phone) window.location.href = `tel:${store.phone}`;
  };

  if (loading) {
    return <div className="store-detail-status">Loading store details...</div>;
  }

  if (loadError || !store) {
    return (
      <div className="store-detail-status" role="alert">
        {loadError || 'Store not found.'}
        <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="store-detail-page">
      <div className="store-detail-header">
        <div className="breadcrumbs">
          <span onClick={() => navigate('/home')}>Home</span> /
          <span onClick={() => navigate('/stores')}> Stores</span> /
          <span className="current">{store.name}</span>
        </div>
        <button className="back-btn" onClick={() => navigate(-1)}>← Go Back</button>
      </div>

      <div className="store-detail-container">
        <div className="store-header-profile">
          <DynamicImage src={store.image} alt={store.name} className="store-profile-logo" />
          <div className="store-profile-info">
            <h1 className="store-profile-name">{store.name}</h1>
            {(store.distance != null || store.location || store.address) && (
              <p className="store-profile-address">
                {store.distance != null && `${store.distance} km`}
                {store.distance != null && (store.location || store.address) && ' | '}
                {store.location || store.address}
              </p>
            )}
            <p className="store-profile-category">
              {[store.category, store.subCategory || store.tags?.[0]].filter(Boolean).join(' | ')}
            </p>
            {(store.openingHours || store.timing) && (
              <p className="store-profile-timing">{store.openingHours || store.timing}</p>
            )}
          </div>
        </div>

        <div className="store-profile-actions">
          <button className="profile-action-btn" onClick={handleDirections}>
            <FiNavigation className="action-icon" /> Directions
          </button>
          <button className="profile-action-btn" onClick={handleShare}>
            <FiShare className="action-icon" /> Share
          </button>
          {store.phone && (
            <button className="profile-action-btn" onClick={handleCall}>
              <FiPhone className="action-icon" /> Call now
            </button>
          )}
        </div>
      </div>

      <div className="store-products-section">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder={`Search in ${store.name}`}
            className="product-search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="products-list">
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              {products.length === 0
                ? 'No products are listed for this store yet.'
                : `No products found matching "${searchQuery}"`}
            </div>
          ) : (
            filteredProducts.map((item, idx) => (
              <div key={idx} className="product-item">
                <div className="product-info">
                  {item.isFood && (
                    <div className="veg-icon">
                      <span className="dot-icon"></span>
                    </div>
                  )}
                  <h3 className="product-name">{item.name || item.title}</h3>
                  <div className="product-price">{item.price}</div>
                  {item.rating != null && (
                    <div className="product-rating">
                      <span className="star-icon-small">★</span> {item.rating}
                    </div>
                  )}
                  {(item.desc || item.description) && (
                    <p className="product-description">{item.desc || item.description}</p>
                  )}
                </div>
                <div className="product-image-container">
                  <DynamicImage src={item.img || item.image} alt={item.name || item.title} className="product-img" />
                  {cart[idx] ? (
                    <div className="cart-counter-btn">
                      <button onClick={() => handleUpdateCart(idx, -1)}>-</button>
                      <span>{cart[idx]}</span>
                      <button onClick={() => handleUpdateCart(idx, 1)}>+</button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => handleUpdateCart(idx, 1)}>ADD</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="sticky-cart-bar">
          <div className="cart-bar-info">{totalItems} item{totalItems > 1 ? 's' : ''} added</div>
          <button className="view-cart-btn" onClick={handleViewCart}>
            VIEW CART
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreDetail;
