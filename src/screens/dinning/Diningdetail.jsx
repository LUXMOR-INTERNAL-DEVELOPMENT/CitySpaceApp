import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Diningdetail.css";

const Diningdetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dining, setDining] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load db.json");

        const data = await response.json();

        const dining = data.homepage?.Dining?.length
          ? data.homepage.Dining
          : (data.Filter || [])
            .filter((item) => item.category === "Dining")
            .map((item) => ({
              ...item,
              title: item.name,
              price: `₹${item.price}`,
            }));
        const selected = dining.find((item) => item.id === Number(id));
        setDining(selected || null);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-container">
        <p className="loading">Loading details...</p>
      </div>
    );
  }

  if (!dining) {
    return (
      <div className="details-container">
        <p>Dining not found</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Dining
      </button>

      <div className="details-card">
        <img
          src={dining.image}
          alt={dining.title}
          className="details-img"
        />

        <div className="details-content">
          <h1 className="details-title">{dining.title}</h1>
          <p className="details-location">{dining.location}</p>
          <p className="details-price">{dining.price}</p>

          <div className="details-rating">
            <span className="star">★</span>
            <span>{dining.rating}</span>
          </div>

          <p className="details-description">
            Experience the best of {dining.title} located in {dining.location}.
            Enjoy curated dishes and a memorable dining atmosphere.
          </p>

          <button
            className="book-btn"
            onClick={() => navigate("/booking", { state: { experience: dining } })}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Diningdetail;