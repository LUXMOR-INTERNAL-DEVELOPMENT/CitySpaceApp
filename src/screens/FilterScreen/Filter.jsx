import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Filter.css";

const FilterPage = () => {
  const navigate = useNavigate();

  // Input values
  const [db, setDb] = useState([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");

  // Sort
  const [sortBy, setSortBy] = useState("Recommended");

  // Final filtered data
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => {
        const experiences = Array.isArray(data)
          ? data
          : data.Filter || data.Filters || [];

        setDb(experiences);
        setFilteredResults(experiences);
      })
      .catch((error) => {
        console.log("Error loading JSON:", error);
      });
  }, []);

  const handleApply = () => {
    // Start with all JSON data
    let data = [...db];

    // 1. CATEGORY

    if (category.trim() !== "") {

      data = data.filter((item) =>
        item.category
          .toLowerCase()
          .includes(category.toLowerCase())
      );
    }

    // 2. DATE

    if (date.trim() !== "") {

      data = data.filter((item) =>
        item.date.includes(date)
      );

    }

    // 3. PRICE RANGE

    if (priceRange.trim() !== "") {

      const price = priceRange
        .replace(/₹/, "")
        .replace(/,/, "")
        .trim();

      const parts = price.split("-");

      if (parts.length === 2) {

        const minPrice = Number(parts[0]);
        const maxPrice = Number(parts[1]);

        data = data.filter(
          (item) =>
            item.price >= minPrice &&
            item.price <= maxPrice
        );
      }
    }

    // 4. LOCATION

    if (location.trim() !== "") {

      const distance = Number(
        location
          .replace("km", "")
          .replace("KM", "")
          .replace("Within", "")
          .trim()
      );

      if (!isNaN(distance)) {

        data = data.filter(
          (item) => item.distance <= distance
        );

      } else {

        data = data.filter((item) =>
          item.location
            .toLowerCase()
            .includes(location.toLowerCase())
        );
      }
    }

    // 5. RATING

    if (rating.trim() !== "") {

      const minimumRating = Number(
        rating
          .replace("★", "")
          .replace("and above", "")
          .trim()
      );

      if (!isNaN(minimumRating)) {

        data = data.filter(
          (item) => item.rating >= minimumRating
        );
      }
    }

    // SORTING

    if (sortBy === "Price: Low to High") {

      data.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "Top rated") {

      data.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sortBy === "Recommended") {

      data.sort(
        (a, b) => b.rating - a.rating
      );
    }

    // Save final results
    setFilteredResults(data);

    console.log("Filtered Results:", data);

    // Navigate to the results page
    if (data.length > 0) {
      navigate("/matches", {
        state: {
          results: data
        }
      });
    } else {
      alert("No results found");
    }
  };

  return (
    <div className="page">

      {/* <div className="step-badge">
        03 Filters & Sort
      </div> */}

      <h1>Filter your results</h1>

      <p className="subtitle">
        Choose what matters and apply once.
      </p>

      <div className="main-content">

        {/* FILTER BOX */}

        <div className="filters-box">

          {/* CATEGORY */}

          <div className="filter-row">
            <label>Category</label>
            <input
              type="text"
              placeholder="Dining, Events, Activities"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            />
          </div>

          {/* DATE */}

          <div className="filter-row">
            <label>Date</label>
            <input
              type="text"
              placeholder="2026-09-12"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </div>

          {/* PRICE */}

          <div className="filter-row">
            <label>Price range</label>
            <input
              type="text"
              placeholder="500 - 2000"
              value={priceRange}
              onChange={(e) =>
                setPriceRange(e.target.value)
              }
            />
          </div>

          {/* LOCATION */}

          <div className="filter-row">
            <label>Location</label>
            <input
              type="text"
              placeholder="Within 10 km"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />
          </div>

          {/* RATING */}

          <div className="filter-row">
            <label>Rating</label>
            <input
              type="text"
              placeholder="4★ and above"
              value={rating}
              onChange={(e) =>
                setRating(e.target.value)
              }
            />
          </div>

          {/* SORT */}

          <div className="sort-row">
            <label>Sort by</label>
            <div className="sort-buttons">
              <button
                type="button"
                className={
                  sortBy === "Recommended"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSortBy("Recommended")
                }
              >
                Recommended
              </button>

              <button
                type="button"
                className={
                  sortBy === "Price: Low to High"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSortBy("Price: Low to High")
                }
              >
                Price: Low to High
              </button>

              <button
                type="button"
                className={
                  sortBy === "Top rated"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSortBy("Top rated")
                }
              >
                Top rated
              </button>

            </div>

          </div>

        </div>

        {/* RESULT PREVIEW */}

        <div className="preview-card">

          <h2>Result preview</h2>
          <div className="music-box">

            {filteredResults.length > 0 && (
              <img
                src={filteredResults[0].image}
                alt={filteredResults[0].category}
              />
            )}

          </div>

          <div className="match-count">
            {filteredResults.length} matches
          </div>

          <p className="sorted">
            Sorted by {sortBy}
          </p>

          <button
            className="apply-button"
            onClick={handleApply}
          >
            Apply filters
          </button>

        </div>

      </div>

    </div>
  );
};
export default FilterPage;