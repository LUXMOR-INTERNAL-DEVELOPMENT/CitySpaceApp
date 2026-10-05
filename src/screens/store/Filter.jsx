import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Filter.css';

export const useStoreFilters = (stores) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (filterName) => {
    setActiveFilters(previousFilters =>
      previousFilters.includes(filterName)
        ? previousFilters.filter(filter => filter !== filterName)
        : [...previousFilters, filterName]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  const filteredStores = stores.filter(store => {
    if (activeFilters.length === 0) return true;

    const paymentActive = activeFilters.includes('Pay via District');
    const distanceActive = activeFilters.includes('Under 10 km');
    const knownGenders = ['Women', 'Men', 'Kids', 'Unisex'];
    const specialFilters = ['Pay via District', 'Under 10 km'];
    const categoryFilters = activeFilters.filter(filter =>
      !knownGenders.includes(filter) && !specialFilters.includes(filter)
    );
    const audienceFilters = activeFilters.filter(filter => knownGenders.includes(filter));

    const passPayment = !paymentActive || store.payViaDistrict === true;
    const passDistance = !distanceActive || (store.distance || 0) <= 10;
    const passCategory = categoryFilters.length === 0 ||
      categoryFilters.includes(store.category) ||
      categoryFilters.some(category => (store.category || '').includes(category));
    const passAudience = audienceFilters.length === 0 ||
      audienceFilters.some(audience => (store.audience || []).includes(audience));

    return passPayment && passDistance && passCategory && passAudience;
  });

  return { activeFilters, filteredStores, toggleFilter, clearFilters };
};

const modalCategories = [
  'Apparel', 'Footwear', 'Accessories', 'Salon',
  'Jewellery', 'Bags', 'Sports & Outdoors',
  'Skincare', 'Wellness', 'Fragrances'
];

const Filter = ({ activeFilters, toggleFilter, clearFilters }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState('Shopping Category');

  return (
    <>
      <div className="store-filters">
        <button
          className={`filter-btn ${activeFilters.length > 0 ? 'active' : ''}`}
          onClick={() => setIsFilterModalOpen(true)}
        >
          <FiSearch style={{ marginRight: '5px' }} /> Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
        </button>
        {['Pay via District', 'Under 10 km', 'Apparel', 'Accessories', 'Personal', 'Shop', 'Women', 'Men', 'Kids'].map(filter => (
          <button
            key={filter}
            className={`filter-btn ${activeFilters.includes(filter) ? 'active' : ''}`}
            onClick={() => toggleFilter(filter)}
          >
            {filter}
            {activeFilters.includes(filter) && <span style={{ marginLeft: '6px', fontWeight: 'bold' }}>×</span>}
          </button>
        ))}
      </div>

      {isFilterModalOpen && (
        <div className="filter-modal-overlay" onClick={() => setIsFilterModalOpen(false)}>
          <div className="filter-modal-content" onClick={event => event.stopPropagation()}>
            <div className="filter-modal-header">
              <h3>Filter by</h3>
              <button className="close-modal-btn" onClick={() => setIsFilterModalOpen(false)}>✕</button>
            </div>

            <div className="filter-modal-body">
              <div className="filter-modal-sidebar">
                <div
                  className={`sidebar-tab ${modalActiveTab === 'Shopping Category' ? 'active' : ''}`}
                  onClick={() => setModalActiveTab('Shopping Category')}
                >
                  Shopping Category
                </div>
                <div
                  className={`sidebar-tab ${modalActiveTab === 'Gender' ? 'active' : ''}`}
                  onClick={() => setModalActiveTab('Gender')}
                >
                  Gender
                </div>
              </div>

              <div className="filter-modal-options">
                {modalActiveTab === 'Shopping Category' && modalCategories.map(category => (
                  <label key={category} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(category)}
                      onChange={() => toggleFilter(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}

                {modalActiveTab === 'Gender' && ['Men', 'Women', 'Kids', 'Unisex'].map(gender => (
                  <label key={gender} className="filter-checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(gender)}
                      onChange={() => toggleFilter(gender)}
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="clear-filters-btn" onClick={clearFilters}>Clear filters</button>
              <button className="apply-filters-btn" onClick={() => setIsFilterModalOpen(false)}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;
