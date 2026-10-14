import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Eventdetail.css";

const Eventdetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load event details");
        const data = await response.json();
        const allEvents = [
          ...(data.Events || []),
          ...(data.TheatreEvents || []),
          ...(data.MusicEvents || []),
          ...(data.ComedyEvents || []),
          ...(data.SportsEvents || []),
          ...(data.AllEvents || []),
        ];
        const selected = allEvents.find((item) => String(item.id) === id);
        setEvent(selected || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <p style={{ textAlign: "center", padding: "50px" }}>Loading...</p>;
  }

  if (!event) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Event not found</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Events
      </button>

      <div className="details-card">
        <img src={event.image} alt={event.title} className="details-img" />

        <div className="details-content">
          <h1>{event.title}</h1>
          <p className="event-detail-location">{event.location}</p>
          <p className="event-detail-date">{event.date}</p>
          <p className="event-detail-price">Tickets from {event.price}</p>

          <p className="event-detail-rating">Rated {event.rating} / 5</p>

          <p className="event-detail-description">
            {event.description}
          </p>

          <button
            className="book-btn"
            type="button"
            onClick={() => navigate(`/events/${event.id}/book`, { state: { experience: event } })}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Eventdetail;