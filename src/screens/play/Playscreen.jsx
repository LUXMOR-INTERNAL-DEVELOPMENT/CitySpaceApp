import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExploreSports from "./ExploreSports/ExploreSports";
import FilterModal from "./FilterModal";
import Footer from "../footer/Footer";
import { MOCK_VENUES } from "../../data/mockVenuesData";
import "./Playscreen.css";
import "./Venue/PlayVenuesPage.css";

const FILTER_PILLS = [
  { id: "under-5km", label: "Under 5 km", type: "distance" },
  { id: "badminton", label: "Badminton", type: "sport", sportKey: "badminton" },
  { id: "swimming", label: "Swimming", type: "sport", sportKey: "swimming" },
  { id: "pickleball", label: "Pickleball", type: "sport", sportKey: "pickleball" },
  { id: "turf-football", label: "Turf Football", type: "sport", sportKey: "turf-football" },
  { id: "table-tennis", label: "Table Tennis", type: "sport", sportKey: "table-tennis" },
];

export default function Playscreen() {
  const [allVenues, setAllVenues] = useState(MOCK_VENUES);
  const [sportsList, setSportsList] = useState([]);
  const [sportingEvents, setSportingEvents] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [isUnder5km, setIsUnder5km] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedCourtType, setSelectedCourtType] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [venues, setVenues] = useState(MOCK_VENUES);
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
  const [banner, setBanner] = useState({
    title: "Game on. Find your court.",
    subtitle: "Book verified badminton courts, football turfs, cricket nets and more.",
    badge: "SPORTS & ARENAS",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  // Fetch Play venues, ExploreSports, SportingEvents and PlayBanner dynamically from db.json
  useEffect(() => {
    const fetchPlayData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load /db.json");
        const data = await response.json();

        if (Array.isArray(data.Play)) {
          setAllVenues(data.Play);
          setVenues(data.Play);
        }
        if (Array.isArray(data.ExploreSports)) {
          setSportsList(data.ExploreSports);
        }
        if (Array.isArray(data.SportingEvents)) {
          setSportingEvents(data.SportingEvents);
        }
        if (data.PlayBanner) {
          setBanner(data.PlayBanner);
        }
      } catch (err) {
        console.error("Error loading play data from db.json:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayData();
  }, []);

  // Filter & Sort venues based on active criteria (including search)
  useEffect(() => {
    let filtered = [...allVenues];

    // Search filter: match title, location, sportName
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((v) =>
        (v.title || "").toLowerCase().includes(q) ||
        (v.location || "").toLowerCase().includes(q) ||
        (v.sportName || "").toLowerCase().includes(q) ||
        (v.courts || "").toLowerCase().includes(q)
      );
    }

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

    if (isUnder5km) {
      filtered = filtered.filter((v) => typeof v.distance === "number" && v.distance <= 5.0);
    }

    if (selectedCourtType) {
      filtered = filtered.filter((v) => {
        const text = (v.courts || "") + " " + (v.features || []).join(" ");
        return text.toLowerCase().includes(selectedCourtType.toLowerCase());
      });
    }

    if (selectedDimension) {
      filtered = filtered.filter((v) => {
        const text = (v.courts || "") + " " + (v.title || "");
        return text.toLowerCase().includes(selectedDimension.toLowerCase());
      });
    }

    if (selectedArea) {
      filtered = filtered.filter((v) =>
        (v.location || "").toLowerCase().includes(selectedArea.toLowerCase())
      );
    }

    if (selectedAmenity) {
      filtered = filtered.filter((v) =>
        (v.features || []).some((f) => f.toLowerCase().includes(selectedAmenity.toLowerCase()))
      );
    }

    // Apply Sorting
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
    setVisibleCount(6);
  }, [selectedSport, selectedArea, selectedAmenity, isUnder5km, selectedCourtType, selectedDimension, sortBy, searchQuery, allVenues]);

  const handleApplyFilterModal = ({ sortBy, sport, area, courtType, dimension, amenity }) => {
    setSortBy(sortBy);
    if (sport !== undefined) setSelectedSport(sport || null);
    setSelectedArea(area || "");
    setSelectedCourtType(courtType || "");
    setSelectedDimension(dimension || "");
    setSelectedAmenity(amenity || "");
  };

  const handlePillClick = (pill) => {
    if (pill.type === "distance") {
      setIsUnder5km((prev) => !prev);
    } else if (pill.type === "sport") {
      setSelectedSport((prev) => (prev === pill.sportKey ? null : pill.sportKey));
    }
  };

  const handleBookVenue = (venue) => {
    navigate(`/play/venue/${venue.id}`, {
      state: { venue },
    });
  };

  const handleEventClick = (event) => {
    navigate("/booking", {
      state: {
        experience: {
          id: event.id,
          title: event.title,
          name: event.title,
          category: event.category || "Sporting Event",
          price: event.priceNum || 499,
          location: event.location,
          image: event.image,
        },
      },
    });
  };

  return (
    <div className="playscreen-root">
      <div className="play-page-container">
        {/* Header */}
        <div className="play-header">
          <h1>Play &amp; Sports in Chennai</h1>
          <p>Book courts, turfs, sports activities and gaming zones instantly.</p>
        </div>

        {/* Sports Banner — split-panel: text left, hero image right */}
        {banner && (
          <div className="play-split-banner">
            {/* Left: text content */}
            <div className="play-split-text">
              <span className="play-banner-badge">{banner.badge || "SPORTS & ARENAS"}</span>
              <h2 className="play-split-title">{banner.title}</h2>
              <p className="play-split-subtitle">{banner.subtitle}</p>
              <div className="play-split-tags">
                <span className="play-split-tag">⚡ Instant Booking</span>
                <span className="play-split-tag">✅ 100% Verified</span>
                <span className="play-split-tag">📍 Chennai</span>
              </div>
            </div>

            {/* Right: hero sports image */}
            <div className="play-split-image-wrap">
              <img
                src={banner.image || "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85"}
                alt="Sports arena"
                className="play-split-image"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85";
                }}
              />
              <div className="play-split-image-overlay" />
            </div>
          </div>
        )}

        {/* Explore Sports Component */}
        <ExploreSports
          sports={sportsList}
          selectedSport={selectedSport}
          onSelectSport={(sportId) => {
            if (sportId) {
              navigate(`/play/venues?sport=${sportId}`, { state: { selectedSport: sportId } });
            } else {
              setSelectedSport(null);
            }
          }}
        />

        {/* Sporting Events near you (Directly below Explore Sports) */}
        <section className="sporting-events-section">
          <h2 className="section-main-title">Sporting Events near you</h2>
          <div className="sporting-events-list">
            {sportingEvents.length > 0 ? (
              sportingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="sporting-event-card"
                  onClick={() => handleEventClick(evt)}
                >
                  <div className="sporting-event-poster-wrapper">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="sporting-event-poster"
                    />
                  </div>
                  <div className="sporting-event-details">
                    <div className="sporting-event-location">
                      <svg
                        className="location-compass-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 19 21 12 17 5 21 12 2" />
                      </svg>
                      <span>{evt.location}</span>
                    </div>
                    <h3 className="sporting-event-title">{evt.title}</h3>
                    <p className="sporting-event-date">{evt.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="sporting-event-card"
                onClick={() =>
                  handleEventClick({
                    id: "se1",
                    title: "Chennai Fitness Run 2026",
                    location: "Olcott Memorial Higher Secondary School, Besant Nagar",
                    date: "Sun, 15 Nov, 5:00 AM",
                    image:
                      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80",
                  })
                }
              >
                <div className="sporting-event-poster-wrapper">
                  <img
                    src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=600&q=80"
                    alt="Chennai Fitness Run 2026"
                    className="sporting-event-poster"
                  />
                </div>
                <div className="sporting-event-details">
                  <div className="sporting-event-location">
                    <svg
                      className="location-compass-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 19 21 12 17 5 21 12 2" />
                    </svg>
                    <span>Olcott Memorial Higher Secondary School, Besant Nagar</span>
                  </div>
                  <h3 className="sporting-event-title">Chennai Fitness Run 2026</h3>
                  <p className="sporting-event-date">Sun, 15 Nov, 5:00 AM</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* All Sports Venues Section */}
        <section className="venues-section">
          <div className="venues-section-header">
            <div className="venues-title-row">
              <h2 className="section-main-title">All Sports Venues</h2>
              <button
                type="button"
                className="venues-see-all-btn"
                onClick={() => navigate("/play/venues")}
                aria-label="View all sports venues"
              >
                See All Venues ({allVenues.length}) →
              </button>
            </div>
            {/* Search bar */}
            <div className="venues-search-wrap">
              <svg
                className="venues-search-icon"
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
                className="venues-search-input"
                placeholder="Search by venue, sport or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="venues-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills Bar */}
          <div className="venues-filter-bar">
            <button
              type="button"
              className={`filter-btn-main ${Boolean(isUnder5km || selectedSport || sortBy || selectedCourtType || selectedDimension) ? "active" : ""}`}
              onClick={() => setIsFilterModalOpen(true)}
            >
              <svg
                width="14"
                height="14"
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
              <span className="dropdown-caret">⌄</span>
            </button>

            {FILTER_PILLS.map((pill) => {
              const isPillActive =
                (pill.type === "distance" && isUnder5km) ||
                (pill.type === "sport" && selectedSport === pill.sportKey);

              return (
                <button
                  key={pill.id}
                  type="button"
                  className={`filter-pill-btn ${isPillActive ? "active" : ""}`}
                  onClick={() => handlePillClick(pill)}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Venues Grid */}
          {loading ? (
            <p className="loading">Loading venues from db.json...</p>
          ) : venues.length === 0 ? (
            <div className="no-venues-box">
              <p>No venues found matching your active filters.</p>
              <button
                type="button"
                className="reset-filter-btn"
                onClick={() => {
                  setSelectedSport(null);
                  setIsUnder5km(false);
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
                      onClick={() => handleBookVenue(venue)}
                    >
                      <div className="district-venue-img-wrap">
                        {venue.image && (
                          <img
                            src={venue.image}
                            alt={venue.title}
                            className="district-venue-img"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        )}

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

                        {/* Rating pill */}
                        {venue.rating && (
                          <div className="district-card-rating">
                            ★ {venue.rating}
                            {venue.reviewsCount && (
                              <span className="rating-review-count"> ({venue.reviewsCount})</span>
                            )}
                          </div>
                        )}

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

                        {/* Next Slot ribbon */}
                        {venue.nextSlot && (
                          <div className="card-slot-banner">
                            <span className="slot-dot" />
                            <span>Next Slot: {venue.nextSlot}</span>
                          </div>
                        )}
                      </div>

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
        </section>
      </div>

      {/* Filter Modal matching reference image */}
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
