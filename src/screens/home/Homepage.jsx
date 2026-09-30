import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import db from '../../data/db.json';
import './Home.css';
import Footer from '../footer/Footer';

const fallbackHomepage = {
  categories: ['All', 'Music', 'Food & Drink', 'Workshops', 'Art & Culture', 'Sports', 'Community', 'Outdoor', 'Kids'],
  featuredBanner: {
    badge: 'MUSIC · LIVE CONCERT',
    title: 'Yuvan Shankar Raja Live in Chennai',
    description: 'Feel the music. Feel alive.',
    details: 'Sat, 26 Sep · 2026, 7PM · Nehru Indoor Stadium, Chennai',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  },
  recommended: [
    {
      id: 1,
      title: 'Sunset Music Fest',
      date: 'Fri, 10 Oct · 7:00 PM',
      location: 'Marina Beach, Chennai',
      price: '₹799',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 2,
      title: 'Chef’s Table Experience',
      date: 'Sat, 11 Oct · 8:30 PM',
      location: 'Velachery, Chennai',
      price: '₹1,299',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 3,
      title: 'Art & Culture Walk',
      date: 'Sun, 12 Oct · 10:00 AM',
      location: 'Mylapore, Chennai',
      price: '₹599',
      image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=900&q=80',
    },
  ],
  trending: [
    {
      id: 4,
      title: 'Night Bazaar Walk',
      date: 'Fri, 17 Oct · 6:00 PM',
      location: 'T Nagar, Chennai',
      price: '₹999',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 5,
      title: 'Wellness & Yoga Session',
      date: 'Sat, 18 Oct · 7:30 AM',
      location: 'Adyar, Chennai',
      price: '₹450',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 6,
      title: 'Family Weekend Picnic',
      date: 'Sun, 19 Oct · 9:30 AM',
      location: 'Guindy National Park',
      price: '₹750',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    },
  ],
  topPicks: [
    {
      id: 7,
      title: 'Royal Tamil Food Trail',
      date: 'Sat, 25 Oct · 1:00 PM',
      location: 'Triplicane, Chennai',
      price: '₹1,199',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 8,
      title: 'Open Air Cinema',
      date: 'Fri, 31 Oct · 7:00 PM',
      location: 'Besant Nagar, Chennai',
      price: '₹699',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: 9,
      title: 'Weekend Brunch Club',
      date: 'Sun, 02 Nov · 11:30 AM',
      location: 'Anna Nagar, Chennai',
      price: '₹1,499',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80',
    },
  ],
  offers: [
    { id: 1, title: 'Early Bird Offers', image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80' },
    { id: 2, title: 'Member Deals', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80' },
    { id: 3, title: 'Weekend Bundles', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80' },
  ],
};

const homepageData = db?.homepage || fallbackHomepage;

const filterCategories = {
  Music: 'Events',
  'Food & Drink': 'Dining',
  Workshops: 'Activities',
  'Art & Culture': 'Events',
  Sports: 'Activities',
  Community: 'Events',
  Outdoor: 'Activities',
  Kids: 'Activities',
};

const toExperience = (event, category) => ({
  ...event,
  name: event.name || event.title,
  title: event.title || event.name,
  category: event.category || category,
  price: Number(String(event.price ?? '').replace(/[^\d.]/g, '')) || undefined,
  rating: event.rating ?? 4.5,
  distance: event.distance ?? 0,
  location: event.location || 'Chennai',
});

const CategoryFilter = ({ categories = homepageData.categories || fallbackHomepage.categories, onSelect }) => (
  <div className="category-filter">
    {categories.map((cat) => (
      <button key={cat} className="chip" onClick={() => onSelect(cat)}>
        {cat}
      </button>
    ))}
  </div>
);

const EventCard = ({ event, category }) => {
  const experience = toExperience(event, category);

  return (
  <Link
    className="event-card"
    to={`/experience/${encodeURIComponent(event.id)}`}
    state={{ experience }}
    aria-label={`View details for ${experience.title}`}
  >
    <div className="card-image-placeholder">
      {experience.image && <img src={experience.image} alt={experience.title} />}
    </div>
    <h3>{experience.title}</h3>
    <p className="meta">{experience.date}</p>
    <p className="location">{experience.location}</p>
    <p className="price">From {event.price}</p>
  </Link>
  );
};

const SectionHeader = ({ title, linkText = 'See All', onSeeAll }) => (
  <div className="section-header">
    <h2>{title}</h2>
    {linkText && <button type="button" onClick={onSeeAll}>{linkText}</button>}
  </div>
);

const HeroSection = ({ featured = homepageData.featuredBanner || fallbackHomepage.featuredBanner, onBook }) => (
  <section className="hero for-you">
    <h1>For You</h1>
    <p className="subtitle">Experiences picked just for you</p>
    <div
      className="featured-banner"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${featured.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <span className="badge">{featured.badge}</span>
      <h2>{featured.title}</h2>
      <p>{featured.description}</p>
      <p>{featured.details}</p>
      <button className="cta" onClick={onBook}>
        Book Now →
      </button>
      <div className="tagline">More Music More Life</div>
    </div>
  </section>
);

const RecommendedSection = ({ events = homepageData.recommended || fallbackHomepage.recommended, onSeeAll }) => (
  <section className="recommended">
    <SectionHeader title="Recommended For You" onSeeAll={onSeeAll} />
    <div className="card-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} category="Recommended" />
      ))}
    </div>
  </section>
);

const WeekendSpecial = ({ image = homepageData.recommended?.[0]?.image || fallbackHomepage.recommended[0].image, onExplore }) => (
  <section className="weekend-special">
    <div className="copy">
      <h2>Let&apos;s Make This Weekend Special</h2>
      <p>Discover exclusive experiences for a brighter you!</p>
      <button onClick={onExplore}>Explore Now</button>
    </div>
    <div className="images-placeholder">
      {image && <img src={image} alt="Weekend special" />}
    </div>
  </section>
);

const TrendingSection = ({ events = homepageData.trending || fallbackHomepage.trending, onSeeAll }) => (
  <section className="trending">
    <SectionHeader title="Trending Near You" onSeeAll={onSeeAll} />
    <div className="card-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} category="Trending" />
      ))}
    </div>
  </section>
);

const ExploreByCategory = ({ categories = homepageData.categories || fallbackHomepage.categories, onSelect }) => (
  <section className="explore-category">
    <SectionHeader title="Explore by Category" linkText="" />
    <div className="category-pills">
      {categories.filter((category) => category !== 'All').map((cat) => (
          <button key={cat} className="category-pill" onClick={() => onSelect(cat)}>
          {cat}
        </button>
      ))}
    </div>
  </section>
);

const CitySpacePlus = ({ image = homepageData.featuredBanner?.image || fallbackHomepage.featuredBanner.image, onLearnMore }) => (
  <section className="cityspace-plus">
    <div className="copy">
      <h2>CitySpace Plus</h2>
      <p>More exclusive. Early bird tickets. Exclusive experiences.</p>
      <button onClick={onLearnMore}>Learn More</button>
    </div>
    <div className="bg-placeholder">
      {image && <img src={image} alt="CitySpace plus" />}
    </div>
  </section>
);

const TopPicks = ({ events = homepageData.topPicks || fallbackHomepage.topPicks, onSeeAll }) => (
  <section className="top-picks">
    <SectionHeader title="Top Picks in Chennai" onSeeAll={onSeeAll} />
    <div className="card-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} category="Top Picks" />
      ))}
    </div>
  </section>
);

const OffersSection = ({ offers = homepageData.offers || fallbackHomepage.offers }) => (
  <section className="offers">
    <SectionHeader title="Offers For You" linkText="" />
    <div className="offer-cards">
      {offers.map((offer) => (
        <div key={offer.id} className="offer-card">
          {offer.image && <img src={offer.image} alt={offer.title} />}
          <span>{offer.title}</span>
        </div>
      ))}
    </div>
  </section>
);

export default function CitySpaceHome() {
  const navigate = useNavigate();
  const featuredBanner = homepageData.featuredBanner || fallbackHomepage.featuredBanner;
  const categories = homepageData.categories || fallbackHomepage.categories;
  const recommendedEvents = homepageData.recommended || fallbackHomepage.recommended;
  const trendingEvents = homepageData.trending || fallbackHomepage.trending;
  const topPicksEvents = homepageData.topPicks || fallbackHomepage.topPicks;
  const offers = homepageData.offers || fallbackHomepage.offers;
  const weekendImage = recommendedEvents[0]?.image || fallbackHomepage.recommended[0].image;
  const openCategory = (category) => {
    const filterCategory = filterCategories[category] || category;
    navigate(category === 'All' ? '/filter' : `/filter/${encodeURIComponent(filterCategory)}`);
  };
  const openEventList = (events, heading, category) => {
    navigate('/matches', {
      state: {
        heading,
        results: events.map((event) => toExperience(event, category)),
      },
    });
  };
  const featuredExperience = {
    ...featuredBanner,
    id: 'featured',
    name: featuredBanner.title,
    category: 'Events',
    location: featuredBanner.details?.split('·').at(-1)?.trim() || 'Chennai',
  };

  return (
    <div className="cityspace-home">
      <main>
        <HeroSection
          featured={featuredBanner}
          onBook={() => navigate('/booking', { state: { experience: featuredExperience } })}
        />
        <CategoryFilter categories={categories} onSelect={openCategory} />
        <RecommendedSection
          events={recommendedEvents}
          onSeeAll={() => openEventList(recommendedEvents, 'Recommended For You', 'Recommended')}
        />
        <WeekendSpecial
          image={weekendImage}
          onExplore={() => openEventList(recommendedEvents, 'Weekend Experiences', 'Recommended')}
        />
        <TrendingSection
          events={trendingEvents}
          onSeeAll={() => openEventList(trendingEvents, 'Trending Near You', 'Trending')}
        />
        <ExploreByCategory categories={categories} onSelect={openCategory} />
        <CitySpacePlus image={featuredBanner.image} onLearnMore={() => navigate('/signup')} />
        <TopPicks
          events={topPicksEvents}
          onSeeAll={() => openEventList(topPicksEvents, 'Top Picks in Chennai', 'Top Picks')}
        />
        <OffersSection offers={offers} />
      </main>
      <Footer />
    </div>
  );
}
