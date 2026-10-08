
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MOCK_VENUES } from "../../../data/mockVenuesData";
import "./PlayVenueDetail.css";

// Fallback images pool per sport
const SPORT_FALLBACK_IMAGES = {
  badminton: [
    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1599472434775-92e5571e9929?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1000&q=80",
  ],
  pickleball: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1599586120429-48281b6f0eae?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
  ],
  "box-cricket": [
    "https://images.unsplash.com/photo-1529900241451-b0e6e4093cb4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
  ],
  "turf-football": [
    "https://images.unsplash.com/photo-1529900241451-b0e6e4093cb4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1000&q=80",
  ],
  swimming: [
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1000&q=80",
  ],
  "cricket-nets": [
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1531415074868-036b1c57e329?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1529900241451-b0e6e4093cb4?auto=format&fit=crop&w=1000&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1529900241451-b0e6e4093cb4?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80",
  ],
};

// Generate 14 upcoming dates for slot booking
const getUpcomingDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      dateObj: d,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateNum: String(d.getDate()).padStart(2, "0"),
      monthShort: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      monthName: d.toLocaleDateString("en-US", { month: "short" }),
      formatted: d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });
  }
  return dates;
};

// Format start hour and duration into a clean range e.g. "06:00 AM - 07:00 AM" or "06:00 AM - 08:00 AM"
const formatSlotRange = (startHour, durationHours) => {
  const to12Hr = (h) => {
    const period = h >= 12 && h < 24 ? "PM" : "AM";
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${String(hour12).padStart(2, "0")}:00 ${period}`;
  };

  const endH = startHour + durationHours;
  return `${to12Hr(startHour)} - ${to12Hr(endH)}`;
};

const MORNING_START_HOURS = [6, 7, 8, 9, 10];
const AFTERNOON_START_HOURS = [12, 13, 14, 15, 16];
const EVENING_START_HOURS = [17, 18, 19, 20, 21, 22];

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "deep81",
    rating: 5,
    date: "26th September, 2025",
    comment: "Superb experience! Courts are very clean, high-grade synthetic grass, well lit up in the evening, and friendly staff. Will definitely visit again.",
  },
  {
    id: 2,
    name: "reddymahesh080",
    rating: 1,
    date: "19th May, 2025",
    comment: "Very bad experience they was very rood and there is no proper response from owner Don't even think about to book this venue. Facilities were not clean and timing was mismanaged.",
  },
  {
    id: 3,
    name: "karthik_sports",
    rating: 5,
    date: "12th August, 2025",
    comment: "Amazing turf quality! Clean changing rooms and lighting was spot on for our evening game. Highly recommend!",
  },
  {
    id: 4,
    name: "arun_p",
    rating: 4,
    date: "4th July, 2025",
    comment: "Good location with ample parking space. Rackets provided were in great condition.",
  },
  {
    id: 5,
    name: "priya_badminton",
    rating: 5,
    date: "18th June, 2025",
    comment: "Booked the morning 7 AM slot. Peaceful atmosphere, fresh air, and net height was perfect.",
  },
  {
    id: 6,
    name: "suresh_cricketer",
    rating: 5,
    date: "2nd June, 2025",
    comment: "Box cricket pitch has nice bounce and boundaries are well padded. We had a tournament here with friends and loved it.",
  },
  {
    id: 7,
    name: "anand_v",
    rating: 3,
    date: "14th May, 2025",
    comment: "Decent place, but parking was a bit tight during peak hours. Turf quality is satisfactory.",
  },
  {
    id: 8,
    name: "vikram_r",
    rating: 5,
    date: "28th April, 2025",
    comment: "Prompt service by the venue manager. Drinking water and clean restrooms available.",
  },
  {
    id: 9,
    name: "naveen_chennai",
    rating: 4,
    date: "11th April, 2025",
    comment: "Good lighting for night matches. Price is reasonable compared to other venues in Kilpauk.",
  },
  {
    id: 10,
    name: "sanjay_kumar",
    rating: 1,
    date: "24th March, 2025",
    comment: "Slot was delayed by 20 minutes because the previous group wouldn't leave and staff didn't intervene.",
  },
];

export default function PlayVenueDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateVenue = location.state?.venue;
  const [venue, setVenue] = useState(stateVenue || null);
  const [loading, setLoading] = useState(!stateVenue);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState("all");
  const [activeNavSection, setActiveNavSection] = useState("photos");
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState("");

  // Duration & Slot booking state
  const upcomingDates = getUpcomingDates();
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0]);
  const [durationHours, setDurationHours] = useState(1);
  const [selectedStartHour, setSelectedStartHour] = useState(18); // Default 06:00 PM

  // Calculate active formatted slot
  const selectedSlot = formatSlotRange(selectedStartHour, durationHours);

  // Price calculations based on duration
  const basePriceNum = venue?.priceNum || 800;
  const totalPrice = basePriceNum * durationHours;

  // Fetch venue if not provided in state
  useEffect(() => {
    if (stateVenue) return;

    const fetchVenue = async () => {
      try {
        setLoading(true);
        const res = await fetch("/db.json");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.Play)) {
            const match = data.Play.find((v) => String(v.id) === String(id));
            if (match) {
              setVenue(match);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error loading venue:", err);
      } finally {
        setLoading(false);
      }
      // Fallback to MOCK_VENUES
      const fallbackMatch = MOCK_VENUES.find((v) => String(v.id) === String(id));
      setVenue(fallbackMatch || null);
    };

    fetchVenue();
  }, [id, stateVenue]);

  // Backspace key navigation back to venues
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Backspace" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        navigate("/play/venues");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (loading) {
    return (
      <div className="venue-detail-loading">
        <div className="venue-detail-spinner" />
        <p>Loading venue details...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="venue-detail-notfound">
        <h2>Venue not found</h2>
        <p>We could not find the requested sports arena.</p>
        <button
          type="button"
          className="venue-detail-back-btn"
          onClick={() => navigate("/play/venues")}
        >
          ← Back to All Venues
        </button>
      </div>
    );
  }

  // Build images array
  const sportKey = venue.sport || "default";
  const defaultList = SPORT_FALLBACK_IMAGES[sportKey] || SPORT_FALLBACK_IMAGES.default;
  const images =
    Array.isArray(venue.images) && venue.images.length > 0
      ? venue.images
      : [venue.image, ...defaultList.filter((img) => img !== venue.image)].slice(0, 4);

  const displayTags =
    Array.isArray(venue.tags) && venue.tags.length > 0
      ? venue.tags
      : [venue.sportName || "Sports"];

  // Proceed to booking with selected date, duration and time
  const handleProceedBooking = () => {
    navigate("/screen2", {
      state: {
        experience: {
          id: venue.id,
          title: venue.title,
          name: venue.title,
          category: venue.sportName,
          price: totalPrice,
          priceNum: totalPrice,
          location: venue.location,
          image: venue.image,
          rating: venue.rating,
          duration: `${durationHours} hr${durationHours > 1 ? "s" : ""}`,
          isPlayVenue: true,
          isPlayGame: true,
          isGame: true,
          sport: venue.sport,
          sportName: venue.sportName,
          courts: venue.courts,
        },
        bookingDate: selectedDate.formatted,
        bookingTime: `${selectedSlot} (${durationHours} hr${durationHours > 1 ? "s" : ""})`,
        durationHours,
        isPlayGame: true,
      },
    });
  };

  // Reviews Statistics & Handlers
  const totalReviewsCount = reviewsList.length;
  const excellentCount = reviewsList.filter((r) => r.rating === 5).length;
  const veryGoodCount = reviewsList.filter((r) => r.rating === 4).length;
  const averageCount = reviewsList.filter((r) => r.rating === 3).length;
  const poorCount = reviewsList.filter((r) => r.rating === 2).length;
  const terribleCount = reviewsList.filter((r) => r.rating === 1).length;
  const avgRating = totalReviewsCount > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : "3.8";

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newAuthor.trim() || "Player_" + Math.floor(100 + Math.random() * 900),
      rating: Number(newRating),
      date: "Just now",
      comment: newComment.trim(),
    };

    setReviewsList((prev) => [newReview, ...prev]);
    setNewComment("");
    setNewAuthor("");
    setNewRating(5);
    setReviewSubmittedMsg("Thank you! Your comment and rating have been posted.");
    setTimeout(() => setReviewSubmittedMsg(""), 4500);
  };

  const filteredReviews = filterRating === "all"
    ? reviewsList
    : reviewsList.filter((r) => r.rating === Number(filterRating));

  return (
    <div className="venue-detail-page">
      {/* Top Header Row with Back Button */}
      <div className="venue-detail-topbar">
        <button
          type="button"
          className="venue-detail-back-btn"
          onClick={() => navigate("/play/venues")}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back to Venues</span>
        </button>

        {/* Subnav links matching Image 1 */}
        <div className="venue-subnav-links">
          <button
            type="button"
            className="venue-subnav-btn"
            onClick={() => {
              const el = document.querySelector(".venue-gallery-wrapper");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Photos
          </button>
          <button
            type="button"
            className="venue-subnav-btn"
            onClick={() => {
              const el = document.getElementById("venue-address-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Location
          </button>
          <button
            type="button"
            className="venue-subnav-btn"
            onClick={() => {
              const el = document.getElementById("venue-amenities-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Amenities
          </button>
          <button
            type="button"
            className="venue-subnav-btn active"
            onClick={() => {
              const el = document.getElementById("venue-reviews-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Reviews
          </button>
        </div>

        <button
          type="button"
          className="venue-subnav-book-btn"
          onClick={() => {
            const el = document.querySelector(".venue-booking-slot-card");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Book a game
        </button>
      </div>

      {/* Main Container */}
      <div className="venue-detail-container">
        {/* Left Column: Images + Overview */}
        <div className="venue-detail-left">
          {/* Header Title Info */}
          <div className="venue-hero-header">
            <h1 className="venue-hero-title">{venue.title}</h1>

            {venue.rating && (
              <div className="venue-hero-rating-badge">
                ★ {venue.rating} ({venue.reviews || 110} reviews)
              </div>
            )}


            {/* Tags Row */}
            <div className="venue-hero-tags">
              {displayTags.map((tag, idx) => (
                <span key={idx} className="venue-tag-badge">
                  {tag}
                </span>
              ))}
              {venue.courts && (
                <span className="venue-court-badge">
                  🏟️ {venue.courts}
                </span>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="venue-gallery-wrapper">
            <div className="venue-main-image-box">
              <img
                src={images[activeImageIndex] || venue.image}
                alt={`${venue.title} view ${activeImageIndex + 1}`}
                className="venue-main-image"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80";
                }}
              />
              <span className="venue-image-counter">
                📷 {activeImageIndex + 1} / {images.length}
              </span>
            </div>

            {/* Thumbnail Row */}
            <div className="venue-thumbs-row">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`venue-thumb-btn ${idx === activeImageIndex ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="venue-thumb-img"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dark Venue Info Card (Matching Image 1 with Image 2 About section below) */}
          <div className="venue-dark-info-card">
            {/* 1. Address Section */}
            <div className="venue-dark-section">
              <h2 className="venue-dark-heading">Address</h2>
              <p className="venue-dark-address-text">
                {venue.address || "New no.41&43, Old No.19&20, Halls Rd, Agasthiya Nagar, Kilpauk"}
              </p>
              <div className="venue-dark-address-actions">
                <a
                  className="venue-dark-btn-directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    venue.address || `${venue.title || ""}, Halls Rd, Kilpauk, Chennai`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                </a>
                <a
                  className="venue-dark-btn-phone"
                  href={`tel:${venue.phone || "+919876543210"}`}
                  title="Call Venue"
                  aria-label="Call Venue"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 2. Venue info Section */}
            <div className="venue-dark-section">
              <h2 className="venue-dark-heading">Venue info</h2>
              <div className="venue-dark-subpill-row">
                <span className="venue-dark-subpill">
                  <span className="venue-dark-subpill-bold">Pitch</span>
                  <span className="venue-dark-subpill-dot">•</span>
                  <span>{venue.courts || "1 Nets"}</span>
                </span>
              </div>

              <div className="venue-dark-features-grid">
                {/* Equipment Provided */}
                <div className="venue-dark-feature-item">
                  <div className="venue-dark-feature-icon equipment-icon">
                    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                      {/* Crossed cricket bats & ball */}
                      <rect x="7" y="5" width="4.5" height="18" rx="2" transform="rotate(-30 7 5)" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
                      <rect x="25" y="3" width="4.5" height="18" rx="2" transform="rotate(30 25 3)" fill="#eab308" stroke="#854d0e" strokeWidth="1" />
                      <line x1="8" y1="21" x2="5" y2="28" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
                      <line x1="28" y1="21" x2="31" y2="28" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                      <path d="M15 17 Q18 19 21 17" stroke="#ffffff" strokeWidth="0.8" fill="none" strokeDasharray="1,1" />
                    </svg>
                  </div>
                  <span className="venue-dark-feature-text">Equipment Provided</span>
                </div>

                {/* Artificial Turf */}
                <div className="venue-dark-feature-item">
                  <div className="venue-dark-feature-icon turf-icon">
                    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                      <rect x="4" y="4" width="28" height="28" rx="4" fill="#15803d" />
                      <rect x="4" y="9" width="28" height="5" fill="#16a34a" />
                      <rect x="4" y="19" width="28" height="5" fill="#16a34a" />
                      <rect x="4" y="29" width="28" height="3" fill="#16a34a" />
                      <rect x="8" y="7" width="20" height="22" rx="2" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" fill="none" />
                      <line x1="8" y1="18" x2="28" y2="18" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" />
                      <circle cx="18" cy="18" r="3.5" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" fill="none" />
                    </svg>
                  </div>
                  <span className="venue-dark-feature-text">Artificial Turf</span>
                </div>
              </div>
            </div>

            {/* 3. Amenities Section */}
            <div className="venue-dark-section">
              <h2 className="venue-dark-heading">Amenities</h2>
              <div className="venue-dark-amenities-grid">
                {/* UPI Accepted */}
                <div className="venue-dark-amenity-item">
                  <div className="venue-dark-amenity-icon upi-badge">
                    <span>UPI</span>
                  </div>
                  <span className="venue-dark-amenity-label">UPI Accepted</span>
                </div>

                {/* Toilets */}
                <div className="venue-dark-amenity-item">
                  <div className="venue-dark-amenity-icon blue-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 3h10v6a5 5 0 01-5 5H12a5 5 0 01-5-5V3z" />
                      <path d="M10 14v4a2 2 0 002 2h0a2 2 0 002-2v-4" />
                      <path d="M8 20h8" />
                    </svg>
                  </div>
                  <span className="venue-dark-amenity-label">Toilets</span>
                </div>

                {/* Changing Rooms */}
                <div className="venue-dark-amenity-item">
                  <div className="venue-dark-amenity-icon blue-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4a2 2 0 012 2c0 1.2-.8 2-2 2.5L2.5 15.5A2 2 0 004 19h16a2 2 0 001.5-3.5L12 8.5" />
                    </svg>
                  </div>
                  <span className="venue-dark-amenity-label">Changing Rooms</span>
                </div>

                {/* Free Parking */}
                <div className="venue-dark-amenity-item">
                  <div className="venue-dark-amenity-icon blue-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 17h14v-5l-2-4H7l-2 4v5z" />
                      <circle cx="7.5" cy="17.5" r="1.5" fill="#38bdf8" />
                      <circle cx="16.5" cy="17.5" r="1.5" fill="#38bdf8" />
                    </svg>
                  </div>
                  <span className="venue-dark-amenity-label">Free Parking</span>
                </div>

                {/* Showers */}
                <div className="venue-dark-amenity-item">
                  <div className="venue-dark-amenity-icon blue-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h7a4 4 0 014 4v2" />
                      <path d="M11 10h8l-1 3H12l-1-3z" />
                      <line x1="13" y1="17" x2="13" y2="17.01" />
                      <line x1="15" y1="16" x2="15" y2="16.01" />
                      <line x1="17" y1="17" x2="17" y2="17.01" />
                    </svg>
                  </div>
                  <span className="venue-dark-amenity-label">Showers</span>
                </div>
              </div>
            </div>

            {/* 4. About Section (Image 2) */}
            <div className="venue-dark-section venue-dark-about-section" id="venue-about-section">
              <h2 className="venue-dark-heading">About</h2>
              <p className="venue-dark-about-text">
                {aboutExpanded
                  ? "Welcome to our sports facility, a space designed to bring players together and create an enjoyable, high-quality sporting experience. We provide a well-maintained environment suitable for casual play and friendly matches. Whether you're visiting to stay active, improve your skills, or simply have a good time with friends, our facility is designed to meet your sporting needs. Clean spaces, top-notch equipment, and a welcoming community await you every time you play."
                  : "Welcome to our sports facility, a space designed to bring players together and create an enjoyable, high-quality sporting experience. We provide a well-maintained environment suitable for casual play and friendly matches. Whether you're visiting to stay active, improve your skills, or simply have a good time with friends, our facility is..."}
              </p>
              <button
                type="button"
                className="venue-dark-read-more-btn"
                onClick={() => setAboutExpanded((prev) => !prev)}
              >
                {aboutExpanded ? "Read less ˄" : "Read more ˅"}
              </button>
            </div>

            {/* 5. Reviews Section (Image 1 added down below Image 2 About) */}
            <div className="venue-dark-section venue-dark-reviews-section" id="venue-reviews-section">
              <div className="venue-reviews-section-top">
                <div>
                  <h2 className="venue-dark-heading">Reviews</h2>
                  <div className="venue-reviews-rating-header">
                    <span className="venue-reviews-score-bold">
                      {avgRating} ★
                    </span>
                    <span className="venue-reviews-dot">·</span>
                    <span className="venue-reviews-count-text">
                      {totalReviewsCount} ratings
                    </span>
                  </div>
                  <p className="venue-reviews-subtext">
                    Ratings can only be made by players who have played at this venue.
                  </p>
                </div>
                <button
                  type="button"
                  className="venue-open-reviews-page-btn"
                  onClick={() => navigate(`/play/venue/${id}/reviews`, { state: { venue, reviews: reviewsList } })}
                >
                  Open Full Reviews Page ↗
                </button>
              </div>

              {/* Rating Breakdown Card matching Image 1 format */}
              <div className="venue-rating-breakdown-card">
                <div className="rating-breakdown-row">
                  <span className="rating-breakdown-label">Excellent</span>
                  <div className="rating-breakdown-track">
                    <div
                      className="rating-breakdown-bar"
                      style={{ width: `${totalReviewsCount > 0 ? (excellentCount / totalReviewsCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="rating-breakdown-count">{excellentCount}</span>
                </div>
                <div className="rating-breakdown-row">
                  <span className="rating-breakdown-label">Very Good</span>
                  <div className="rating-breakdown-track">
                    <div
                      className="rating-breakdown-bar"
                      style={{ width: `${totalReviewsCount > 0 ? (veryGoodCount / totalReviewsCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="rating-breakdown-count">{veryGoodCount}</span>
                </div>
                <div className="rating-breakdown-row">
                  <span className="rating-breakdown-label">Average</span>
                  <div className="rating-breakdown-track">
                    <div
                      className="rating-breakdown-bar"
                      style={{ width: `${totalReviewsCount > 0 ? (averageCount / totalReviewsCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="rating-breakdown-count">{averageCount}</span>
                </div>
                <div className="rating-breakdown-row">
                  <span className="rating-breakdown-label">Poor</span>
                  <div className="rating-breakdown-track">
                    <div
                      className="rating-breakdown-bar"
                      style={{ width: `${totalReviewsCount > 0 ? (poorCount / totalReviewsCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="rating-breakdown-count">{poorCount}</span>
                </div>
                <div className="rating-breakdown-row">
                  <span className="rating-breakdown-label">Terrible</span>
                  <div className="rating-breakdown-track">
                    <div
                      className="rating-breakdown-bar"
                      style={{ width: `${totalReviewsCount > 0 ? (terribleCount / totalReviewsCount) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="rating-breakdown-count">{terribleCount}</span>
                </div>
              </div>

              {/* Preview Reviews List (Top 2 only matching screenshot) */}
              <div className="venue-reviews-cards-grid">
                {reviewsList.slice(0, 2).map((rev) => {
                  const badgeColor =
                    rev.rating >= 4 ? "green" : rev.rating === 3 ? "blue" : "red";

                  return (
                    <div key={rev.id} className="venue-user-review-card">
                      <div className="venue-review-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <div className="venue-review-body">
                        <div className="venue-review-header-line">
                          <span className="venue-review-author">{rev.name}</span>
                          <span className="venue-review-dot">·</span>
                          <span className={`venue-badge-pill ${badgeColor}`}>
                            {rev.rating} ★
                          </span>
                        </div>
                        <div className="venue-review-date-str">{rev.date}</div>
                        {rev.comment && (
                          <p className="venue-review-comment">{rev.comment}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action button: Opens dedicated Reviews page with all comments */}
              <div className="venue-reviews-footer-action">
                <button
                  type="button"
                  className="venue-see-all-reviews-btn"
                  onClick={() => navigate(`/play/venue/${id}/reviews`, { state: { venue, reviews: reviewsList } })}
                >
                  See all {totalReviewsCount} reviews
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Slot Card (Displayed directly at bottom / side of image) */}
        <div className="venue-detail-right">
          <div className="venue-booking-slot-card">
            <div className="slot-card-header">
              <span className="slot-badge">⚡ INSTANT BOOKING</span>
              <div className="slot-price-row">
                <span className="slot-price-label">Starts at</span>
                <span className="slot-price-val">{venue.price || "₹500 / hr"}</span>
              </div>
            </div>

            {/* 1. Date Selection Bar with Month Badges matching screenshot */}
            <div className="slot-picker-section">
              <div className="district-date-picker-bar">
                {upcomingDates.map((item, idx) => {
                  const isSelected = selectedDate.formatted === item.formatted;
                  const isFirstOfMonth = idx === 0 || item.monthShort !== upcomingDates[idx - 1]?.monthShort;

                  return (
                    <React.Fragment key={idx}>
                      {isFirstOfMonth && (
                        <div className="district-month-pill">
                          <span>{item.monthShort}</span>
                        </div>
                      )}
                      <button
                        type="button"
                        className={`district-date-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedDate(item)}
                      >
                        <span className="district-date-day">{item.dayName}</span>
                        <span className="district-date-num">{item.dateNum}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* 2. Duration Selector (matching screenshot) */}
            <div className="district-duration-row">
              <div className="district-duration-info">
                <h3 className="district-duration-title">Duration</h3>
                <p className="district-duration-sub">Duration of the slots</p>
              </div>

              <div className="district-duration-counter">
                <button
                  type="button"
                  className="duration-stepper-btn"
                  disabled={durationHours <= 1}
                  onClick={() => setDurationHours((prev) => Math.max(1, prev - 1))}
                  aria-label="Decrease duration"
                >
                  −
                </button>
                <span className="duration-count-label">
                  {durationHours} {durationHours > 1 ? "hrs" : "hr"}
                </span>
                <button
                  type="button"
                  className="duration-stepper-btn"
                  disabled={durationHours >= 5}
                  onClick={() => setDurationHours((prev) => Math.min(5, prev + 1))}
                  aria-label="Increase duration"
                >
                  +
                </button>
              </div>
            </div>

            {/* 3. Time Slots Available */}
            <div className="slot-picker-section">
              <div className="slot-picker-header">
                <h3 className="slot-picker-title">Time slots available</h3>
                <span className="slot-current-selection">
                  Selected: <strong>{selectedSlot}</strong>
                </span>
              </div>

              {/* Evening / Prime Slots */}
              <div className="slot-category-group">
                <span className="slot-category-label">🌆 Evening &amp; Night (Popular)</span>
                <div className="slot-chips-grid">
                  {EVENING_START_HOURS.map((startH, idx) => {
                    const slotText = formatSlotRange(startH, durationHours);
                    const isSelected = selectedStartHour === startH;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`slot-chip-btn ${isSelected ? "selected" : ""} popular`}
                        onClick={() => setSelectedStartHour(startH)}
                      >
                        {slotText}
                        <span className="slot-fire-icon">🔥</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Morning Slots */}
              <div className="slot-category-group">
                <span className="slot-category-label">🌅 Morning</span>
                <div className="slot-chips-grid">
                  {MORNING_START_HOURS.map((startH, idx) => {
                    const slotText = formatSlotRange(startH, durationHours);
                    const isSelected = selectedStartHour === startH;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`slot-chip-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedStartHour(startH)}
                      >
                        {slotText}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div className="slot-category-group">
                <span className="slot-category-label">☀️ Afternoon</span>
                <div className="slot-chips-grid">
                  {AFTERNOON_START_HOURS.map((startH, idx) => {
                    const slotText = formatSlotRange(startH, durationHours);
                    const isSelected = selectedStartHour === startH;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`slot-chip-btn ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedStartHour(startH)}
                      >
                        {slotText}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="slot-summary-box">
              <button
                type="button"
                className="confirm-slot-btn"
                onClick={handleProceedBooking}
              >
                Book Slot (₹{totalPrice.toLocaleString("en-IN")}) →
              </button>
            </div>

            {/* Guarantees */}
            <div className="slot-perks-row">
              <span>✓ Instant Confirmation</span>
              <span>✓ Free Equipment Rental</span>
              <span>✓ 100% Verified Arena</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Full Reviews Page / Modal */}
      {isReviewsModalOpen && (
        <div
          className="venue-reviews-modal-overlay"
          onClick={() => setIsReviewsModalOpen(false)}
        >
          <div
            className="venue-reviews-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="venue-reviews-modal-header">
              <div>
                <h2 className="venue-reviews-modal-title">
                  All Reviews &amp; Ratings
                </h2>
                <div className="venue-reviews-modal-subtitle">
                  {venue.title} · <span className="modal-rating-score">{avgRating} ★</span> ({totalReviewsCount} reviews)
                </div>
              </div>
              <button
                type="button"
                className="venue-reviews-modal-close-btn"
                onClick={() => setIsReviewsModalOpen(false)}
                aria-label="Close reviews modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="venue-reviews-modal-body">
              {/* Filter Pills */}
              <div className="venue-reviews-filter-pills">
                <button
                  type="button"
                  className={`review-filter-pill ${filterRating === "all" ? "active" : ""}`}
                  onClick={() => setFilterRating("all")}
                >
                  All ({totalReviewsCount})
                </button>
                <button
                  type="button"
                  className={`review-filter-pill ${filterRating === "5" ? "active" : ""}`}
                  onClick={() => setFilterRating("5")}
                >
                  5 ★ ({excellentCount})
                </button>
                <button
                  type="button"
                  className={`review-filter-pill ${filterRating === "4" ? "active" : ""}`}
                  onClick={() => setFilterRating("4")}
                >
                  4 ★ ({veryGoodCount})
                </button>
                <button
                  type="button"
                  className={`review-filter-pill ${filterRating === "3" ? "active" : ""}`}
                  onClick={() => setFilterRating("3")}
                >
                  3 ★ ({averageCount})
                </button>
                <button
                  type="button"
                  className={`review-filter-pill ${filterRating === "2" ? "active" : ""}`}
                  onClick={() => setFilterRating("2")}
                >
                  2 ★ ({poorCount})
                </button>
                <button
                  type="button"
                  className={`review-filter-pill ${filterRating === "1" ? "active" : ""}`}
                  onClick={() => setFilterRating("1")}
                >
                  1 ★ ({terribleCount})
                </button>
              </div>

              {/* Filtered Reviews List */}
              <div className="venue-modal-reviews-list">
                {filteredReviews.length === 0 ? (
                  <div className="venue-no-reviews-msg">
                    No {filterRating} ★ reviews found. Be the first to leave one!
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const badgeColor =
                      rev.rating >= 4 ? "green" : rev.rating === 3 ? "blue" : "red";

                    return (
                      <div key={rev.id} className="venue-user-review-card in-modal">
                        <div className="venue-review-avatar">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                        <div className="venue-review-body">
                          <div className="venue-review-header-line">
                            <span className="venue-review-author">{rev.name}</span>
                            <span className="venue-review-dot">·</span>
                            <span className={`venue-badge-pill ${badgeColor}`}>
                              {rev.rating} ★
                            </span>
                          </div>
                          <div className="venue-review-date-str">{rev.date}</div>
                          {rev.comment && (
                            <p className="venue-review-comment">{rev.comment}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
