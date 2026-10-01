import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiNavigation, FiShare, FiPhone } from 'react-icons/fi';
import './StoreDetail.css';

const DynamicImage = ({ className }) => {
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="image-skeleton" style={{ position: 'absolute', inset: 0, background: '#e5e7eb', animation: 'skeleton-pulse 1.5s infinite' }} />
    </div>
  );
};

const StoreDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const store = location.state?.store || {
    name: "Shree Anandhaas",
    image: "https://via.placeholder.com/800x400",
    category: "Food",
    offer: "₹250 for two",
    location: "Coimbatore"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getProductsForStore = (storeCategory, storeName) => {
    const category = storeCategory?.toLowerCase() || '';
    const name = storeName?.toLowerCase() || '';

    if (category.includes('pharmacy') || name.includes('apollo')) {
      return [
        { name: 'Vitamins Supplement', price: '₹599', rating: '4.8 (120)', desc: 'Daily multivitamin tablets for immunity.', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&q=80' },
        { name: 'Skincare Lotion', price: '₹299', rating: '4.5 (85)', desc: 'Hydrating body lotion with aloe vera.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&q=80' },
        { name: 'First Aid Kit', price: '₹450', rating: '4.7 (200)', desc: 'Essential first aid kit with bandages and antiseptics.', img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=150&q=80' }
      ];
    } else if (category.includes('apparel') || category.includes('retail') || name.includes('zudio') || name.includes('shoppers')) {
      return [
        { name: 'Classic White T-Shirt', price: '₹799', rating: '4.6 (340)', desc: '100% cotton classic white crew neck t-shirt.', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&q=80' },
        { name: 'Denim Jeans', price: '₹1499', rating: '4.4 (120)', desc: 'Slim fit blue denim jeans with stretch.', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=150&q=80' },
        { name: 'Leather Jacket', price: '₹3999', rating: '4.9 (56)', desc: 'Premium faux leather jacket for winter.', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&q=80' }
      ];
    } else if (category.includes('beauty') || name.includes('nykaa')) {
      return [
        { name: 'Matte Lipstick', price: '₹499', rating: '4.5 (210)', desc: 'Long lasting matte finish lipstick.', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=150&q=80' },
        { name: 'Foundation Serum', price: '₹899', rating: '4.7 (305)', desc: 'Flawless coverage foundation serum.', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150&q=80' },
        { name: 'Eye Shadow Palette', price: '₹1200', rating: '4.8 (90)', desc: '12 shades of vibrant eye shadow colors.', img: 'https://images.unsplash.com/photo-1512496015851-a98fb38ba79e?w=150&q=80' }
      ];
    } else if (category.includes('sports') || name.includes('adidas')) {
      return [
        { name: 'Running Shoes', price: '₹2999', rating: '4.8 (500)', desc: 'Lightweight and breathable running shoes.', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80' },
        { name: 'Yoga Mat', price: '₹899', rating: '4.6 (145)', desc: 'Non-slip premium yoga mat for workouts.', img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=150&q=80' },
        { name: 'Dumbbell Set', price: '₹1499', rating: '4.7 (230)', desc: 'Set of 2 adjustable dumbbells for home gym.', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=150&q=80' }
      ];
    } else {
      return [
        { name: 'Emirati Zaatar Pizza', price: '₹244', rating: '4.6 (22)', desc: "Middle Eastern pizza with capsicum, sundried tomatoes & Za'atar spice powder", img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150&q=80', isFood: true },
        { name: 'Veg Supremo Pizza', price: '₹213', rating: '4.6 (755)', desc: 'Capsicum, black olives, red chillies, onions, corn & mushroom', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&q=80', isFood: true },
        { name: 'Pesto Jalapeno Pizza', price: '₹175', rating: '4.5 (179)', desc: 'A zesty twist on the classic! Freshly baked thin crust topped with aromatic basil pesto...', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=150&q=80', isFood: true }
      ];
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const products = getProductsForStore(store.category, store.name);

  const [cart, setCart] = useState({});

  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
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
    window.location.href = `tel:+919876543210`; // dummy number if not provided in DB
  };

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
            <p className="store-profile-address">
              {store.distance || '1.4'} km | {store.location || 'Ground floor, Mayur center, Pune - 411004'}
            </p>
            <p className="store-profile-category">
              {store.category} | {store.subCategory || (store.tags && store.tags[0]) || 'Retail'}
            </p>
            <p className="store-profile-timing">
              <span className="timing-open">Open</span> . Closes 10:00 PM <span className="timing-arrow">⌄</span>
            </p>
          </div>
        </div>

        <div className="store-profile-actions">
          <button className="profile-action-btn" onClick={handleDirections}>
            <FiNavigation className="action-icon" /> Directions
          </button>
          <button className="profile-action-btn" onClick={handleShare}>
            <FiShare className="action-icon" /> Share
          </button>
          <button className="profile-action-btn" onClick={handleCall}>
            <FiPhone className="action-icon" /> Call now
          </button>
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
              No products found matching "{searchQuery}"
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
                  <h3 className="product-name">{item.name}</h3>
                  <div className="product-price">{item.price}</div>
                  <div className="product-rating">
                    <span className="star-icon-small">★</span> {item.rating.split(' ')[0]} <span className="rating-count-small">{item.rating.split(' ')[1]}</span>
                  </div>
                  <p className="product-description">{item.desc}</p>
                </div>
                <div className="product-image-container">
                  <DynamicImage src={item.img} alt={item.name} className="product-img" />
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
