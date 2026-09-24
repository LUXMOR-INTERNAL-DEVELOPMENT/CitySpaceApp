import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

const AUTH_KEY = "cityspace_user";

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
  const isLoggedIn = Boolean(currentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Close dropdown when clicking outside
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
        <div className="location">
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
          <span>Tamilnadu</span>
        </div>
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
      </div>

      <div className="navbar-right">
        <div className="search-box">
          <input type="text" placeholder="Search experiences" />
        </div>

        {/* Profile Button + Dropdown */}
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
                <>
                  <button className="dropdown-item" onClick={handleLogin}>
                    Sign In
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;