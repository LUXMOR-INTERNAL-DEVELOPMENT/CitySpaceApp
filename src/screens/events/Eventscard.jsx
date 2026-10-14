import { Link } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import FavoriteButton from "../../components/FavoriteButton";
import "./Eventscard.css";

const Eventscard = ({ id, title, location, date, category, price, rating, image, showImage = true, ...details }) => {
  const experience = { ...details, id, title, location, date, category, price, rating, image };

  return (
    <article className="event-card">
      <FavoriteButton
        className="card-favorite-button"
        item={{ ...experience, id: `event:${id}`, route: `/events/${id}/book`, state: { experience } }}
      />
      <Link className="event-card-link" to={`/events/${id}`}>
        <div className="event-card-image" aria-hidden="true">
          {showImage && image && <img src={image} alt="" className="card-img" loading="lazy" />}
        </div>
        <div className="event-card-content">
          {location && (
            <p className="event-location">
              <HiOutlineLocationMarker aria-hidden="true" />
              <span>{location}</span>
            </p>
          )}
          <h3 className="event-title">{title}</h3>
          {date && <p className="event-date">{date}</p>}
          {(category || price) && <p className="event-meta">{[category, price].filter(Boolean).join(" · ")}</p>}
          {rating != null && (
            <div className="event-rating">
              <span className="star">★</span>
              <span>{rating}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default Eventscard;