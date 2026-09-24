import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results || []);
  const [loading, setLoading] = useState(results.length === 0);

  useEffect(() => {
    if (results.length > 0) {
      return;
    }

    const loadResults = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load db.json");

        const data = await response.json();
        setResults(Array.isArray(data.Filter) ? data.Filter : data.Filters || []);
      } catch (error) {
        console.error("Failed to load results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [results.length]);

  if (loading) {
    return <h2 className="results-status">Loading experiences...</h2>;
  }

  if (results.length === 0) {
    return <h2 className="results-status">No experiences found</h2>;
  }

  return (
    <main className="results-page">
      <div className="results-header">
        {/* <div className="step-badge">04 Choose an experience</div> */}
        <h1>Available experiences</h1>
        <p>{results.length} experiences match your search.</p>
      </div>

      <div className="results-list">
        {results.map((item) => (
          <button
            className="experience-card"
            key={item.id}
            type="button"
            onClick={() => navigate("/experience", { state: { experience: item } })}
          >
            <img src={item.image} alt={item.name} />
            <span className="experience-card-content">
              <strong>{item.name}</strong>
              <span>{item.category} · {item.location}</span>
              <span>{item.date} · ₹{item.price} · {item.rating} ★</span>
              <span className="view-details">View details</span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
};

export default ResultsPage;
