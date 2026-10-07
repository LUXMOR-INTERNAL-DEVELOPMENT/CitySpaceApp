import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiMapPin, FiNavigation, FiPhone, FiShare } from 'react-icons/fi';
import './StoreDetail.css';

const StoreDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [catalogueTemplates, setCatalogueTemplates] = useState({});
  const [customerReviews, setCustomerReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [activeTab, setActiveTab] = useState('Offers');
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
          setStore(selectedStore);
          setCatalogueTemplates(data.StoreCatalogues || {});

          const reviewStorageKey = `cityspace-store-reviews-${selectedStore.id || selectedStore.name}`;
          try {
            const savedReviews = JSON.parse(localStorage.getItem(reviewStorageKey) || '[]');
            setCustomerReviews(
              Array.isArray(savedReviews)
                ? savedReviews.filter(review =>
                  Number.isInteger(review.rating) &&
                  review.rating >= 1 &&
                  review.rating <= 5 &&
                  typeof review.text === 'string'
                )
                : []
            );
          } catch (error) {
            console.error('Unable to load saved store reviews:', error);
            setCustomerReviews([]);
          }
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

  const handleDirections = () => {
    const query = encodeURIComponent(
      `${store.name} ${store.detail?.address || store.location || ''} ${store.city || ''}`
    );
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    const shareData = {
      title: store.name,
      text: `Check out ${store.name} on CitySpace!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') console.error('Error sharing store:', error);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      window.alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Unable to copy store link:', error);
    }
  };

  const handleReviewSubmit = event => {
    event.preventDefault();
    if (!reviewRating || !reviewText.trim()) {
      setReviewError('Choose a star rating and write a review before submitting.');
      return;
    }

    const review = {
      id: `${Date.now()}`,
      rating: reviewRating,
      text: reviewText.trim(),
      author: 'You',
      date: new Date().toLocaleDateString(),
    };
    const nextReviews = [review, ...customerReviews];
    const reviewStorageKey = `cityspace-store-reviews-${store.id || store.name}`;

    try {
      localStorage.setItem(reviewStorageKey, JSON.stringify(nextReviews));
      setCustomerReviews(nextReviews);
      setReviewRating(0);
      setReviewText('');
      setReviewError('');
      setIsReviewFormOpen(false);
    } catch (error) {
      console.error('Unable to save store review:', error);
      setReviewError('Your review could not be saved. Please try again.');
    }
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

  const detail = store.detail || {};
  const offers = detail.offers?.length
    ? detail.offers
    : store.offer
      ? [{ title: store.offer, description: 'Visit the store to learn more about this offer.' }]
      : [];
  const catalogue = detail.catalogue?.length
    ? detail.catalogue
    : catalogueTemplates[store.name] ||
      catalogueTemplates[store.subCategory] ||
      catalogueTemplates[store.category] ||
      [];
  const gallery = [...new Set([
    ...(detail.gallery || []),
    ...(!detail.gallery?.length && store.image ? [store.image] : []),
    ...catalogue.map(item => item.image).filter(Boolean),
  ])].slice(0, 4);
  const customerRatingTotal = customerReviews.reduce((total, review) => total + review.rating, 0);
  const totalRatings = customerReviews.length;
  const averageRating = totalRatings
    ? (customerRatingTotal / totalRatings).toFixed(1)
    : '0.0';
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = customerReviews.filter(review => review.rating === stars).length;
    return {
      stars,
      percentage: totalRatings ? Math.round((count / totalRatings) * 100) : 0,
    };
  });
  const tabs = ['Offers', 'Catalogue', 'About the brand'];

  return (
    <main className="store-detail-page">
      <div className="store-detail-topbar">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <FiArrowLeft /> <span>Back</span>
        </button>
        <div className="breadcrumbs" aria-label="Breadcrumb">
          <button onClick={() => navigate('/home')}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/stores')}>Stores</button>
          <span>/</span>
          <span className="current">{store.name}</span>
        </div>
      </div>

      <section className="store-hero" aria-label={`${store.name} store gallery`}>
        <div className={`store-gallery store-gallery-count-${Math.min(gallery.length, 4)}`}>
          {gallery.slice(0, 4).map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${store.name} ${index === 0 ? 'store' : `gallery ${index + 1}`}`}
              className={`store-gallery-image store-gallery-image-${index + 1}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
          {gallery.length > 4 && <span className="gallery-count">+{gallery.length - 4} photos</span>}
        </div>

        <div className="store-profile">
          <div className="store-profile-main">
            <img className="store-profile-logo" src={store.image} alt="" />
            <div className="store-profile-info">
              <p className="store-eyebrow">{store.category}{store.subCategory ? ` · ${store.subCategory}` : ''}</p>
              <h1 className="store-profile-name">{store.name}</h1>
              <p className="store-profile-address">
                <FiMapPin />
                <span>{detail.address || store.location || store.city || 'Location details unavailable'}</span>
              </p>
              {detail.openingHours && (
                <p className="store-profile-timing">
                  <FiClock />
                  <span>{detail.openingHours}</span>
                </p>
              )}
            </div>
          </div>

          <div className="store-profile-actions">
            <button className="profile-action-btn" onClick={handleDirections}>
              <FiNavigation /> Directions
            </button>
            <button className="profile-action-btn" onClick={handleShare}>
              <FiShare /> Share
            </button>
            {store.phone && (
              <a className="profile-action-btn" href={`tel:${store.phone}`}>
                <FiPhone /> Call
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="store-content-section">
        <nav className="store-detail-tabs" aria-label="Store details">
          {tabs.map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? 'store-detail-tab active' : 'store-detail-tab'}
              onClick={() => setActiveTab(tab)}
              aria-current={activeTab === tab ? 'page' : undefined}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === 'Offers' && (
          <div className="store-offers-panel">
            <div className="store-section-heading">
              <div>
                <p className="store-eyebrow">EXCLUSIVE FOR YOU</p>
                <h2>Offers at {store.name}</h2>
              </div>
            </div>
            {offers.length ? (
              <div className="store-offer-grid">
                {offers.map((offer, index) => (
                  <article className="store-offer-card" key={`${offer.title}-${index}`}>
                    <span className="offer-label">STORE OFFER</span>
                    <h3>{offer.title}</h3>
                    {offer.description && <p>{offer.description}</p>}
                    {offer.validUntil && <span className="offer-validity">Valid until {offer.validUntil}</span>}
                  </article>
                ))}
              </div>
            ) : (
              <p className="store-empty-state">There are no current offers for this store.</p>
            )}
          </div>
        )}

        {activeTab === 'Catalogue' && (
          <div className="store-catalogue-panel">
            <div className="store-section-heading">
              <div>
                <p className="store-eyebrow">EXPLORE THE LATEST</p>
                <h2>Catalogue</h2>
              </div>
            </div>
            {catalogue.length ? (
              <div className="store-catalogue-grid">
                {catalogue.map((collection, index) => (
                  <article className="store-catalogue-card" key={`${collection.title}-${index}`}>
                    <img src={collection.image} alt="" loading="lazy" />
                    <div className="catalogue-card-copy">
                      <span>{collection.label || 'COLLECTION'}</span>
                      <h3>{collection.title}</h3>
                      {collection.description && <p>{collection.description}</p>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="store-empty-state">A catalogue for this store will be available soon.</p>
            )}
          </div>
        )}

        {activeTab === 'About the brand' && (
          <div className="store-about-panel">
            <div>
              <p className="store-eyebrow">GET TO KNOW US</p>
              <h2>About {store.name}</h2>
              <p className="store-about-description">
                {detail.description || `${store.name} is a ${store.category?.toLowerCase() || 'local'} store in ${store.location || store.city || 'your area'}. Visit the store to explore its latest offerings.`}
              </p>
              {detail.highlights?.length > 0 && (
                <ul className="store-highlights">
                  {detail.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
                </ul>
              )}
            </div>
            <img
              className="store-about-image"
              src={detail.aboutImage || gallery[0] || store.image}
              alt={`${store.name} store`}
              loading="lazy"
            />
          </div>
        )}
      </section>

      <section className="store-reviews-section" aria-labelledby="store-reviews-heading">
        <div className="store-reviews-summary">
          <h2 id="store-reviews-heading">Customer reviews</h2>
          <div className="store-rating-overview">
            <span className="store-rating-stars" aria-label={`${averageRating} out of 5 stars`}>
              {'★'.repeat(Math.floor(Number(averageRating)))}
              {'☆'.repeat(5 - Math.floor(Number(averageRating)))}
            </span>
            <span><strong>{averageRating}</strong> out of 5</span>
          </div>
          <p className="store-rating-count">{totalRatings.toLocaleString()} customer ratings</p>

          <div className="store-rating-breakdown">
            {ratingDistribution.map(item => (
              <div className="store-rating-row" key={item.stars}>
                <span>{item.stars} star{item.stars === 1 ? '' : 's'}</span>
                <div
                  className="store-rating-track"
                  role="img"
                  aria-label={`${item.stars} star ratings: ${item.percentage}%`}
                >
                  <span style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="store-rating-percentage">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="store-review-cta">
          <h3>Review this store</h3>
          <p>Share your experience with other customers</p>
          <button
            type="button"
            className="store-write-review-btn"
            onClick={() => {
              setReviewError('');
              setIsReviewFormOpen(true);
            }}
          >
            Write a store review
          </button>
        </div>

        {customerReviews.length > 0 && (
          <div className="store-customer-reviews">
            <h3>Recent customer reviews</h3>
            {customerReviews.map(review => (
              <article className="store-customer-review" key={review.id}>
                <div className="store-customer-review-meta">
                  <strong>{review.author}</strong>
                  <span>{review.date}</span>
                </div>
                <span className="store-customer-review-stars" aria-label={`${review.rating} out of 5 stars`}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </span>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {isReviewFormOpen && (
        <div className="store-review-modal-backdrop" onClick={() => setIsReviewFormOpen(false)}>
          <section
            className="store-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="store-review-form-heading"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              className="store-review-modal-close"
              aria-label="Close review form"
              onClick={() => setIsReviewFormOpen(false)}
            >
              ×
            </button>
            <h2 id="store-review-form-heading">Review {store.name}</h2>
            <form onSubmit={handleReviewSubmit}>
              <fieldset className="store-review-rating-picker">
                <legend>Your rating</legend>
                <div>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      type="button"
                      key={rating}
                      className={rating <= reviewRating ? 'selected' : ''}
                      aria-label={`${rating} star${rating === 1 ? '' : 's'}`}
                      aria-pressed={reviewRating === rating}
                      onClick={() => setReviewRating(rating)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="store-review-label" htmlFor="store-review-text">
                Your review
              </label>
              <textarea
                id="store-review-text"
                value={reviewText}
                onChange={event => setReviewText(event.target.value)}
                placeholder={`What was your experience at ${store.name}?`}
                rows={5}
                required
              />
              {reviewError && <p className="store-review-error" role="alert">{reviewError}</p>}
              <button className="store-review-submit-btn" type="submit">Submit review</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

export default StoreDetail;
