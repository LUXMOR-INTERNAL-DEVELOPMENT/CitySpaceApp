import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineAdjustments, HiOutlineChevronDown } from "react-icons/hi";
import "./AllEventsSection.css";

const quickFilters = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Weekend", value: "weekend" },
  { label: "Under 10 km", value: "nearby" },
];

const categoryChips = ["Art & Craft Workshops", "Bowling", "Workshops"];

const AllEventsSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [activeCategoryChip, setActiveCategoryChip] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load all events");
        const data = await response.json();
        setEvents(data.AllEvents || []);
      } catch (error) {
        console.error("Error loading all events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const filteredEvents = events
    .filter((event) => {
      if (category !== "all" && event.category !== category) return false;
      if (activeCategoryChip && event.subcategory !== activeCategoryChip) return false;
      if (!activeQuickFilter) return true;
      if (activeQuickFilter === "nearby") return event.distanceKm <= 10;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventStart = new Date(`${event.startDate}T00:00:00`);
      const eventEnd = new Date(`${event.endDate || event.startDate}T00:00:00`);

      if (activeQuickFilter === "today") return eventStart <= today && eventEnd >= today;

      if (activeQuickFilter === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return eventStart <= tomorrow && eventEnd >= tomorrow;
      }

      const saturday = new Date(today);
      saturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
      const sunday = new Date(saturday);
      sunday.setDate(sunday.getDate() + 1);
      return eventStart <= sunday && eventEnd >= saturday;
    })
    .sort((first, second) => {
      if (sortBy === "soonest") return first.startDate.localeCompare(second.startDate);
      if (sortBy === "price") return first.priceValue - second.priceValue;
      return first.featuredOrder - second.featuredOrder;
    });

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMoreEvents = visibleCount < filteredEvents.length;

  return (
    <section className="all-events-section" aria-labelledby="all-events-heading">
      <h2 id="all-events-heading">All Events</h2>
      <div className="all-events-toolbar">
        <div className="all-events-filter-wrap">
          <button
            className="all-events-filter-toggle"
            type="button"
            aria-expanded={isFilterMenuOpen}
            aria-controls="all-events-filter-menu"
            onClick={() => setIsFilterMenuOpen((isOpen) => !isOpen)}
          >
            <HiOutlineAdjustments aria-hidden="true" />
            <span>Filters</span>
            <HiOutlineChevronDown aria-hidden="true" />
          </button>
          {isFilterMenuOpen && (
            <div className="all-events-filter-menu" id="all-events-filter-menu">
              <label htmlFor="all-events-category">Category</label>
              <select
                id="all-events-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                <option value="Music">Music</option>
                <option value="Comedy">Comedy</option>
                <option value="Activities">Activities</option>
                <option value="Workshops">Workshops</option>
              </select>
              <label htmlFor="all-events-sort">Sort by</label>
              <select
                id="all-events-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="soonest">Date: soonest</option>
                <option value="price">Price: low to high</option>
              </select>
            </div>
          )}
        </div>
        {quickFilters.map((filter) => (
          <button
            className={`all-events-filter-chip${activeQuickFilter === filter.value ? " is-active" : ""}`}
            type="button"
            key={filter.value}
            aria-pressed={activeQuickFilter === filter.value}
            onClick={() =>
              setActiveQuickFilter((current) => current === filter.value ? "" : filter.value)
            }
          >
            {filter.label}
          </button>
        ))}
        {categoryChips.map((chip) => (
          <button
            className={`all-events-filter-chip${activeCategoryChip === chip ? " is-active" : ""}`}
            type="button"
            key={chip}
            aria-pressed={activeCategoryChip === chip}
            onClick={() => setActiveCategoryChip((current) => current === chip ? "" : chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="all-events-message">Loading events...</p>
      ) : filteredEvents.length ? (
        <>
          <div className="all-events-grid">
            {visibleEvents.map((event) => (
              <Link className="all-events-card" to={`/events/${event.id}`} key={event.id}>
                <div className="all-events-poster">
                  {event.offer && <span className="all-events-offer">{event.offer}</span>}
                </div>
                <div className="all-events-card-content">
                  <p className="all-events-date">{event.date}</p>
                  <h3>{event.title}</h3>
                  <p className="all-events-location">{event.location}</p>
                  <p className="all-events-price">{event.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {hasMoreEvents && (
            <div className="all-events-load-more-wrap">
              <button
                type="button"
                className="all-events-load-more"
                onClick={() => setVisibleCount((count) => Math.min(count + 4, filteredEvents.length))}
              >
                <span>Load More</span>
                <HiOutlineChevronDown aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="all-events-message">No events match these filters.</p>
      )}
    </section>
  );
};

export default AllEventsSection;