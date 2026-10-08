import React, { useState } from "react";
import "./FilterModal.css";

const SORT_OPTIONS = [
  { id: "price-asc", label: "Price : Low to High" },
  { id: "price-desc", label: "Price : High to Low" },
  { id: "rating-desc", label: "Rating: High to Low" },
  { id: "distance-asc", label: "Distance : Near to Far" },
];

const SPORT_OPTIONS = [
  { id: "", label: "All Sports" },
  { id: "badminton", label: "Badminton" },
  { id: "swimming", label: "Swimming" },
  { id: "pickleball", label: "Pickleball" },
  { id: "turf-football", label: "Turf Football" },
  { id: "table-tennis", label: "Table Tennis" },
  { id: "box-cricket", label: "Box Cricket" },
  { id: "padel", label: "Padel" },
  { id: "cricket", label: "Cricket Ground" },
  { id: "cricket-nets", label: "Cricket Practice Nets" },
  { id: "tennis", label: "Tennis" },
  { id: "basketball", label: "Basketball" },
  { id: "snooker", label: "Snooker" },
  { id: "pool", label: "Pool & Billiards" },
  { id: "volleyball", label: "Volleyball" },
  { id: "football", label: "Football Ground" },
  { id: "squash", label: "Squash" },
];

const AREA_OPTIONS = [
  { id: "", label: "All Chennai Areas" },
  { id: "Nungambakkam", label: "Nungambakkam" },
  { id: "Anna Nagar", label: "Anna Nagar" },
  { id: "Adyar", label: "Adyar" },
  { id: "Besant Nagar", label: "Besant Nagar" },
  { id: "Velachery", label: "Velachery" },
  { id: "T. Nagar", label: "T. Nagar" },
  { id: "Alwarpet", label: "Alwarpet" },
  { id: "OMR", label: "OMR (Perungudi / Thoraipakkam)" },
  { id: "ECR", label: "ECR (Palavakkam / Neelankarai)" },
  { id: "Kilpauk", label: "Kilpauk" },
  { id: "Porur", label: "Porur" },
  { id: "Tambaram", label: "Tambaram" },
  { id: "Guindy", label: "Guindy" },
  { id: "Mylapore", label: "Mylapore" },
  { id: "Santhome", label: "Santhome" },
  { id: "Chetpet", label: "Chetpet" },
];

const COURT_TYPE_OPTIONS = [
  { id: "", label: "All Court Types" },
  { id: "Synthetic", label: "Synthetic BWF Wooden Courts" },
  { id: "AstroTurf", label: "AstroTurf Football / Cricket Pitches" },
  { id: "Cage", label: "Enclosed All-Weather Cricket Cage" },
  { id: "Clay", label: "Red Clay Tennis Courts" },
  { id: "Hard", label: "Plexicushion Acrylic Hard Courts" },
  { id: "Panoramic", label: "Panoramic Glass Padel Courts" },
  { id: "Olympic", label: "Olympic 50m Heated Pools" },
  { id: "Indoor", label: "Semi-Olympic Indoor Pools" },
  { id: "ITTF", label: "ITTF Approved Table Tennis Tables" },
  { id: "Riley", label: "Riley Championship Snooker Tables" },
  { id: "Brunswick", label: "Brunswick American Pool Tables" },
  { id: "Sand", label: "FIVB Beach Sand Volleyball Courts" },
  { id: "Maple", label: "Maple Hardwood FIBA Basketball Courts" },
  { id: "Junckers", label: "Junckers Beechwood Squash Glass Courts" },
  { id: "Grass", label: "Natural Grass Stadium Grounds" },
];

const DIMENSION_OPTIONS = [
  { id: "", label: "All Dimensions" },
  { id: "5-a-side", label: "5-a-side Field" },
  { id: "7-a-side", label: "7-a-side Turf" },
  { id: "9-a-side", label: "9-a-side Arena" },
  { id: "11-a-side", label: "Full 11-a-side Stadium" },
  { id: "Full Sized", label: "Full Sized 70-Yard Cricket Ground" },
  { id: "3x3", label: "3x3 Basketball Half Court" },
  { id: "Single", label: "Single Court" },
  { id: "Multi-Court", label: "Multi-Court Mega Arena" },
];

const AMENITY_OPTIONS = [
  { id: "", label: "All Amenities" },
  { id: "Air Conditioned", label: "Air Conditioned" },
  { id: "Floodlights", label: "Floodlights / Night Matches" },
  { id: "Coaching", label: "Certified Pro Coaching" },
  { id: "Shower", label: "Shower & Changing Lockers" },
  { id: "Bowling Machine", label: "Automated Bowling Simulator" },
  { id: "Parking", label: "Dedicated Car Parking" },
  { id: "Cafe", label: "Cafeteria & Lounge" },
];

export default function FilterModal({
  isOpen,
  onClose,
  initialSortBy,
  initialSport,
  initialArea,
  initialCourtType,
  initialDimension,
  initialAmenity,
  onApply,
}) {
  const [activeTab, setActiveTab] = useState("sort");
  const [tempSortBy, setTempSortBy] = useState(initialSortBy || "");
  const [tempSport, setTempSport] = useState(initialSport || "");
  const [tempArea, setTempArea] = useState(initialArea || "");
  const [tempCourtType, setTempCourtType] = useState(initialCourtType || "");
  const [tempDimension, setTempDimension] = useState(initialDimension || "");
  const [tempAmenity, setTempAmenity] = useState(initialAmenity || "");

  if (!isOpen) return null;

  const handleClearFilters = () => {
    setTempSortBy("");
    setTempSport("");
    setTempArea("");
    setTempCourtType("");
    setTempDimension("");
    setTempAmenity("");
  };

  const handleApplyFilters = () => {
    onApply({
      sortBy: tempSortBy,
      sport: tempSport,
      area: tempArea,
      courtType: tempCourtType,
      dimension: tempDimension,
      amenity: tempAmenity,
    });
    onClose();
  };

  return (
    <div className="filter-modal-backdrop" onClick={onClose}>
      <div className="filter-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">Filter by</h2>
          <button type="button" className="filter-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Modal Body: Left Navigation & Right Options */}
        <div className="filter-modal-body">
          {/* Left Column Tabs */}
          <div className="filter-tabs-col">
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "sort" ? "active" : ""}`}
              onClick={() => setActiveTab("sort")}
            >
              Sort By
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "area" ? "active" : ""}`}
              onClick={() => setActiveTab("area")}
            >
              Area / Location
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "court" ? "active" : ""}`}
              onClick={() => setActiveTab("court")}
            >
              Court Type
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "sports" ? "active" : ""}`}
              onClick={() => setActiveTab("sports")}
            >
              Sports
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "dimension" ? "active" : ""}`}
              onClick={() => setActiveTab("dimension")}
            >
              Dimension
            </button>
            <button
              type="button"
              className={`filter-tab-btn ${activeTab === "amenities" ? "active" : ""}`}
              onClick={() => setActiveTab("amenities")}
            >
              Amenities
            </button>
          </div>

          {/* Right Column Options Container */}
          <div className="filter-options-col">
            {/* Sort Tab */}
            {activeTab === "sort" && (
              <div className="filter-options-list">
                {SORT_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-radio-label">
                    <span
                      className={`custom-radio-circle ${
                        tempSortBy === opt.id ? "checked" : ""
                      }`}
                    >
                      {tempSortBy === opt.id && <span className="custom-radio-dot" />}
                    </span>
                    <input
                      type="radio"
                      name="sortBy"
                      value={opt.id}
                      checked={tempSortBy === opt.id}
                      onChange={() => setTempSortBy(opt.id)}
                      className="hidden-radio-input"
                    />
                    <span className="filter-option-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Area / Location Tab */}
            {activeTab === "area" && (
              <div className="filter-options-list">
                {AREA_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-radio-label">
                    <span
                      className={`custom-radio-circle ${
                        tempArea === opt.id ? "checked" : ""
                      }`}
                    >
                      {tempArea === opt.id && <span className="custom-radio-dot" />}
                    </span>
                    <input
                      type="radio"
                      name="area"
                      value={opt.id}
                      checked={tempArea === opt.id}
                      onChange={() => setTempArea(opt.id)}
                      className="hidden-radio-input"
                    />
                    <span className="filter-option-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Court Type Tab */}
            {activeTab === "court" && (
              <div className="filter-options-list">
                {COURT_TYPE_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-radio-label">
                    <span
                      className={`custom-radio-circle ${
                        tempCourtType === opt.id ? "checked" : ""
                      }`}
                    >
                      {tempCourtType === opt.id && <span className="custom-radio-dot" />}
                    </span>
                    <input
                      type="radio"
                      name="courtType"
                      value={opt.id}
                      checked={tempCourtType === opt.id}
                      onChange={() => setTempCourtType(opt.id)}
                      className="hidden-radio-input"
                    />
                    <span className="filter-option-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Sports Tab */}
            {activeTab === "sports" && (
              <div className="filter-options-list">
                {SPORT_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-radio-label">
                    <span
                      className={`custom-radio-circle ${
                        tempSport === opt.id ? "checked" : ""
                      }`}
                    >
                      {tempSport === opt.id && <span className="custom-radio-dot" />}
                    </span>
                    <input
                      type="radio"
                      name="sport"
                      value={opt.id}
                      checked={tempSport === opt.id}
                      onChange={() => setTempSport(opt.id)}
                      className="hidden-radio-input"
                    />
                    <span className="filter-option-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Dimension Tab */}
            {activeTab === "dimension" && (
              <div className="filter-options-list">
                {DIMENSION_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-radio-label">
                    <span
                      className={`custom-radio-circle ${
                        tempDimension === opt.id ? "checked" : ""
                      }`}
                    >
                      {tempDimension === opt.id && <span className="custom-radio-dot" />}
                    </span>
                    <input
                      type="radio"
                      name="dimension"
                      value={opt.id}
                      checked={tempDimension === opt.id}
                      onChange={() => setTempDimension(opt.id)}
                      className="hidden-radio-input"
                    />
                    <span className="filter-option-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Amenities Tab */}
            {activeTab === "amenities" && (
              <div className="filter-options-list">
                {AMENITY_OPTIONS.map((opt) => (
                  <label key={opt.id} className="filter-radio-label">
                    <span
                      className={`custom-radio-circle ${
                        tempAmenity === opt.id ? "checked" : ""
                      }`}
                    >
                      {tempAmenity === opt.id && <span className="custom-radio-dot" />}
                    </span>
                    <input
                      type="radio"
                      name="amenity"
                      value={opt.id}
                      checked={tempAmenity === opt.id}
                      onChange={() => setTempAmenity(opt.id)}
                      className="hidden-radio-input"
                    />
                    <span className="filter-option-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Clear filters and Apply Filters */}
        <div className="filter-modal-footer">
          <button
            type="button"
            className="filter-clear-btn"
            onClick={handleClearFilters}
          >
            Clear filters
          </button>

          <button
            type="button"
            className="filter-apply-btn"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
