import React from "react";
import "./Profile.css";

function Profile({ user, onLogout }) {
  return (
    <div className="profile-container">
      <div className="profile-header-bg"></div>
      <div className="profile-card">
        <img
          src={user.profileimage || "/default-profile.png"}
          alt={user.fullname}
          className="profile-image"
        />
        <h2 className="profile-name">{user.fullname}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-username">@{user.username}</p>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
