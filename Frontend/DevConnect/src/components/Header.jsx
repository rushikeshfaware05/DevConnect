import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import auth from "../services/auth";
import 'bootstrap-icons/font/bootstrap-icons.css';

const styles = `
  .animated-search {
    width: 180px;
    transition: width 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    border-radius: 0.375rem;
    border: none; /* default no border for dark mode */
  }
  .animated-search:focus {
    width: 320px;
    border-color: #ffc107 !important;
    box-shadow: 0 0 8px #ffc107 !important;
    outline: none;
    background-color: #2c2c3a !important;
    color: #eee !important;
  }
  /* Light mode border on search input */
  .light-search-border {
    border: 1px solid #ccc !important;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  // Initialize dark mode from localStorage or default to true
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === null ? true : savedMode === "true";
  });

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/is-authenticated", {
          withCredentials: true,
        });

        if (res.data.authenticated) {
          setIsAuthenticated(true);
          setUserName(res.data.username || "Profile");
        } else {
          setIsAuthenticated(false);
          setUserName("");
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUserName("");
      }
    };

    checkAuthStatus();
  }, [location]);

  // Sync body classes and save to localStorage whenever mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("bg-dark", "text-light");
      document.body.classList.remove("bg-light", "text-dark");
    } else {
      document.body.classList.add("bg-light", "text-dark");
      document.body.classList.remove("bg-dark", "text-light");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
      setUserName("");
      navigate("/dashboard");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      <style>{styles}</style>

      <nav
        className={`navbar navbar-expand-lg shadow-sm ${
          isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
        }`}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1030,
          borderBottom: `1px solid ${isDarkMode ? "#ffc107" : "#ffc107"}`,
        }}
      >
        <div className="container-fluid">
          <Link
            className={`navbar-brand fs-3 fw-bold text-warning`}
            to="/"
          >
            DevConnect
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <form
              className="mx-auto my-2 my-lg-0"
              style={{ maxWidth: "500px", width: "100%" }}
              role="search"
            >
              <div className="input-group">
                <input
                  type="search"
                  className={`form-control animated-search ${
                    !isDarkMode ? "light-search-border" : ""
                  }`}
                  aria-label="Search"
                  placeholder="Search..."
                  style={{
                    backgroundColor: isDarkMode ? "#2c2c3a" : "#fff",
                    color: isDarkMode ? "#eee" : "#333",
                  }}
                />
                <button className="btn btn-warning text-dark" type="submit">
                  Search
                </button>
              </div>
            </form>

            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="darkModeSwitch"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <label
                    className={`form-check-label ${
                      isDarkMode ? "text-light" : "text-dark"
                    }`}
                    htmlFor="darkModeSwitch"
                  >
                    Dark Mode
                  </label>
                </div>
              </li>

              {!isAuthenticated ? (
                <li className="nav-item">
                  <Link
                    className={`btn btn-outline-warning ms-2 ${
                      isDarkMode ? "text-light" : "text-dark"
                    }`}
                    to="/signin"
                  >
                    Sign In
                  </Link>
                </li>
              ) : (
                <li className="nav-item dropdown">
                  <a
                    className={`nav-link dropdown-toggle d-flex align-items-center ${
                      isDarkMode ? "text-warning" : "text-warning"
                    }`}
                    href="#"
                    id="profileDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle fs-4 me-2"></i>
                    {userName || "Profile"}
                  </a>

                  <ul
                    className="dropdown-menu dropdown-menu-end shadow"
                    aria-labelledby="profileDropdown"
                    style={{
                      backgroundColor: isDarkMode ? "#1f1f1f" : "#fff",
                    }}
                  >
                    <li>
                      <Link
                        className={`dropdown-item ${
                          isDarkMode ? "text-warning" : "text-dark"
                        }`}
                        to="/profile/view"
                      >
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item ${
                          isDarkMode ? "text-warning" : "text-dark"
                        }`}
                        to="/profile/edit"
                      >
                        Edit Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${
                          isDarkMode ? "text-warning" : "text-dark"
                        }`}
                        onClick={handleLogout}
                        style={{ cursor: "pointer" }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Padding for fixed navbar */}
      <style>{`
        body {
          padding-top: 70px; /* Adjust if navbar height changes */
        }
      `}</style>
    </>
  );
};

export default Header;
