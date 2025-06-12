import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("bg-dark"));
  const navigate = useNavigate();

  // Watch <body> class changes to update dark mode state dynamically
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("bg-dark"));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authRes = await axios.get("http://localhost:3000/auth/is-authenticated", {
          withCredentials: true,
        });

        if (!authRes.data.authenticated) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const userId = authRes.data.userId;

        const res = await axios.get(`http://localhost:3000/profile/${userId}`, {
          withCredentials: true,
        });

        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  const renderProfileImage = () => {
    const baseStyle = {
      width: "130px",
      height: "130px",
      objectFit: "cover",
      transition: "transform 0.3s ease-in-out",
    };

    if (profile?.image) {
      return (
        <img
          src={`http://localhost:3000/images/${profile.image}`}
          alt={profile.name}
          className="rounded-circle img-thumbnail shadow profile-img"
          style={baseStyle}
        />
      );
    }

    const firstLetter = profile?.name ? profile.name.charAt(0).toUpperCase() : "?";
    return (
      <div
        className="rounded-circle d-flex align-items-center justify-content-center shadow profile-img"
        style={{
          ...baseStyle,
          backgroundColor: isDarkMode ? "#444" : "#ddd",
          color: isDarkMode ? "#fff" : "#333",
          fontSize: "48px",
        }}
      >
        {firstLetter}
      </div>
    );
  };

  if (loading) return <div className="text-center mt-5">Loading profile...</div>;
  if (error) return <div className="alert alert-danger mt-3 text-center">{error}</div>;

  return (
    <div className="container py-5">
      <style>{`
        .profile-img:hover {
          transform: scale(1.1);
        }
        .profile-card {
          background-color: ${isDarkMode ? "#2b2b2b" : "#fff"};
          color: ${isDarkMode ? "#f1f1f1" : "#212529"};
        }
        .profile-card .badge {
          background-color: ${isDarkMode ? "#444" : "#f8f9fa"};
          color: ${isDarkMode ? "#ddd" : "#333"};
          border: 1px solid ${isDarkMode ? "#666" : "#ccc"};
        }
        .profile-card .btn-outline-dark {
          color: ${isDarkMode ? "#f8f9fa" : "#212529"};
          border-color: ${isDarkMode ? "#555" : "#212529"};
        }
        .profile-card .btn-outline-dark:hover {
          background-color: ${isDarkMode ? "#555" : "#212529"};
          color: white;
        }
        .profile-card h5.text-primary {
          color: ${isDarkMode ? "#a0c1ff" : "#0d6efd"};
        }
      `}</style>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 profile-card">
            <div
              className="card-header text-center"
              style={{
                background: isDarkMode
                  ? "linear-gradient(to right, #3a3f51, #1f1f2e)"
                  : "linear-gradient(to right, #6a11cb, #2575fc)",
              }}
            >
              <div className="d-flex justify-content-center mb-3 mt-3">
                {renderProfileImage()}
              </div>
              <h4 className="fw-bold mb-0">{profile.name || "-"}</h4>
              <small className="text-light opacity-75">{profile.bio || "No bio provided"}</small>
            </div>

            <div className="card-body">
              <h5 className="mb-2 text-primary">Skills</h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {profile.skills?.length ? (
                  profile.skills.map((skill, i) => (
                    <span key={i} className="badge shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No skills listed</span>
                )}
              </div>

              <h5 className="mb-2 text-primary">Social Links</h5>
              <div className="d-flex flex-wrap gap-2">
                {profile.socialLinks &&
                  Object.entries(profile.socialLinks).map(([key, val]) => (
                    <a
                      key={key}
                      href={val}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2 shadow-sm"
                    >
                      <i className={`bi bi-${key}`}></i>
                      {key}
                    </a>
                  ))}
                {!profile.socialLinks && (
                  <span className="text-muted">No social links</span>
                )}
              </div>

              <div className="text-center mt-4">
                <button className="btn btn-primary shadow" onClick={handleEdit}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
