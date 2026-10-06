import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LocationModal from "./Navigation";
import "./Navbar.css";

const AUTH_KEY = "cityspace_user";
const LOCATION_KEY = "cityspace_location";

const getStoredLocation = () => {
  try {
    return localStorage.getItem(LOCATION_KEY) || "";
  } catch {
    return "";
  }
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
  const [manualLocation, setManualLocation] = useState(getStoredLocation);
  const isLoggedIn = Boolean(currentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    const location = manualLocation || fetchedLocation;
    if (!location || /detecting|unavailable|current location/i.test(location)) return;

    try {
      localStorage.setItem(LOCATION_KEY, location);
    } catch {
      // The in-memory event still updates the current page if storage is unavailable.
    }
    window.dispatchEvent(
      new CustomEvent("cityspace-location-change", { detail: location })
    );
  }, [manualLocation, fetchedLocation]);

  useEffect(() => {
    if (!navigator.geolocation) return;

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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogin = () => {
    setIsDropdownOpen(false);
    navigate("/signin");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setIsDropdownOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/signin");
  };

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

        <div className="profile-wrapper" ref={dropdownRef}>
          <div
            className="profile-btn"
            onClick={toggleDropdown}
            title={currentUser ? currentUser.fullName || "User Profile" : "Sign In"}
          >
            {currentUser && currentUser.fullName
              ? currentUser.fullName.charAt(0).toUpperCase()
              : "P"}
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              {isLoggedIn ? (
                <>
                  <button className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
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