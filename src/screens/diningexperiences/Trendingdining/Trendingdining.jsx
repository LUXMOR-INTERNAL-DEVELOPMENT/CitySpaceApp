import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Trendingdining.css";

const getStoredLocation = () => {
  try {
    return localStorage.getItem("cityspace_location") || "Chennai";
  } catch {
    return "Chennai";
  }
};

const Trendingdining = () => {
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [diningDb, setDiningDb] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [trendingLocation, setTrendingLocation] = useState(getStoredLocation);
  const navigate = useNavigate();
  const location = useLocation();
  const { category: selectedCategory = "" } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    const loadDiningData = async () => {
      try {
        const response = await fetch("/dining.json", { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Dining data request failed (${response.status})`);
        }

        const data = await response.json();
        if (!Array.isArray(data?.trending) || !Array.isArray(data?.filters)) {
          throw new Error("Dining data has an invalid format");
        }

        setDiningDb(data);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Failed to load dining data:", error);
        setLoadError(error.message);
      }
    };

    loadDiningData();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleLocationChange = (event) => {
      if (event.detail) setTrendingLocation(event.detail);
    };

    window.addEventListener("cityspace-location-change", handleLocationChange);
    return () =>
      window.removeEventListener("cityspace-location-change", handleLocationChange);
  }, []);

  if (loadError) {
    return (
      <div className="trending-page">
        <div className="status-msg error">
          Failed to load data: {loadError}
        </div>
      </div>
    );
  }

  if (!diningDb) {
    return (
      <div className="trending-page">
        <div className="status-msg">Loading dining experiences...</div>
      </div>
    );
  }

  const diningItems = diningDb.trending;
  const diningCategories = [...new Set(
    diningItems.map((item) => item.category?.trim()).filter(Boolean)
  )]
    .sort((first, second) => first.localeCompare(second))
    .map((name) => {
      const shops = diningItems.filter(
        (item) => item.category?.toLowerCase() === name.toLowerCase()
      );
      return { name, image: shops[0].image, count: shops.length };
    });

  if (!diningItems.length) {
    return (
      <div className="trending-page">
        <div className="status-msg error">Failed to load data</div>
      </div>
    );
  }
  const filters = diningDb.filters;
  const trending = diningItems;
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const normalizedCategory = selectedCategory.toLowerCase();
  const filteredList = trending.filter((item) => {
    const filterName = activeFilter?.toLowerCase().trim();
    const quickFilters = (item.quickFilters || []).map((filter) => filter.toLowerCase());
    const matchesFilter = !filterName || filterName === "filters"
      ? true
      : filterName === "cafe's" || filterName === "cafe"
        ? item.category?.toLowerCase().includes("cafe")
        : filterName === "under 10 km"
          ? Number(item.distanceKm) <= 10
          : ["today", "tomorrow", "this weekend"].includes(filterName)
            ? quickFilters.includes(filterName)
            : filterName.includes("roof")
              ? /roof.?top/i.test(item.description || "")
              : item.category?.toLowerCase().includes(filterName);
    const matchesCategory = !normalizedCategory ||
      item.category?.toLowerCase() === normalizedCategory;
    const matchesSearch = !normalizedSearch ||
      item.name?.toLowerCase().includes(normalizedSearch) ||
      item.category?.toLowerCase().includes(normalizedSearch) ||
      item.location?.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesCategory && matchesSearch;
  });
  const handleCardClick = (id) => {
    navigate(`/dining/${id}`, {
      state: { from: `${location.pathname}${location.search}` },
    });
  };
  const handleCategoryClick = (category) => {
    navigate(`/dining/category/${encodeURIComponent(category)}`);
  };
  return (
    <div className="trending-page">
      {/* Header */}
      <div className="header">
        <h1>Explore Dining's</h1>
        <p>
          Book dining, events, activities and local experiences - all in one
          place
        </p>
      </div>
      <div className="search-bar-wrap">
        <input
          type="text"
          className="search-bar"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search dining, cuisine, or location"
          aria-label="Search dining experiences"
        />
      </div>

      {/* Title */}
      {selectedCategory ? (
        <>
          <button
            type="button"
            className="dining-back-btn"
            onClick={() => navigate("/dining")}
          >
            ← All dining categories
          </button>
          <h2 className="section-title">
            {selectedCategory} in {trendingLocation}
          </h2>
        </>
      ) : normalizedSearch ? (
        <h2 className="section-title">Dining results in {trendingLocation}</h2>
      ) : (
        <section className="dining-category-section" aria-labelledby="dining-category-title">
          <h2 id="dining-category-title">Shop by Category</h2>
          <div className="dining-categories">
            {diningCategories.map((category) => (
              <button
                type="button"
                key={category.name}
                className="dining-category-card"
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="dining-category-name">{category.name}</span>
                <img src={category.image} alt="" />
                <span className="dining-category-count">
                  {category.count} {category.count === 1 ? "shop" : "shops"}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!selectedCategory && !normalizedSearch && (
        <h2 className="section-title dining-results-title">All Dining Shops</h2>
      )}

      <div className="filters">
        {filters.map((f, i) => (
          <button
            key={i}
            className={`filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(activeFilter === f ? null : f)}
          >
            {f === "filters" ? "filters ▾" : f}
          </button>
        ))}
      </div>

      {filteredList.length ? (
        <div className="cards">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="card"
              onClick={() => handleCardClick(item.id)}
            >
              <div className="card-img">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="card-body">
                <h3>{item.name}</h3>
                <p className="card-rating">{item.rating} ★ ({item.reviews} reviews)</p>
                <p className="card-price-category">
                  {item.priceRange} · {item.category}
                </p>
                <p className="card-location">{item.location}</p>
                <p className="card-timings">{item.timings}</p>
                <p className="card-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="dining-empty-state">No dining shops found for this selection.</p>
      )}
    </div>
  );
};

export default Trendingdining;