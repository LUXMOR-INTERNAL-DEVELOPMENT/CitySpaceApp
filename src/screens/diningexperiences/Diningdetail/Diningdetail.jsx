import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./Diningdetail.css";

const Diningdetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || "/dining";
  const [diningItems, setDiningItems] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadDiningData = async () => {
      try {
        const response = await fetch("/dining.json", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Dining data request failed (${response.status})`);
        }

        const data = await response.json();
        if (!Array.isArray(data?.trending)) {
          throw new Error("Dining data has an invalid format");
        }

        setDiningItems(data.trending);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Failed to load dining detail data:", error);
        setLoadError(error.message);
      }
    };

    loadDiningData();
    return () => controller.abort();
  }, []);

  if (loadError) {
    return (
      <div className="detail-page">
        <div className="status-msg error">Failed to load restaurant: {loadError}</div>
        <button className="back-btn" onClick={() => navigate(returnTo)}>
          ← Back
        </button>
      </div>
    );
  }

  if (!diningItems) {
    return (
      <div className="detail-page">
        <div className="status-msg">Loading restaurant...</div>
      </div>
    );
  }

  const found = diningItems.find((item) => String(item.id) === String(id));
  const restaurant = found
    ? {
        id: found.id,
        name: found.name || "Dining Experience",
        rating: Number(found.rating || 4.5),
        reviews: found.reviews || 0,
        priceRange: found.priceRange || "₹999",
        category: found.category || "Dining",
        image: found.image,
        location: found.location || "Chennai",
        timings: found.timings || "Open daily",
        phone: found.phone || "+91 90000 00000",
        description: found.description || "A curated dining experience.",
      }
    : null;

  if (!restaurant) {
    return (
      <div className="detail-page">
        <div className="status-msg error">Restaurant not found</div>
        <button className="back-btn" onClick={() => navigate(returnTo)}>
          ← Back
        </button>
      </div>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${restaurant.name}, ${restaurant.location}`
  )}`;

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(returnTo)}>
        ← Back to Trending
      </button>

      <div className="detail-card">
        <div className="detail-img">
          <img src={restaurant.image} alt={restaurant.name} />
        </div>

        <div className="detail-content">
          <h1>{restaurant.name}</h1>

          <div className="meta">
            <span className="rating">
              {restaurant.rating} ★ ({restaurant.reviews})
            </span>
            <span className="price">{restaurant.priceRange}</span>
            <span className="category">{restaurant.category}</span>
          </div>

          <p className="location">📍 {restaurant.location}</p>
          <p className="timings">🕒 {restaurant.timings}</p>
          <p className="phone">📞 {restaurant.phone}</p>

          <p className="description">{restaurant.description}</p>

          <div className="detail-actions">
            <button className="book-btn">Book Now</button>
            <a
              className="book-btn directions-btn"
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diningdetail;