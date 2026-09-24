import { useNavigate } from "react-router-dom";
import "./Eventscard.css";

const Eventscard = ({ id, title, category, price, rating, image }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate("/date-time", {
      state: {
        experience: { id, title, category, price, rating, image },
      },
    });
  };

  return (
    <div className="event-card" onClick={handleCardClick}>
      <div className="event-card-image">
        <img src={image} alt={title} className="card-img" />
      </div>
      <div className="event-card-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-meta">{category} · {price}</p>
        <div className="event-rating">
          <span className="star">★</span>
          <span>{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default Eventscard;