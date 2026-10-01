import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiCheck, FiHeart, FiTrash2, FiX } from "react-icons/fi";
import LocationModal from "./Navigation";
import { getFavorites, setFavorites } from "../../utils/favorites";
import "./Navbar.css";

const AUTH_KEY = "cityspace_user";
const NOTIFICATIONS_KEY = "cityspace_notifications";

const getStoredNotifications = () => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored !== null) {
      const notifications = JSON.parse(stored);
      return Array.isArray(notifications) ? notifications : [];
    }
  } catch {
    return [];
  }

  return [
    {
      id: "cityspace-welcome",
      title: "Welcome to CitySpace",
      message: "Your next city experience is waiting to be discovered.",
      createdAt: new Date().toISOString(),
      read: false,
    },
  ];
};

const getStoredUser = () => {
  try {
    const value = localStorage.getItem(AUTH_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [fetchedLocation, setFetchedLocation] = useState(
    navigator.geolocation ? "Detecting location..." : "Location unavailable"
  );
  const [manualLocation, setManualLocation] = useState("");
  const isLoggedIn = Boolean(currentUser);
  const [activePanel, setActivePanel] = useState(null);
  const [favorites, setCurrentFavorites] = useState(getFavorites);
  const [notifications, setNotifications] = useState(getStoredNotifications);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncAuthState = () => {
      setCurrentUser(getStoredUser());
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("auth-change", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("auth-change", syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const handlePosition = async ({ coords }) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
        );

        if (!response.ok) throw new Error("Unable to find location");

        const data = await response.json();
        const address = data.address || {};
        const area =
          address.neighbourhood ||
          address.suburb ||
          address.city_district ||
          address.quarter;
        const city =
          address.city || address.town || address.village || address.municipality;

        setFetchedLocation(
          area && city && area.toLowerCase() !== city.toLowerCase()
            ? `${area}, ${city}`
            : area || city || address.state || "Current location"
        );
      } catch {
        setFetchedLocation("Current location");
      }
    };

    navigator.geolocation.getCurrentPosition(
      handlePosition,
      () => setFetchedLocation("Location unavailable"),
      { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const syncFavorites = () => setCurrentFavorites(getFavorites());
    const syncNotifications = () => setNotifications(getStoredNotifications());
    window.addEventListener("favorites-change", syncFavorites);
    window.addEventListener("storage", syncFavorites);
    window.addEventListener("storage", syncNotifications);
    return () => {
      window.removeEventListener("favorites-change", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
      window.removeEventListener("storage", syncNotifications);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActivePanel(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePanel = (panel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const handleLogin = () => {
    setActivePanel(null);
    navigate("/signin");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setActivePanel(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/signin");
  };

  const openFavorite = (favorite) => {
    setActivePanel(null);
    navigate(favorite.route || "/experience", { state: favorite.state });
  };

  const removeFavorite = (event, favoriteId) => {
    event.stopPropagation();
    setFavorites(favorites.filter((favorite) => favorite.id !== favoriteId));
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  };

  const removeNotification = (notificationId) => {
    setNotifications(notifications.filter((notification) => notification.id !== notificationId));
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">cityspace</div>
        <button
          className="location"
          type="button"
          onClick={() => setIsLocationOpen(true)}
        >
          <svg
            className="location-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{manualLocation || fetchedLocation}</span>
        </button>
      </div>

      <div className="navbar-center">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Home
        </NavLink>
        <NavLink to="/dining" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Dining
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Events
        </NavLink>
        <NavLink to="/stores" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Stores
        </NavLink>
        <NavLink to="/activities" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Activities
        </NavLink>
        <NavLink to="/play" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Play
        </NavLink>
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search experiences" />
        </div>

        <div className="navbar-actions" ref={dropdownRef}>
          <button
            className={`navbar-icon-button ${activePanel === "favorites" ? "is-active" : ""}`}
            type="button"
            aria-label={`Favorites${favorites.length ? `, ${favorites.length} saved` : ""}`}
            aria-expanded={activePanel === "favorites"}
            title="Favorites"
            onClick={() => togglePanel("favorites")}
          >
            <FiHeart aria-hidden="true" />
            {favorites.length > 0 && <span className="navbar-count">{favorites.length}</span>}
          </button>
          <button
            className={`navbar-icon-button ${activePanel === "notifications" ? "is-active" : ""}`}
            type="button"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={activePanel === "notifications"}
            title="Notifications"
            onClick={() => togglePanel("notifications")}
          >
            <FiBell aria-hidden="true" />
            {unreadCount > 0 && <span className="navbar-count notification-count">{unreadCount}</span>}
          </button>

          <div className="profile-wrapper">
            <button
              className="profile-btn"
              type="button"
              aria-expanded={activePanel === "profile"}
              onClick={() => togglePanel("profile")}
              title={currentUser ? currentUser.fullName || "User Profile" : "Sign In"}
            >
              {currentUser && currentUser.fullName
                ? currentUser.fullName.charAt(0).toUpperCase()
                : "P"}
            </button>

            {activePanel === "profile" && (
              <div className="profile-dropdown">
                {isLoggedIn ? (
                  <>
                    <button className="dropdown-item" onClick={() => setActivePanel(null)}>
                      Profile
                    </button>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <button className="dropdown-item" onClick={handleLogin}>
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>

          {activePanel === "favorites" && (
            <section className="navbar-popover" aria-label="Saved experiences">
              <div className="popover-heading">
                <div>
                  <h2>Favorites</h2>
                  <span>{favorites.length} saved</span>
                </div>
                <button className="popover-close" type="button" aria-label="Close favorites" onClick={() => setActivePanel(null)}>
                  <FiX aria-hidden="true" />
                </button>
              </div>
              {favorites.length ? (
                <div className="popover-list">
                  {favorites.map((favorite) => (
                    <article className="favorite-entry" key={favorite.id}>
                      <button className="favorite-entry-open" type="button" onClick={() => openFavorite(favorite)}>
                        {favorite.image && <img src={favorite.image} alt="" />}
                        <span>
                          <strong>{favorite.title}</strong>
                          <small>{[favorite.category, favorite.location].filter(Boolean).join(" · ")}</small>
                        </span>
                      </button>
                      <button
                        className="entry-action"
                        type="button"
                        aria-label={`Remove ${favorite.title} from favorites`}
                        title="Remove from favorites"
                        onClick={(event) => removeFavorite(event, favorite.id)}
                      >
                        <FiX aria-hidden="true" />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="popover-empty">No saved experiences yet.</p>
              )}
            </section>
          )}

          {activePanel === "notifications" && (
            <section className="navbar-popover" aria-label="Notifications">
              <div className="popover-heading">
                <div>
                  <h2>Notifications</h2>
                  <span>{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</span>
                </div>
                <button className="popover-close" type="button" aria-label="Close notifications" onClick={() => setActivePanel(null)}>
                  <FiX aria-hidden="true" />
                </button>
              </div>
              {notifications.length ? (
                <>
                  <div className="popover-tools">
                    <button type="button" onClick={markAllNotificationsRead} disabled={!unreadCount}>
                      <FiCheck aria-hidden="true" /> Mark all read
                    </button>
                    <button type="button" onClick={() => setNotifications([])}>
                      <FiTrash2 aria-hidden="true" /> Clear all
                    </button>
                  </div>
                  <div className="popover-list notification-list">
                    {notifications.map((notification) => (
                      <article className={`notification-entry ${notification.read ? "is-read" : ""}`} key={notification.id}>
                        <button className="notification-entry-open" type="button" onClick={() => markNotificationRead(notification.id)}>
                          <span className="notification-dot" aria-hidden="true" />
                          <span>
                            <strong>{notification.title}</strong>
                            <small>{notification.message}</small>
                            <time>{new Date(notification.createdAt).toLocaleDateString()}</time>
                          </span>
                        </button>
                        <button
                          className="entry-action"
                          type="button"
                          aria-label={`Dismiss ${notification.title}`}
                          title="Dismiss notification"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <FiX aria-hidden="true" />
                        </button>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <p className="popover-empty">No notifications.</p>
              )}
            </section>
          )}
        </div>
      </div>
      {isLocationOpen && (
        <LocationModal
          onClose={() => setIsLocationOpen(false)}
          onSelectCity={setManualLocation}
          onUseCurrentLocation={() => setManualLocation("")}
        />
      )}
    </nav>
  );
};

export default Navbar;