import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import userService from "../../services/userService";

function Profile() {
  const navigate = useNavigate();
  const loggedUser = useMemo(
    () => {
      try {
        return JSON.parse(localStorage.getItem("loggedUser"));
      } catch {
        return null;
      }
    },
    []
  );

  const [profile, setProfile] = useState({
    name: "",
    email: loggedUser?.email || "",
    mobile: "",
    address: "",
    profilePic: "",
  });

  const [pw, setPw] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserProfile = React.useCallback(async () => {
    if (!loggedUser?.id) {
      setError("User ID not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const user = await userService.getUserById(loggedUser.id);
      setProfile({
        name: user.name || "",
        email: user.email || loggedUser.email,
        mobile: user.mobileNumber || "",
        address: user.address || "",
        profilePic: user.profilePhotoUrl || "",
      });
      setError("");
    } catch (err) {
      console.error("Error fetching user profile:", err);
      const errorMessage = err?.error || err?.message || "Failed to load profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loggedUser]);

  useEffect(() => {
    if (!loggedUser) {
      alert("Please login first");
      navigate("/user-login");
      return;
    }

    fetchUserProfile();
  }, [loggedUser, navigate, fetchUserProfile]);

  const onChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onPic = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((p) => ({ ...p, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    if (!loggedUser?.id) {
      alert("User ID not found. Please login again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await userService.updateUser(loggedUser.id, {
        name: profile.name,
        email: profile.email,
        mobileNumber: profile.mobile,
        address: profile.address,
        profilePhotoUrl: profile.profilePic,
      });
      alert("Profile Updated");
      // Refresh profile data
      await fetchUserProfile();
    } catch (err) {
      const errorMessage = err?.error || err?.message || "Failed to update profile";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (!pw.oldPassword || !pw.newPassword) {
      alert("Enter old and new password");
      return;
    }

    // Note: Password change functionality requires backend API endpoint
    // For now, showing a message that this feature needs backend support
    alert("Password change functionality requires backend API endpoint. Please contact administrator.");
    
    // TODO: Implement password change API endpoint in backend
    // The backend would need to:
    // 1. Verify old password
    // 2. Update password with new hashed password
    // 3. Return success/error response
  };

  return (
    <div className="page-content center-page">
      <div className="profile-grid">
        <form className="form-box large-form" onSubmit={saveProfile}>
          <h2 className="form-title">MY PROFILE</h2>
          
          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <div className="profile-pic-row">
            <div className="avatar">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="Profile" />
              ) : (
                <div className="avatar-fallback">No Photo</div>
              )}
            </div>

            <div className="avatar-actions">
              <label className="file-label">
                Change Profile Pic
                <input type="file" accept="image/*" onChange={onPic} />
              </label>
            </div>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profile.name}
            onChange={onChange}
            required
            disabled={loading}
          />

          <input type="email" value={profile.email} disabled />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile"
            value={profile.mobile}
            onChange={onChange}
            disabled={loading}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={profile.address}
            onChange={onChange}
            disabled={loading}
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "SAVING..." : "SAVE PROFILE"}
          </button>
        </form>

        <form className="form-box large-form" onSubmit={changePassword}>
          <h2 className="form-title">CHANGE PASSWORD</h2>

          <input
            type="password"
            placeholder="Old Password"
            value={pw.oldPassword}
            onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="New Password"
            value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
            required
          />

          <button type="submit" className="submit-btn">
            UPDATE PASSWORD
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

