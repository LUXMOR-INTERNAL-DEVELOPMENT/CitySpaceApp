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
        const data = await response.json();

        console.log("All data:", data);
        console.log("Looking for id:", id);

        const selected = data.find((item) => item.id == id);
        console.log("Selected:", selected);

        setEvent(selected);
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
          <p className="category">{event.category}</p>
          <p className="price">{event.price}</p>

          <div className="rating">
            <span className="star">★</span>
            <span>{event.rating}</span>
          </div>

          <p className="description">
            Experience the best of {event.title}. A wonderful {event.category} event!
          </p>

          <button className="book-btn">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Eventdetail;