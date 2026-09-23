import { useState, useEffect } from "react";
import Eventscard from "./Eventscard";
import "./Eventscreen.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) {
          throw new Error("Could not load events data");
        }

        const data = await response.json();
        if (!Array.isArray(data.Events)) {
          throw new Error("Events data is missing or invalid");
        }

        setEvents(data.Events);
      } catch (err) {
        console.error(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Events in your city</h1>
        <p>Concerts, comedy and culture.</p>
      </div>

      {/* Top Banners */}
      <div className="top-banners">
        {/* Left Banner */}
        <div className="main-banner">
          <div className="banner-text">
            <h2>Tonight belongs to you.</h2>
            <p>Book the moments everyone talks about</p>
          </div>
          <div className="banner-icon">🎵</div>
        </div>

        {/* Right Side Image */}
        <div className="banner-image">
          <img
            src="/assest/boys.jpeg"
            alt="Friends"
            className="friends-img"
          />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="loading">Loading events...</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <Eventscard key={event.id} {...event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;