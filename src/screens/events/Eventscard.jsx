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
  );
};

export default Eventscard;