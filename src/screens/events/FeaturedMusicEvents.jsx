import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineAdjustments,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
} from "react-icons/hi";
import Eventscard from "./Eventscard";
import "./FeaturedMusicEvents.css";

const quickFilters = [
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "This Weekend", value: "weekend" },
  { label: "Under 10 km", value: "nearby" },
];

const sortOptions = [
  { label: "Popularity", value: "popularity" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Date", value: "date" },
  { label: "Distance: Near to Far", value: "distance" },
];

const getDateRange = (filter) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (filter === "tomorrow") start.setDate(start.getDate() + 1);
  if (filter === "weekend") {
    start.setDate(start.getDate() + ((6 - start.getDay() + 7) % 7));
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return [start, end];
  }

  return [start, new Date(start)];
};

const FeaturedMusicEvents = ({ category = "music" }) => {
  const isNightlife = category === "nightlife";
  const isComedy = category === "comedy";
  const isSports = category === "sports";
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [draftSortBy, setDraftSortBy] = useState("popularity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFeaturedPage, setActiveFeaturedPage] = useState(0);
  const featuredCarouselRef = useRef(null);
  const featuredEventCards = [...featuredEvents].sort(
    (first, second) => (first.featuredOrder ?? first.id) - (second.featuredOrder ?? second.id),
  );
  const featuredPageCount = Math.min(featuredEventCards.length, 3);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load featured music events");
        const data = await response.json();
        if (isComedy) {
          const comedyEvents = data.ComedyEvents || [];
          const additionalComedyEvents = (data.AllEvents || [])
            .filter((event) => event.category === "Comedy")
            .filter((event) => !comedyEvents.some((comedyEvent) => comedyEvent.title === event.title))
            .slice(0, 3);
          setEvents([...comedyEvents, ...additionalComedyEvents]);
          setFeaturedEvents(comedyEvents);
        } else if (isSports) {
          setFeaturedEvents(data.SportsEvents || []);
        } else if (isNightlife) {
          const nightlifeEvents = data.Events || [];
          setFeaturedEvents(nightlifeEvents);
          setEvents(nightlifeEvents);
        } else {
          const musicEvents = data.MusicEvents || [];
          const additionalMusicEvents = (data.AllEvents || [])
            .filter((event) => event.category === "Music")
            .filter((event) => !musicEvents.some((musicEvent) => musicEvent.title === event.title))
            .slice(0, 2);
          setEvents([...musicEvents, ...additionalMusicEvents]);
          setFeaturedEvents([...musicEvents, ...additionalMusicEvents]);
        }
      } catch (error) {
        console.error("Error loading featured music events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [isComedy, isNightlife, isSports]);

  const filteredEvents = events
    .filter((event) => {
      if (activeQuickFilter === "nearby") return event.distanceKm <= 10;
      if (!activeQuickFilter) return true;

      const [rangeStart, rangeEnd] = getDateRange(activeQuickFilter);
      const eventStart = new Date(`${event.startDate}T00:00:00`);
      const eventEnd = new Date(`${event.endDate || event.startDate}T00:00:00`);
      return eventStart <= rangeEnd && eventEnd >= rangeStart;
    })
    .sort((first, second) => {
      if (sortBy === "popularity") return Number(second.rating) - Number(first.rating);
      if (sortBy === "price-low") return first.priceValue - second.priceValue;
      if (sortBy === "price-high") return second.priceValue - first.priceValue;
      if (sortBy === "date") return first.startDate.localeCompare(second.startDate);
      if (sortBy === "distance") return first.distanceKm - second.distanceKm;
      return first.featuredOrder - second.featuredOrder;
    });

  const clearFilters = () => {
    setActiveQuickFilter("");
    setSortBy("popularity");
    setDraftSortBy("popularity");
  };

  const scrollToFeaturedPage = (page) => {
    const carousel = featuredCarouselRef.current;
    if (!carousel || featuredPageCount < 2) return;

    const nextPage = (page + featuredPageCount) % featuredPageCount;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollTo({
      left: (maxScroll * nextPage) / (featuredPageCount - 1),
      behavior: "smooth",
    });
    setActiveFeaturedPage(nextPage);
  };

  const updateActiveFeaturedPage = () => {
    const carousel = featuredCarouselRef.current;
    if (!carousel || featuredPageCount < 2) return;

    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    setActiveFeaturedPage(
      maxScroll > 0
        ? Math.round((carousel.scrollLeft / maxScroll) * (featuredPageCount - 1))
        : 0,
    );
  };

  return (
    <main className="featured-music-page">
      <section className="music-featured-section" aria-labelledby="music-featured-heading">
        <h1 id="music-featured-heading">Featured</h1>
        {loading ? (
          <p className="featured-music-message">Loading featured events...</p>
        ) : featuredEventCards.length ? (
          <>
            <div
              className="music-featured-track"
              ref={featuredCarouselRef}
              onScroll={updateActiveFeaturedPage}
              role="region"
              aria-roledescription="carousel"
              aria-label={`Featured ${category} events`}
            >
              {featuredEventCards.map((event) => (
                <Eventscard key={event.id} {...event} showImage={isSports} />
              ))}
            </div>
            {featuredPageCount > 1 && (
              <nav className="music-featured-pagination" aria-label="Featured events pages">
                <div className="music-featured-dots">
                  {Array.from({ length: featuredPageCount }, (_, page) => (
                    <button
                      className={`music-featured-dot${page === activeFeaturedPage ? " is-active" : ""}`}
                      key={page}
                      type="button"
                      aria-label={`Show featured events page ${page + 1}`}
                      aria-current={page === activeFeaturedPage ? "true" : undefined}
                      onClick={() => scrollToFeaturedPage(page)}
                    />
                  ))}
                </div>
                <button
                  className="music-featured-next"
                  type="button"
                  aria-label="Next featured events"
                  onClick={() => scrollToFeaturedPage(activeFeaturedPage + 1)}
                >
                  <HiOutlineChevronRight aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <p className="featured-music-message">No featured events available right now.</p>
        )}
      </section>

      {!isComedy && !isSports && <section className="featured-music-section" aria-labelledby="all-category-events-heading">
        <h1 id="all-category-events-heading">
          {isComedy ? "All Comedy Events" : isNightlife ? "All Nightlife Events" : "All Music Events"}
        </h1>
        <div className="featured-music-toolbar" aria-label={`${category} event filters`}>
          <button
            className="featured-music-filter-button"
            type="button"
            aria-expanded={isFilterOpen}
            onClick={() => {
              setDraftSortBy(sortBy);
              setIsFilterOpen(true);
            }}
          >
            <HiOutlineAdjustments aria-hidden="true" />
            <span>Filters</span>
            <HiOutlineChevronDown aria-hidden="true" />
          </button>
          {quickFilters.map((filter) => (
            <button
              className={`featured-music-filter-chip${activeQuickFilter === filter.value ? " is-active" : ""}`}
              type="button"
              key={filter.value}
              aria-pressed={activeQuickFilter === filter.value}
              onClick={() => setActiveQuickFilter((active) => active === filter.value ? "" : filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="featured-music-message">Loading {category} events...</p>
        ) : filteredEvents.length ? (
          <div className="featured-music-grid" aria-label={`All ${category} events`}>
            {filteredEvents.map((event) => (
              <Link className="music-event-card" to={`/events/${event.id}`} key={event.id}>
                <div className="music-event-poster">
                  {event.offer && <span className="music-event-offer">{event.offer}</span>}
                </div>
                <div className="music-event-content">
                  <p className="music-event-date">{event.date}</p>
                  <h2>{event.title}</h2>
                  <p className="music-event-location">{event.location}</p>
                  <p className="music-event-price">{event.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="featured-music-message">No {category} events match these filters.</p>
        )}

        {isFilterOpen && (
          <div
            className="music-filter-backdrop"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsFilterOpen(false);
            }}
          >
            <section
              className="music-filter-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="music-filter-heading"
            >
              <h2 id="music-filter-heading">Filter by</h2>
              <div className="music-filter-body">
                <div className="music-filter-sidebar" aria-current="page">Sort By</div>
                <fieldset className="music-filter-options">
                  <legend className="sr-only">Sort music events by</legend>
                  {sortOptions.map((option) => (
                    <label className="music-filter-option" key={option.value}>
                      <input
                        type="radio"
                        name="music-sort"
                        value={option.value}
                        checked={draftSortBy === option.value}
                        onChange={() => setDraftSortBy(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </fieldset>
              </div>
              <div className="music-filter-actions">
                <button className="music-filter-clear" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
                <button
                  className="music-filter-apply"
                  type="button"
                  onClick={() => {
                    setSortBy(draftSortBy);
                    setIsFilterOpen(false);
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </section>
          </div>
        )}
      </section>}
    </main>
  );
};

export default FeaturedMusicEvents;