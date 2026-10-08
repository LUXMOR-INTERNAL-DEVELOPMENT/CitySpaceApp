import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import FilterModal from "../FilterModal";
import Footer from "../../footer/Footer";
import { MOCK_VENUES, getSportHeading } from "../../../data/mockVenuesData";
import "./PlayVenuesPage.css";

const FILTER_PILLS = [
  { id: "under-5km", label: "Under 5 km", type: "distance" },
  { id: "badminton", label: "Badminton", type: "sport", sportKey: "badminton" },
  { id: "swimming", label: "Swimming", type: "sport", sportKey: "swimming" },
  { id: "pickleball", label: "Pickleball", type: "sport", sportKey: "pickleball" },
  { id: "turf-football", label: "Turf Football", type: "sport", sportKey: "turf-football" },
  { id: "table-tennis", label: "Table Tennis", type: "sport", sportKey: "table-tennis" },
];

export default function PlayVenuesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize selectedSport from location state or query parameter
  const initialSport = location.state?.selectedSport || searchParams.get("sport") || null;

  const [allVenues, setAllVenues] = useState(MOCK_VENUES);
  const [venues, setVenues] = useState(MOCK_VENUES);
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [isUnder5km, setIsUnder5km] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCourtType, setSelectedCourtType] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Favorites state persisted to localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("cityspace_fav_venues");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (venueId) => {
    setFavorites((prev) => {
      const updated = prev.includes(venueId)
        ? prev.filter((id) => id !== venueId)
        : [...prev, venueId];
      try {
        localStorage.setItem("cityspace_fav_venues", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save favorite:", err);
      }
      return updated;
    });
  };

  // Sync state if navigation or query params change
  useEffect(() => {
    const urlSport = searchParams.get("sport") || location.state?.selectedSport || null;
    if (urlSport !== selectedSport) {
      setSelectedSport(urlSport);
    }
  }, [searchParams, location.state]);

  // Load venues from /db.json if available, otherwise use MOCK_VENUES
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("/db.json");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.Play) && data.Play.length > 0) {
            setAllVenues(data.Play);
            return;
          }
        }
      } catch {
        // Fallback to MOCK_VENUES if fetch fails
      }
      setAllVenues(MOCK_VENUES);
    };

    fetchVenues();
  }, []);

  // Update query params when sport changes without cluttering browser history
  useEffect(() => {
    if (selectedSport) {
      setSearchParams({ sport: selectedSport }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [selectedSport, setSearchParams]);

  // Handle Backspace key on keyboard to navigate directly to /play
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Backspace" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        navigate("/play");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Strict Filter & Sort logic (Ensures selected sport ONLY shows matching venues)
  useEffect(() => {
    let filtered = [...allVenues];

    // Selected sport filter (Strict matching: ensures NO mixing across sports)
    if (selectedSport) {
      const target = selectedSport.toLowerCase().trim();
      filtered = filtered.filter((v) => {
        const vSport = (v.sport || "").toLowerCase().trim();
        if (vSport === target) return true;
        if (Array.isArray(v.sports) && v.sports.map(s => s.toLowerCase()).includes(target)) {
          return true;
        }
        return false;
      });
    }

    // Search query filter within the selected sport / venues
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (v) =>
          (v.title || "").toLowerCase().includes(q) ||
          (v.location || "").toLowerCase().includes(q) ||
          (v.sportName || "").toLowerCase().includes(q) ||
          (v.tags && v.tags.some((t) => t.toLowerCase().includes(q))) ||
          (v.courts || "").toLowerCase().includes(q) ||
          (v.features && v.features.some((f) => f.toLowerCase().includes(q)))
      );
    }

    // Distance <= 5km
    if (isUnder5km) {
      filtered = filtered.filter((v) => typeof v.distance === "number" && v.distance <= 5.0);
    }

    // Court type filter
    if (selectedCourtType) {
      filtered = filtered.filter((v) => {
        const text = (v.courts || "") + " " + (v.features || []).join(" ");
        return text.toLowerCase().includes(selectedCourtType.toLowerCase());
      });
    }

    // Dimension filter
    if (selectedDimension) {
      filtered = filtered.filter((v) => {
        const text = (v.courts || "") + " " + (v.title || "");
        return text.toLowerCase().includes(selectedDimension.toLowerCase());
      });
    }

    // Area filter
    if (selectedArea) {
      filtered = filtered.filter((v) =>
        (v.location || "").toLowerCase().includes(selectedArea.toLowerCase())
      );
    }

    // Amenity filter
    if (selectedAmenity) {
      filtered = filtered.filter((v) =>
        (v.features || []).some((f) => f.toLowerCase().includes(selectedAmenity.toLowerCase()))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0));
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0));
    } else if (sortBy === "rating-desc") {
      filtered.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
    } else if (sortBy === "distance-asc") {
      filtered.sort((a, b) => (a.distance || 99) - (b.distance || 99));
    }

    setVenues(filtered);
    setVisibleCount(8);
  }, [allVenues, selectedSport, selectedArea, selectedAmenity, isUnder5km, selectedCourtType, selectedDimension, sortBy, searchQuery]);

  const handlePillClick = (pill) => {
    if (pill.type === "distance") {
      setIsUnder5km((prev) => !prev);
    } else if (pill.type === "sport") {
      setSelectedSport((prev) => (prev === pill.sportKey ? null : pill.sportKey));
    }
  };

  const handleApplyFilterModal = ({ sortBy, sport, area, courtType, dimension, amenity }) => {
    setSortBy(sortBy);
    if (sport !== undefined) setSelectedSport(sport || null);
    setSelectedArea(area || "");
    setSelectedCourtType(courtType || "");
    setSelectedDimension(dimension || "");
    setSelectedAmenity(amenity || "");
  };

  const handleVenueClick = (venue) => {
    navigate(`/play/venue/${venue.id}`, {
      state: { venue },
    });
  };

  const handleBackToSports = () => {
    navigate("/play");
  };

  return (
    <div className="play-venues-page-root">
      <div className="venues-page-wrapper">
        {/* Top Header Row with Back to Sports Button */}
        <div className="venues-page-topbar">
          <button
            type="button"
            className="venues-page-back-btn"
            onClick={handleBackToSports}
            aria-label="Back to Sports"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Back to Sports</span>
          </button>

          <div className="venues-page-title-box">
            <h1 className="venues-page-title">
              {getSportHeading(selectedSport, venues.length)}
            </h1>
            <span className="venues-count-badge">
              {venues.length} {venues.length === 1 ? "venue" : "venues"} available
            </span>
          </div>

          {/* Search Input in Topbar */}
          <div className="venues-page-search">
            <svg
              className="venues-search-svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="venues-search-field"
              placeholder={`Search in ${selectedSport ? selectedSport.replace(/-/g, " ") : "sports"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="venues-search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="district-filter-bar">
          <button
            type="button"
            className={`district-filter-btn ${Boolean(isUnder5km || sortBy || selectedCourtType || selectedDimension) ? "active" : ""}`}
            onClick={() => setIsFilterModalOpen(true)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
            <span>Filters</span>
            <span className="district-caret">⌄</span>
          </button>

          {FILTER_PILLS.map((pill) => {
            const isPillActive =
              (pill.type === "distance" && isUnder5km) ||
              (pill.type === "sport" && selectedSport === pill.sportKey);

            return (
              <button
                key={pill.id}
                type="button"
                className={`district-pill-btn ${isPillActive ? "active" : ""}`}
                onClick={() => handlePillClick(pill)}
              >
                {pill.label}
                {isPillActive && <span className="pill-active-check">✕</span>}
              </button>
            );
          })}

          {(selectedSport || selectedArea || selectedAmenity || isUnder5km || sortBy || selectedCourtType || selectedDimension || searchQuery) && (
            <button
              type="button"
              className="district-clear-all-btn"
              onClick={() => {
                setSelectedSport(null);
                setSelectedArea("");
                setSelectedAmenity("");
                setIsUnder5km(false);
                setSortBy("");
                setSelectedCourtType("");
                setSelectedDimension("");
                setSearchQuery("");
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Venues Cards Grid */}
        {loading ? (
          <div className="venues-page-loading">
            <div className="venues-spinner" />
            <p>Loading sports venues...</p>
          </div>
        ) : venues.length === 0 ? (
          <div className="venues-empty-box">
            <p>No venues found matching your active filters.</p>
            <button
              type="button"
              className="venues-empty-reset"
              onClick={() => {
                setSelectedSport(null);
                setIsUnder5km(false);
                setSearchQuery("");
                setSortBy("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="district-venues-grid">
              {venues.slice(0, visibleCount).map((venue) => {
                const isFav = favorites.includes(venue.id);
                const displayFeatures = Array.isArray(venue.features)
                  ? venue.features.slice(0, 3)
                  : [];

                return (
                  <article
                    key={venue.id}
                    className="district-venue-card"
                    onClick={() => handleVenueClick(venue)}
                  >
                    {/* Venue Image */}
                    <div className="district-venue-img-wrap">
                      <img
                        src={venue.image}
                        alt={venue.title}
                        className="district-venue-img"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80";
                        }}
                      />

                      {/* Top Badges overlay */}
                      <div className="card-top-badges">
                        <span className="card-sport-badge">
                          {venue.sportIcon || "🏅"} {venue.sportName || "Sports"}
                        </span>
                        {venue.badge && (
                          <span
                            className="card-custom-badge"
                            style={{ backgroundColor: venue.badgeColor || "#059669" }}
                          >
                            {venue.badge}
                          </span>
                        )}
                      </div>

                      {/* Favorite Heart Button */}
                      <button
                        type="button"
                        className={`venue-fav-btn ${isFav ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(venue.id);
                        }}
                        aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={isFav ? "#ef4444" : "none"}
                          stroke={isFav ? "#ef4444" : "#ffffff"}
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>

                      {venue.rating && (
                        <div className="district-card-rating">
                          ★ {venue.rating}
                          {venue.reviewsCount && (
                            <span className="rating-review-count"> ({venue.reviewsCount})</span>
                          )}
                        </div>
                      )}

                      {/* Next Slot ribbon */}
                      {venue.nextSlot && (
                        <div className="card-slot-banner">
                          <span className="slot-dot" />
                          <span>Next Slot: {venue.nextSlot}</span>
                        </div>
                      )}
                    </div>

                    {/* Venue Details */}
                    <div className="district-venue-body">
                      <div className="district-venue-title-row">
                        <h3 className="district-venue-title">{venue.title}</h3>
                        <span className="venue-verified-badge" title="Verified Arena">✓</span>
                      </div>

                      <p className="district-venue-subtitle">
                        <svg
                          className="venue-sub-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{venue.location || "Chennai"}</span>
                        {venue.distance ? ` • ${venue.distance} km` : ""}
                        {venue.landmark ? ` (${venue.landmark})` : ""}
                      </p>

                      {venue.courts && (
                        <div className="district-venue-courts-info">
                          <svg
                            className="venue-court-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="2" y="3" width="20" height="14" rx="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          <span title={venue.courts}>{venue.courts}</span>
                        </div>
                      )}

                      {displayFeatures.length > 0 && (
                        <div className="district-venue-features">
                          {displayFeatures.map((feat, idx) => (
                            <span key={idx} className="venue-feature-pill">
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="district-venue-footer">
                        <div className="district-venue-price-wrap">
                          <span className="price-sub-label">Starting</span>
                          <span className="district-venue-price">
                            {venue.price || `₹${venue.priceNum || 500} / hr`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {venues.length > visibleCount ? (
              <div className="venues-load-more-container">
                <button
                  type="button"
                  className="load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                >
                  <span>Load More Venues (Showing {Math.min(visibleCount, venues.length)} of {venues.length})</span>
                  <svg
                    className="load-more-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            ) : venues.length > 6 ? (
              <div className="venues-all-loaded-container">
                <span className="all-loaded-text">✨ All {venues.length} venues loaded</span>
                <button
                  type="button"
                  className="show-less-btn"
                  onClick={() => setVisibleCount(6)}
                >
                  Show Less ↑
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialSortBy={sortBy}
        initialSport={selectedSport}
        initialArea={selectedArea}
        initialCourtType={selectedCourtType}
        initialDimension={selectedDimension}
        initialAmenity={selectedAmenity}
        onApply={handleApplyFilterModal}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
