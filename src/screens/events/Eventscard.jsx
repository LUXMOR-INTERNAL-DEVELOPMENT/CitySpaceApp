import { Link } from "react-router-dom";
import { HiOutlineLocationMarker } from "react-icons/hi";
import "./Eventscard.css";

const Eventscard = ({ id, title, location, date, image, showImage = true }) => {
  return (
    <Link className="event-card" to={`/events/${id}`}>
      <div className="event-card-image" aria-hidden="true">
        {showImage && image && <img src={image} alt="" loading="lazy" />}
      </div>
      <div className="event-card-content">
        <p className="event-location">
          <HiOutlineLocationMarker aria-hidden="true" />
          <span>{location}</span>
        </p>
        <h3 className="event-title">{title}</h3>
        <p className="event-date">{date}</p>
      </div>
    </Link>
import FavoriteButton from "../../components/FavoriteButton";
import "./Eventscard.css";

const Eventscard = ({ id, title, category, price, rating, image, ...details }) => {
  const experience = { ...details, id, title, category, price, rating, image };

  return (
    <article className="event-card">
      <FavoriteButton
        className="card-favorite-button"
        item={{ ...experience, id: `event:${id}`, route: `/events/${id}/book`, state: { experience } }}
      />
      <Link
        className="event-card-link"
        to={`/events/${id}/book`}
        state={{ experience }}
        aria-label={`Book tickets for ${title}`}
      >
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
      </Link>
    </article>
  );
};

export default Eventscard;