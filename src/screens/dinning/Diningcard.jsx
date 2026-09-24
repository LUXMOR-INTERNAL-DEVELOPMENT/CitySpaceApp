import { useNavigate } from "react-router-dom";
import "./Diningcard.css";

const Diningcard = ({ id, title, location, price, rating, image }) => {
  const navigate = useNavigate();

  return (
    <div className="dining-card" onClick={() => navigate(`/dining/${id}`)}>
      <div className="dining-card-image">
        <img src={image} alt={title} className="card-img" />
      </div>

      <div className="dining-card-content">
        <h3 className="dining-title">{title}</h3>
        <p className="dining-meta">{location} · {price}</p>
        <div className="dining-rating">
          <span className="star">★</span>
          <span>{rating}</span>
        </div>
      </div>
    </div>
  );
};

export default Diningcard;