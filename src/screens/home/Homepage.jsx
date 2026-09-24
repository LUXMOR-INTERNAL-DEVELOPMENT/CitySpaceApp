import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Diningexperience from "../dinning/Diningexperience";
import Footer from "../footer/Footer";
import "./Home.css";

const FALLBACK_HOME_DATA = {
  home: {
    title: "Make more of your city.",
    subtitle: "Find memorable places, events and activities for your next day out.",
    hero: {
      title: "Your next city story starts here",
      description: "Explore fresh ideas for food, culture and adventure.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
    },
  },
  popular: [
    {
      id: "fallback-dining",
      title: "Neighbourhood Dining",
      category: "Dining",
      location: "Mylapore",
      date: "Available today",
      distance: 3,
      price: "From ₹899",
      rating: "4.7",
      description: "Discover welcoming tables, seasonal menus and local flavours.",
      icon: "🍽️",
      image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "fallback-event",
      title: "Live City Sessions",
      category: "Events",
      location: "Besant Nagar",
      date: "This weekend",
      distance: 7,
      price: "From ₹599",
      rating: "4.6",
      description: "Spend the evening with live performances and a crowd that feels local.",
      icon: "🎵",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "fallback-activity",
      title: "Outdoor Escape",
      category: "Activities",
      location: "Guindy",
      date: "Open daily",
      distance: 5,
      price: "From ₹499",
      rating: "4.8",
      description: "Trade routine for fresh air, movement and a little friendly challenge.",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    },
  ],
  weekendPicks: [
    {
      id: "fallback-weekend",
      title: "Easy Weekend Plans",
      category: "Experiences",
      location: "Chennai",
      date: "Ready when you are",
      distance: 4,
      price: "From ₹499",
      description: "A few well-chosen ways to make the weekend feel different.",
      rating: "4.7",
      image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80",
      fallbackImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

function normalizeHomeData(homeData) {
  return {
    ...FALLBACK_HOME_DATA,
    ...homeData,
    home: {
      ...FALLBACK_HOME_DATA.home,
      ...homeData?.home,
      hero: {
        ...FALLBACK_HOME_DATA.home.hero,
        ...homeData?.home?.hero,
      },
    },
    popular: Array.isArray(homeData?.popular) && homeData.popular.length > 0
      ? homeData.popular
      : FALLBACK_HOME_DATA.popular,
    weekendPicks: Array.isArray(homeData?.weekendPicks) && homeData.weekendPicks.length > 0
      ? homeData.weekendPicks
      : FALLBACK_HOME_DATA.weekendPicks,
  };
}

function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const handleImageClick = (item) => {
    const itemName = (item.type || item.category || item.title || "")
      .toLowerCase()
      .replace(/\s+/g, "");

    navigate(
      item.route ||
        (itemName.includes("dining")
          ? "/diningexperience"
          : "/experience"),
      item.route ? undefined : { state: { experience: item } },
    );
  };

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load JSON data");
        }

        return response.json();
      })
      .then((jsonData) => {
        const homeData = jsonData?.homepage ?? jsonData ?? {};
        setData(normalizeHomeData(homeData));
      })
      .catch((error) => {
        console.error("Error loading db.json:", error);
        setData(FALLBACK_HOME_DATA);
      });
  }, []);

  if (!data) {
    return (
      <div className="page">
        <main className="main">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  const { home, popular, weekendPicks } = data;

  return (
    <div className="page">
      <main className="main" id="home">

        {/* TITLE */}
        <h1>{home.title}</h1>

        <p className="subtitle">
          {home.subtitle}
        </p>

        {/* CONTENT GRID */}
        <div className="content-grid">

          {/* LEFT SECTION */}
          <section className="left-section">

            {/* HERO */}
            <div className="discover">

              <img
                src={home.hero.image}
                alt={home.hero.title}
                className="hero-image"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = home.hero.fallbackImage;
                }}
              />

              <div className="discover-content">

                <h2>{home.hero.title}</h2>

                <p>{home.hero.description}</p>

                {/* EXPLORE BUTTON */}
                <button
                  onClick={() => navigate("/filter")}
                >
                  Explore now
                </button>

              </div>
            </div>

            {/* POPULAR TITLE */}
            <h2 className="section-title">
              Popular this week
            </h2>

            {/* POPULAR CARDS */}
            <div className="cards">

              {popular.map((item) => (
                <div
                  className="card"
                  key={item.id}
                  onClick={() => navigate("/experience", { state: { experience: item } })}
                >

                  <div className="card-image">

                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = item.fallbackImage;
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleImageClick(item);
                      }}
                    />

                    <span className="card-icon">
                      {item.icon}
                    </span>

                  </div>

                  <div className="card-content">

                    <h3>{item.title}</h3>

                    <p className="card-meta">
                      {item.category} · {item.location}
                    </p>

                    <p className="card-meta">
                      {item.date} · {item.distance} km away · {item.price}
                    </p>

                    <p className="card-description">{item.description}</p>

                    <span className="rating">
                      ★ {item.rating}
                    </span>

                  </div>

                </div>
              ))}

            </div>

          </section>

          {/* WEEKEND PICKS */}
          <aside className="weekend-card">

            {weekendPicks.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/experience", { state: { experience: item } })}
                className="weekend-click"
              >

                <div className="weekend-image">

                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = item.fallbackImage;
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleImageClick(item);
                    }}
                  />

                </div>

                <h2>{item.title}</h2>

                <p className="weekend-description">{item.description}</p>

                <p className="weekend-meta">
                  {item.category} · {item.date} · {item.location}
                </p>

                <p className="weekend-meta">
                  {item.distance} km away · {item.price}
                </p>

                <span className="rating">
                  ★ {item.rating}
                </span>

              </div>
            ))}

          </aside>

        </div>

      </main>
      < Diningexperience />
      < Footer />
    </div>
  );
}

export default Home;