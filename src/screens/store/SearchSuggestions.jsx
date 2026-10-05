import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './SearchSuggestions.css';

const SearchSuggestions = ({ query, stores, categories, offers }) => {
  const navigate = useNavigate();
  const lowerQuery = query.toLowerCase();

  const matchedStores = stores.filter(store =>
    store.name.toLowerCase().includes(lowerQuery) ||
    store.location.toLowerCase().includes(lowerQuery)
  );
  const matchedCategories = categories.filter(category =>
    category.name.toLowerCase().includes(lowerQuery)
  );
  const matchedOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="search-suggestions">
      {matchedStores.length === 0 && matchedCategories.length === 0 && matchedOffers.length === 0 ? (
        <div className="search-suggestions-empty">
          No results found for "{query}"
        </div>
      ) : (
        <>
          {matchedStores.length > 0 && (
            <div className="suggestion-group">
              <h4 className="suggestion-heading">Stores</h4>
              {matchedStores.slice(0, 3).map((store, idx) => (
                <div
                  key={idx}
                  className="suggestion-item suggestion-store-item"
                  onClick={() => navigate(`/store/${idx}`, { state: { store } })}
                >
                  <div className="suggestion-store-image" style={{ backgroundImage: `url(${store.image})` }}></div>
                  <div className="suggestion-item-details">
                    <div className="suggestion-store-name">{store.name}</div>
                    <div className="suggestion-store-location">{store.location}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {matchedCategories.length > 0 && (
            <div className="suggestion-group">
              <h4 className="suggestion-heading">Categories</h4>
              {matchedCategories.slice(0, 3).map((category, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => navigate(`/store-category/${encodeURIComponent(category.name)}`)}
                >
                  <FiSearch className="suggestion-search-icon" />
                  <span className="suggestion-category-name">{category.name}</span>
                </div>
              ))}
            </div>
          )}

          {matchedOffers.length > 0 && (
            <div className="suggestion-group">
              <h4 className="suggestion-heading">Brands &amp; Offers</h4>
              {matchedOffers.slice(0, 3).map((offer, idx) => (
                <div
                  key={idx}
                  className="suggestion-item"
                  onClick={() => navigate(`/store-search?q=${encodeURIComponent(offer.title)}`)}
                >
                  <FiSearch className="suggestion-search-icon" />
                  <div className="suggestion-item-details">
                    <div className="suggestion-offer-title">{offer.title}</div>
                    <div className="suggestion-offer-description">{offer.offer}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchSuggestions;
