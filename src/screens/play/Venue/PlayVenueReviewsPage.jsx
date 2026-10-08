import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./PlayVenueReviewsPage.css";
import { MOCK_VENUES } from "../../../data/mockVenuesData";

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

export default function PlayVenueReviewsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateVenue = location.state?.venue;
  const [venue, setVenue] = useState(stateVenue || null);
  const [loading, setLoading] = useState(!stateVenue);
  const [reviewsList] = useState(location.state?.reviews || INITIAL_REVIEWS);
  const [filterRating, setFilterRating] = useState("all");

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
        console.error(err);
      } finally {
        setLoading(false);
      }
      const fallback = MOCK_VENUES.find((v) => String(v.id) === String(id));
      setVenue(fallback || null);
    };

    fetchVenue();
  }, [id, stateVenue]);

  const totalCount = reviewsList.length;
  const excellentCount = reviewsList.filter((r) => r.rating === 5).length;
  const veryGoodCount = reviewsList.filter((r) => r.rating === 4).length;
  const averageCount = reviewsList.filter((r) => r.rating === 3).length;
  const poorCount = reviewsList.filter((r) => r.rating === 2).length;
  const terribleCount = reviewsList.filter((r) => r.rating === 1).length;
  const avgRating = totalCount > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : "3.8";

  const filteredReviews = filterRating === "all"
    ? reviewsList
    : reviewsList.filter((r) => r.rating === Number(filterRating));

  if (loading) {
    return (
      <div className="reviews-page-loading">
        <div className="reviews-page-spinner" />
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="play-venue-reviews-page">
      {/* Top Header */}
      <div className="reviews-page-topbar">
        <button
          type="button"
          className="reviews-page-back-btn"
          onClick={() => navigate(`/play/venue/${id}`)}
        >
          ← Back to Venue
        </button>

        <h1 className="reviews-page-top-title">
          {venue?.title || "Sports Venue"} Reviews
        </h1>

        <button
          type="button"
          className="reviews-page-book-btn"
          onClick={() => navigate(`/play/venue/${id}`)}
        >
          Book a game
        </button>
      </div>

      <div className="reviews-page-container">
        {/* Left Side: Rating Summary Card */}
        <div className="reviews-page-summary-col">
          <div className="reviews-summary-card">
            <h2 className="reviews-summary-heading">Overall Rating</h2>
            <div className="reviews-summary-score-line">
              <span className="reviews-summary-big-score">{avgRating}</span>
              <span className="reviews-summary-star">★</span>
            </div>
            <div className="reviews-summary-total-label">
              Based on {totalCount} verified player ratings
            </div>
            <p className="reviews-summary-policy-note">
              Ratings can only be made by players who have played at this venue.
            </p>

            {/* Breakdown bars */}
            <div className="reviews-page-breakdown-card">
              <div className="reviews-bar-row">
                <span className="reviews-bar-label">Excellent</span>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${(excellentCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="reviews-bar-count">{excellentCount}</span>
              </div>

              <div className="reviews-bar-row">
                <span className="reviews-bar-label">Very Good</span>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${(veryGoodCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="reviews-bar-count">{veryGoodCount}</span>
              </div>

              <div className="reviews-bar-row">
                <span className="reviews-bar-label">Average</span>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${(averageCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="reviews-bar-count">{averageCount}</span>
              </div>

              <div className="reviews-bar-row">
                <span className="reviews-bar-label">Poor</span>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${(poorCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="reviews-bar-count">{poorCount}</span>
              </div>

              <div className="reviews-bar-row">
                <span className="reviews-bar-label">Terrible</span>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${(terribleCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="reviews-bar-count">{terribleCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Filter Pills + All Comments List */}
        <div className="reviews-page-list-col">
          {/* Filter Pills */}
          <div className="reviews-filter-pills-row">
            <button
              type="button"
              className={`reviews-pill ${filterRating === "all" ? "active" : ""}`}
              onClick={() => setFilterRating("all")}
            >
              All Comments ({totalCount})
            </button>
            <button
              type="button"
              className={`reviews-pill ${filterRating === "5" ? "active" : ""}`}
              onClick={() => setFilterRating("5")}
            >
              5 ★ ({excellentCount})
            </button>
            <button
              type="button"
              className={`reviews-pill ${filterRating === "4" ? "active" : ""}`}
              onClick={() => setFilterRating("4")}
            >
              4 ★ ({veryGoodCount})
            </button>
            <button
              type="button"
              className={`reviews-pill ${filterRating === "3" ? "active" : ""}`}
              onClick={() => setFilterRating("3")}
            >
              3 ★ ({averageCount})
            </button>
            <button
              type="button"
              className={`reviews-pill ${filterRating === "2" ? "active" : ""}`}
              onClick={() => setFilterRating("2")}
            >
              2 ★ ({poorCount})
            </button>
            <button
              type="button"
              className={`reviews-pill ${filterRating === "1" ? "active" : ""}`}
              onClick={() => setFilterRating("1")}
            >
              1 ★ ({terribleCount})
            </button>
          </div>

          {/* All Comments Cards */}
          <div className="reviews-page-cards">
            {filteredReviews.length === 0 ? (
              <div className="reviews-empty-state">
                No {filterRating} ★ comments found.
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const badgeClass =
                  rev.rating >= 4 ? "green" : rev.rating === 3 ? "blue" : "red";

                return (
                  <div key={rev.id} className="reviews-page-card-item">
                    <div className="reviews-avatar-circle">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>

                    <div className="reviews-card-body">
                      <div className="reviews-card-header-row">
                        <span className="reviews-author-name">{rev.name}</span>
                        <span className="reviews-separator-dot">·</span>
                        <span className={`reviews-score-badge ${badgeClass}`}>
                          {rev.rating} ★
                        </span>
                      </div>
                      <div className="reviews-posted-date">{rev.date}</div>
                      <p className="reviews-comment-text">{rev.comment}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
