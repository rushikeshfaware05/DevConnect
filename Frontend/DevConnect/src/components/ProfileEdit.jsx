import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileEdit = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

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

        const profile = res.data;

        setFormData({
          name: profile.name || "",
          bio: profile.bio || "",
          skills: profile.skills ? profile.skills.join(", ") : "",
          socialLinks: {
            twitter: profile.socialLinks?.twitter || "",
            linkedin: profile.socialLinks?.linkedin || "",
            github: profile.socialLinks?.github || "",
          },
        });
      } catch (err) {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const authRes = await axios.get("http://localhost:3000/auth/is-authenticated", {
        withCredentials: true,
      });

      if (!authRes.data.authenticated) {
        setError("User not logged in.");
        return;
      }

      const userId = authRes.data.userId;

      const formDataToSend = new FormData();
      formDataToSend.append("userId", userId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append(
        "skills",
        formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
      );
      formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await axios.post("http://localhost:3000/profile/update", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Profile saved successfully!");
      navigate("/profile/view");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save profile.");
    }
  };

  if (loading)
    return <div className="text-center mt-5">Loading...</div>;

  return (
    <div
      className={`container mt-4 mb-5 rounded shadow p-4 ${
        isDarkMode ? "bg-dark text-light border border-warning" : "bg-light text-dark border border-secondary"
      }`}
      style={{ maxWidth: "700px", transition: "all 0.3s ease" }}
    >
      <h2 className="mb-4 text-center">Edit Your Profile</h2>

      {error && (
        <div className={`alert ${isDarkMode ? "alert-warning" : "alert-danger"}`}>
          {error}
        </div>
      )}
      {successMessage && (
        <div className={`alert ${isDarkMode ? "alert-warning" : "alert-success"}`}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold">
            Name <span className="text-warning">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className={`form-control ${
              isDarkMode
                ? "bg-secondary text-light border border-warning"
                : "border border-secondary"
            }`}
            style={{ transition: "background-color 0.3s ease" }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label fw-semibold">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className={`form-control ${
              isDarkMode
                ? "bg-secondary text-light border border-warning"
                : "border border-secondary"
            }`}
            style={{ transition: "background-color 0.3s ease" }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="skills" className="form-label fw-semibold">
            Skills (comma separated)
          </label>
          <input
            id="skills"
            name="skills"
            type="text"
            value={formData.skills}
            onChange={handleChange}
            className={`form-control ${
              isDarkMode
                ? "bg-secondary text-light border border-warning"
                : "border border-secondary"
            }`}
            style={{ transition: "background-color 0.3s ease" }}
          />
        </div>

        <h5 className="mt-4 mb-3">Social Links</h5>
        {["twitter", "linkedin", "github"].map((key) => (
          <div className="mb-3" key={key}>
            <label
              htmlFor={`socialLinks.${key}`}
              className="form-label fw-semibold"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              id={`socialLinks.${key}`}
              name={`socialLinks.${key}`}
              type="url"
              value={formData.socialLinks[key]}
              onChange={handleChange}
              className={`form-control ${
                isDarkMode
                  ? "bg-secondary text-light border border-warning"
                  : "border border-secondary"
              }`}
              style={{ transition: "background-color 0.3s ease" }}
            />
          </div>
        ))}

        <div className="mb-3">
          <label htmlFor="image" className="form-label fw-semibold">
            Profile Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className={`form-control ${
              isDarkMode
                ? "bg-secondary text-light border border-warning"
                : "border border-secondary"
            }`}
          />
        </div>

        <button
          type="submit"
          className={`btn btn-${
            isDarkMode ? "warning" : "primary"
          } w-100 mt-4 fw-semibold`}
          style={{ transition: "background-color 0.3s ease" }}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
