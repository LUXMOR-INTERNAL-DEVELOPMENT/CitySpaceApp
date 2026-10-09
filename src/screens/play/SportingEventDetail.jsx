import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Footer from "../footer/Footer";
import { EVENT_DETAILS_DATA } from "../../data/sportingEventsData";
import "./SportingEventDetail.css";

export default function SportingEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const eventId = id || location.state?.event?.id || "se1";
  const matchedEvent = EVENT_DETAILS_DATA[eventId] || EVENT_DETAILS_DATA.se1;

  const [eventData, setEventData] = useState(() => {
    const passed = location.state?.event;
    return {
      ...matchedEvent,
      ...(passed || {}),
      title: passed?.title || matchedEvent.title,
      date: passed?.date || matchedEvent.date,
      venueName: passed?.venueName || passed?.location || matchedEvent.venueName,
      startingPrice: passed?.startingPrice || passed?.priceNum || matchedEvent.startingPrice,
      bannerImage: passed?.bannerImage || matchedEvent.bannerImage,
      ticketCategories: matchedEvent.ticketCategories,
    };
  });

  const [isReadMore, setIsReadMore] = useState(false);
  const [isViewMoreRules, setIsViewMoreRules] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBookTickets = () => {
    navigate(`/sporting-events/${eventData.id || "se1"}/tickets`, {
      state: { event: eventData },
    });
  };

  return (
    <div className="sporting-detail-root">
      <div className="sporting-detail-container">
        {/* Header Title & Date */}
        <header className="sporting-detail-header">
          <h1 className="sporting-detail-title">{eventData.title}</h1>
          <p className="sporting-detail-date">{eventData.date}</p>
        </header>

        {/* Big Banner Poster */}
        <div className="sporting-banner-wrapper">
          <img
            src={eventData.bannerImage || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"}
            alt={eventData.title}
            className="sporting-banner-img"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        {/* Two column content layout */}
        <div className="sporting-content-layout">
          {/* Left Column: About, Things to know, Organized by */}
          <div className="sporting-left-column">
            {/* About */}
            <section className="sporting-section">
              <h2 className="sporting-section-title">About</h2>
              <p className="sporting-about-desc">
                {eventData.aboutText}
                {isReadMore && <span>{eventData.aboutMoreText}</span>}
              </p>
              <button
                type="button"
                className="sporting-toggle-btn"
                onClick={() => setIsReadMore(!isReadMore)}
              >
                {isReadMore ? "Read less ⌃" : "Read more ⌄"}
              </button>
            </section>

            {/* Things to know */}
            <section className="sporting-section">
              <h2 className="sporting-section-title">Things to know</h2>
              <ul className="sporting-bullet-list">
                {eventData.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
                {isViewMoreRules && (
                  <>
                    <li>Baggage counter and first-aid stations are available at the holding area.</li>
                    <li>No pets or bicycles are allowed along the race route for safety reasons.</li>
                  </>
                )}
              </ul>
              <button
                type="button"
                className="sporting-toggle-btn"
                onClick={() => setIsViewMoreRules(!isViewMoreRules)}
              >
                {isViewMoreRules ? "View less ⌃" : "View more ›"}
              </button>
            </section>

            {/* Organized by */}
            <section className="sporting-section">
              <h2 className="sporting-section-title">Organized by</h2>
              <div className="sporting-organizer-card">
                <div className="organizer-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="organizer-info">
                  <h3 className="organizer-name">{eventData.organizer.name}</h3>
                  <div className="organizer-stats">
                    <span className="organizer-stat-item">
                      <strong>{eventData.organizer.rating}</strong>
                    </span>
                    <span className="stat-dot">•</span>
                    <span className="organizer-stat-item">{eventData.organizer.eventsCount}</span>
                    <span className="stat-dot">•</span>
                    <span className="organizer-stat-item">{eventData.organizer.hostingDuration}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Floating action box + Location & Timeline info cards */}
          <div className="sporting-right-column">
            {/* Top sticky booking card */}
            <div className="sporting-price-card">
              <div className="sporting-price-col">
                <span className="sporting-price-val">₹{eventData.startingPrice}</span>
                <span className="sporting-price-suffix">onwards</span>
              </div>
              <button
                type="button"
                className="sporting-book-btn"
                onClick={handleBookTickets}
              >
                Book tickets
              </button>
            </div>

            {/* Venue Location card */}
            <div className="sporting-info-card">
              <div className="info-card-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="info-card-text">
                <h4 className="info-card-title">{eventData.venueName}</h4>
                <p className="info-card-subtitle">{eventData.distance}</p>
              </div>
              <div className="info-card-arrow">›</div>
            </div>

            {/* Schedule / Timeline card */}
            <div className="sporting-info-card">
              <div className="info-card-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="info-card-text">
                <h4 className="info-card-title">{eventData.scheduleTime}</h4>
                <p className="info-card-subtitle">{eventData.scheduleSubtitle}</p>
              </div>
              <div className="info-card-arrow">›</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
