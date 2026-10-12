import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import CategoryArtwork from "./CategoryArtwork";
import Eventscard from "./Eventscard";
import AllEventsSection from "./AllEventsSection";
import FeaturedMusicEvents from "./FeaturedMusicEvents";
import "./Eventscreen.css";

const categories = [
  { name: "Music", kind: "music", color: "blue" },
  { name: "Nightlife", kind: "nightlife", color: "yellow" },
  { name: "Comedy", kind: "comedy", color: "lemon" },
  { name: "Sports", kind: "sports", color: "peach" },
  { name: "Theatre", kind: "theatre", color: "cyan" },
  { name: "Performances", kind: "performances", color: "coral" },
  { name: "Navratri", kind: "navratri", color: "gold" },
  { name: "Fests & Fairs", kind: "fairs", color: "pink" },
  { name: "Food & Drinks", kind: "food", color: "cream" },
  { name: "Social Mixers", kind: "mixers", color: "orange" },
  { name: "Screenings", kind: "screenings", color: "aqua" },
  { name: "Fitness", kind: "fitness", color: "lilac" },
  { name: "Conferences", kind: "conferences", color: "mint" },
];

const categoryAliases = {
  nightlife: ["nightlife"],
  comedy: ["comedy"],
  sports: ["sports"],
  theatre: ["theatre"],
  performances: ["performances"],
  navratri: ["garba & dandiya", "navratri night", "navratri"],
  fairs: ["fests & fairs", "fairs"],
  food: ["food", "food & drinks"],
  mixers: ["social mixers", "mixers"],
  screenings: ["screenings"],
  fitness: ["fitness"],
  conferences: ["conferences"],
};

const Events = () => {
  const { category } = useParams();
  const [events, setEvents] = useState([]);
  const [nearbyVenues, setNearbyVenues] = useState([]);
  const [theatreEvents, setTheatreEvents] = useState([]);
  const [districtArtists, setDistrictArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEventPage, setActiveEventPage] = useState(0);
  const [eventPageCount, setEventPageCount] = useState(1);
  const [activeVenueIndex, setActiveVenueIndex] = useState(0);
  const [activeArtistPage, setActiveArtistPage] = useState(0);
  const [artistPageCount, setArtistPageCount] = useState(1);
  const eventCarouselRef = useRef(null);
  const venueCarouselRef = useRef(null);
  const theatreCarouselRef = useRef(null);
  const artistCarouselRef = useRef(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch("/db.json");
        if (!response.ok) throw new Error("Could not load events");
        const data = await response.json();
        setEvents(data.Events || []);
        setNearbyVenues(data.NearbyVenues || []);
        setTheatreEvents(data.TheatreEvents || []);
        setDistrictArtists(data.DistrictArtists || []);
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const activeCategoryKey = category ? category.toLowerCase() : "";
  const activeCategory = categories.find((item) => item.kind === activeCategoryKey);
  const categoryKeys = categoryAliases[activeCategoryKey] || [];
  const allEvents = [...events, ...theatreEvents];
  const categoryFilteredEvents = activeCategoryKey
    ? allEvents.filter((event) => categoryKeys.includes(event.category?.toLowerCase()))
    : events;

  useEffect(() => {
    const carousel = eventCarouselRef.current;
    if (!carousel) return;

    const updatePageCount = () => {
      setEventPageCount(Math.max(1, Math.ceil(carousel.scrollWidth / carousel.clientWidth)));
    };

    updatePageCount();
    window.addEventListener("resize", updatePageCount);
    return () => window.removeEventListener("resize", updatePageCount);
  }, [events.length, loading]);

  const scrollToEventPage = (page) => {
    const carousel = eventCarouselRef.current;
    if (!carousel || eventPageCount < 2) return;

    const nextPage = (page + eventPageCount) % eventPageCount;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollTo({
      left: (maxScroll * nextPage) / (eventPageCount - 1),
      behavior: "smooth",
    });
    setActiveEventPage(nextPage);
  };

  const updateActiveEventPage = () => {
    const carousel = eventCarouselRef.current;
    if (!carousel) return;

    const pageCount = Math.max(1, Math.ceil(carousel.scrollWidth / carousel.clientWidth));
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    setEventPageCount(pageCount);
    setActiveEventPage(
      maxScroll > 0 ? Math.round((carousel.scrollLeft / maxScroll) * (pageCount - 1)) : 0,
    );
  };

  const scrollToVenue = (index) => {
    const carousel = venueCarouselRef.current;
    if (!carousel || !nearbyVenues.length) return;

    const nextIndex = (index + nearbyVenues.length) % nearbyVenues.length;
    const venueCard = carousel.children[nextIndex];
    carousel.scrollTo({
      left: venueCard.offsetLeft,
      behavior: "smooth",
    });
    setActiveVenueIndex(nextIndex);
  };

  const updateActiveVenue = () => {
    const carousel = venueCarouselRef.current;
    if (!carousel) return;

    const cards = Array.from(carousel.children);
    const nearestCard = cards.reduce((nearestIndex, card, index) => {
      const nearest = cards[nearestIndex];
      return Math.abs(card.offsetLeft - carousel.scrollLeft) <
        Math.abs(nearest.offsetLeft - carousel.scrollLeft)
        ? index
        : nearestIndex;
    }, 0);
    setActiveVenueIndex(nearestCard);
  };

  const scrollTheatreCarousel = (direction) => {
    const carousel = theatreCarouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const carousel = artistCarouselRef.current;
    if (!carousel) return;

    const updatePageCount = () => {
      setArtistPageCount(Math.max(1, Math.ceil(carousel.scrollWidth / carousel.clientWidth)));
    };

    updatePageCount();
    window.addEventListener("resize", updatePageCount);
    return () => window.removeEventListener("resize", updatePageCount);
  }, [districtArtists.length, loading]);

  const scrollToArtistPage = (page) => {
    const carousel = artistCarouselRef.current;
    if (!carousel || artistPageCount < 2) return;

    const nextPage = (page + artistPageCount) % artistPageCount;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    carousel.scrollTo({
      left: (maxScroll * nextPage) / (artistPageCount - 1),
      behavior: "smooth",
    });
    setActiveArtistPage(nextPage);
  };

  const updateActiveArtistPage = () => {
    const carousel = artistCarouselRef.current;
    if (!carousel) return;

    const pageCount = Math.max(1, Math.ceil(carousel.scrollWidth / carousel.clientWidth));
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    setArtistPageCount(pageCount);
    setActiveArtistPage(
      maxScroll > 0 ? Math.round((carousel.scrollLeft / maxScroll) * (pageCount - 1)) : 0,
    );
  };

  return (
    <main className="events-container">
      <section className="event-categories-section" aria-labelledby="explore-events-heading">
        <h1 className="events-heading" id="explore-events-heading">
          Explore Events
        </h1>
        <div className="event-categories-grid">
          {categories.map((categoryItem) => {
            const categoryContent = (
              <>
                <h3>{categoryItem.name}</h3>
                <CategoryArtwork kind={categoryItem.kind} label={categoryItem.name} />
              </>
            );
            const className = `event-category event-category--${categoryItem.color}`;
            const categoryRoute = `/events/${categoryItem.kind}`;

            return (
              <Link
                className={className}
                key={categoryItem.name}
                to={categoryRoute}
                aria-label={`Browse ${categoryItem.name} events`}
              >
                {categoryContent}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="navaratri-events-section" aria-labelledby="top-navaratri-heading">
        <h2 className="events-heading" id="top-navaratri-heading">
          {activeCategory ? `Top ${activeCategory.name} Events` : "Top Navratri Events"}
        </h2>
        <div
          className="events-grid"
          ref={eventCarouselRef}
          onScroll={updateActiveEventPage}
          role="region"
          aria-roledescription="carousel"
          aria-label="Top Navaratri events"
        >
          {loading ? (
            <p className="events-message">Loading events...</p>
          ) : categoryFilteredEvents.length ? (
            categoryFilteredEvents.map((event) => <Eventscard key={event.id} {...event} showImage={false} />)
          ) : (
            <p className="events-message">No events available right now.</p>
          )}
        </div>
        {events.length > 1 && !loading && (
          <nav className="event-pagination" aria-label="Navaratri event carousel">
            <button
              className="event-pagination-arrow"
              type="button"
              aria-label="Previous events"
              onClick={() => scrollToEventPage(activeEventPage - 1)}
            >
              <HiOutlineChevronLeft aria-hidden="true" />
            </button>
            <div className="event-pagination-dots">
              {Array.from({ length: eventPageCount }, (_, page) => (
                <button
                  className={`event-pagination-dot${page === activeEventPage ? " is-active" : ""}`}
                  type="button"
                  key={page}
                  aria-label={`Show event page ${page + 1}`}
                  aria-current={page === activeEventPage ? "true" : undefined}
                  onClick={() => scrollToEventPage(page)}
                />
              ))}
            </div>
            <button
              className="event-pagination-arrow"
              type="button"
              aria-label="Next events"
              onClick={() => scrollToEventPage(activeEventPage + 1)}
            >
              <HiOutlineChevronRight aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>

      <section className="nearby-venues-section" aria-labelledby="nearby-venues-heading">
        <h2 className="events-heading" id="nearby-venues-heading">
          Happening at venues near you
        </h2>
        {loading ? (
          <p className="events-message">Loading nearby venues...</p>
        ) : nearbyVenues.length ? (
          <>
            <div
              className="nearby-venues-track"
              ref={venueCarouselRef}
              onScroll={updateActiveVenue}
              role="region"
              aria-roledescription="carousel"
              aria-label="Nearby venues"
            >
              {nearbyVenues.map((venue, index) => (
                <article
                  className="nearby-venue-card"
                  key={venue.id}
                  aria-label={`${venue.name}, ${index + 1} of ${nearbyVenues.length}`}
                >
                  <div className="nearby-venue-content">
                    <h3>{venue.name}</h3>
                    <p className="nearby-venue-location">
                      {venue.distance} <span aria-hidden="true">•</span> {venue.location}
                    </p>
                    <div className="nearby-venue-next-event">
                      <p className="nearby-venue-eyebrow">Next up</p>
                      <h4>{venue.nextEvent}</h4>
                      <p className="nearby-venue-date">{venue.nextEventDate}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {nearbyVenues.length > 1 && (
              <nav className="nearby-venues-pagination" aria-label="Nearby venues carousel">
                <button
                  className="event-pagination-arrow"
                  type="button"
                  aria-label="Previous nearby venue"
                  onClick={() => scrollToVenue(activeVenueIndex - 1)}
                >
                  <HiOutlineChevronLeft aria-hidden="true" />
                </button>
                <div className="event-pagination-dots">
                  {nearbyVenues.map((venue, index) => (
                    <button
                      className={`event-pagination-dot${index === activeVenueIndex ? " is-active" : ""}`}
                      type="button"
                      key={venue.id}
                      aria-label={`Show ${venue.name}`}
                      aria-current={index === activeVenueIndex ? "true" : undefined}
                      onClick={() => scrollToVenue(index)}
                    />
                  ))}
                </div>
                <button
                  className="event-pagination-arrow"
                  type="button"
                  aria-label="Next nearby venue"
                  onClick={() => scrollToVenue(activeVenueIndex + 1)}
                >
                  <HiOutlineChevronRight aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <p className="events-message">No nearby venues available right now.</p>
        )}
      </section>

      <section className="theatre-events-section" aria-labelledby="theatre-events-heading">
        <h2 className="events-heading" id="theatre-events-heading">
          Breathtaking theatre performances
        </h2>
        {loading ? (
          <p className="events-message">Loading theatre performances...</p>
        ) : theatreEvents.length ? (
          <>
            <div
              className="events-grid theatre-events-track"
              ref={theatreCarouselRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Theatre performances"
            >
              {theatreEvents.map((event) => (
                <Eventscard key={event.id} {...event} showImage={false} />
              ))}
            </div>
            {theatreEvents.length > 1 && (
              <nav className="theatre-events-pagination" aria-label="Theatre performances carousel">
                <button
                  className="event-pagination-arrow"
                  type="button"
                  aria-label="Scroll to previous theatre performances"
                  onClick={() => scrollTheatreCarousel(-1)}
                >
                  <HiOutlineChevronLeft aria-hidden="true" />
                </button>
                <button
                  className="event-pagination-arrow"
                  type="button"
                  aria-label="Scroll to more theatre performances"
                  onClick={() => scrollTheatreCarousel(1)}
                >
                  <HiOutlineChevronRight aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <p className="events-message">No theatre performances available right now.</p>
        )}
      </section>

      <section className="district-artists-section" aria-labelledby="district-artists-heading">
        <div className="district-artists-header">
          <h2 className="events-heading" id="district-artists-heading">
            Artists in your District
          </h2>
          {!loading && districtArtists.length > 1 && (
            <nav className="district-artists-pagination" aria-label="Artists carousel">
              <button
                className="event-pagination-arrow"
                type="button"
                aria-label="Previous artists"
                onClick={() => scrollToArtistPage(activeArtistPage - 1)}
              >
                <HiOutlineChevronLeft aria-hidden="true" />
              </button>
              <div className="event-pagination-dots">
                {Array.from({ length: artistPageCount }, (_, page) => (
                  <button
                    className={`event-pagination-dot${page === activeArtistPage ? " is-active" : ""}`}
                    type="button"
                    key={page}
                    aria-label={`Show artist page ${page + 1}`}
                    aria-current={page === activeArtistPage ? "true" : undefined}
                    onClick={() => scrollToArtistPage(page)}
                  />
                ))}
              </div>
              <button
                className="event-pagination-arrow"
                type="button"
                aria-label="Next artists"
                onClick={() => scrollToArtistPage(activeArtistPage + 1)}
              >
                <HiOutlineChevronRight aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
        {loading ? (
          <p className="events-message">Loading artists...</p>
        ) : districtArtists.length ? (
          <div
            className="district-artists-track"
            ref={artistCarouselRef}
            onScroll={updateActiveArtistPage}
            role="region"
            aria-roledescription="carousel"
            aria-label="Artists in your District"
          >
            {districtArtists.map((artist) => (
              <article className="district-artist-card" key={artist.id}>
                <div className="district-artist-avatar" aria-hidden="true" />
                <h3>{artist.name}</h3>
              </article>
            ))}
          </div>
        ) : (
          <p className="events-message">No artists available right now.</p>
        )}
      </section>

      <AllEventsSection />
    </main>
  );
};

export default Events;