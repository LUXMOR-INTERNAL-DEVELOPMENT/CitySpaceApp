import React, { useState } from "react";
import "./Navigation.css";

const popularCities = [
  { name: "Mumbai", icon: "▥" },
  { name: "Delhi", icon: "▱" },
  { name: "Bengaluru", icon: "♜" },
  { name: "Hyderabad", icon: "♜" },
  { name: "Ahmedabad", icon: "⌂" },
  { name: "Chennai", icon: "▥" },
  { name: "Kolkata", icon: "▱" },
  { name: "Pune", icon: "▱" },
  { name: "Jaipur", icon: "♨" },
  { name: "Surat", icon: "▥" },
  { name: "Lucknow", icon: "⌂" },
  { name: "Kochi", icon: "♨" },
];

const cities = [
  "Agra",
  "Ahmedabad",
  "Ajmer",
  "Amritsar",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Dhanbad",
  "Faridabad",
  "Ghaziabad",
  "Gurugram",
  "Guwahati",
  "Gwalior",
  "Hyderabad",
  "Indore",
  "Jabalpur",
  "Jaipur",
  "Jodhpur",
  "Kanpur",
  "Kochi",
  "Kolkata",
  "Kozhikode",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Mangaluru",
  "Meerut",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Noida",
  "Patna",
  "Prayagraj",
  "Pune",
  "Raipur",
  "Rajkot",
  "Ranchi",
  "Shimla",
  "Srinagar",
  "Surat",
  "Thiruvananthapuram",
  "Tiruchirappalli",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
];

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function LocationModal({ onClose, onSelectCity, onUseCurrentLocation }) {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");

  const normalizedSearch = search.trim().toLowerCase();
  const filteredCities = cities.filter((city) => {
    const matchesSearch = city.toLowerCase().includes(normalizedSearch);
    const matchesLetter = normalizedSearch || city.startsWith(selectedLetter);
    return matchesSearch && matchesLetter;
  });

  const handleCitySelect = (city) => {
    onSelectCity?.(city);
    onClose?.();
  };

  const handleUseCurrentLocation = () => {
    onUseCurrentLocation?.();
    onClose?.();
  };

  return (
    <div className="location-overlay" onClick={onClose}>
      <div
        className="location-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2>Select Location</h2>

        {/* Search */}
        <div className="location-search">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search city, area or locality"
            aria-label="Search city, area or locality"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && normalizedSearch) {
                event.preventDefault();
                handleCitySelect(search.trim());
              }
            }}
          />
        </div>
        {normalizedSearch && (
          <button
            className="location-address-choice"
            type="button"
            onClick={() => handleCitySelect(search.trim())}
          >
            Use this address: <strong>{search.trim()}</strong>
          </button>
        )}

        {/* Current Location */}
        <button
          className="current-location"
          onClick={handleUseCurrentLocation}
        >
          <span className="location-target">◎</span>
          <span>Use Current Location</span>
        </button>

        {/* Popular Cities */}
        <section className="popular-section">
          <h3>Popular Cities</h3>

          <div className="popular-cities">
            {popularCities.map((city) => (
              <button
                className="city-card"
                key={city.name}
                onClick={() => handleCitySelect(city.name)}
              >
                <div className="city-icon">{city.icon}</div>
                <span>{city.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* All Cities */}
        <section className="all-cities">
          <h3>All Cities</h3>

          <div className="alphabet">
            {alphabets.map((letter) => (
              <button
                key={letter}
                className={selectedLetter === letter ? "active" : ""}
                disabled={!cities.some((city) => city.startsWith(letter))}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>

          {filteredCities.length ? (
            <div className="city-list">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  className="city-name"
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          ) : (
            <p className="no-cities">No matching cities. You can use the address above.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default LocationModal;