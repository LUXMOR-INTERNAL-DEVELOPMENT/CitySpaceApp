import { useState, useEffect } from "react";
import Diningcard from "./Diningcard";
import "./Diningexperience.css";
import nutritionImg from "../../Assets/nutrients.jpeg";

const Diningexperience = () => {
  const [diningList, setDiningList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDining = async () => {
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

        setDiningList(dining);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDining();
  }, []);

  return (
    <div className="dining-container">
      {/* Header */}
      <div className="dining-header">
        <h1>Dining experiences</h1>
        <p>Tables, tastings and memorable meals.</p>
      </div>

      {/* Top Banners */}
      <div className="top-banners">
        {/* Left Banner */}
        <div className="main-banner">
          <div className="banner-text">
            <h2>Eat well. Feel at home.</h2>
            <p>Curated restaurants and exclusive menus</p>
          </div>
          <div className="banner-icon">🍽️</div>
        </div>

        {}
        <div className="nutrition-banner">
          <img
            src={nutritionImg}
            alt="Make sure that you're getting enough"
            className="nutrition-img"
          />
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="dining-grid">
          {diningList.map((item) => (
            <Diningcard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Diningexperience;