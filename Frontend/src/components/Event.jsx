import React from "react";
import "./Event.css";
import DeleteIcon from '@mui/icons-material/Delete';

function Event({ _id, name, description, location, date, eimage, onRegister, showRegisterButton = true,isAdmin=false,onDelete }) {
  return (
    <div className="event-card">
      <img src={eimage} alt={name} className="event-image" />
      <h2 className="event-name">{name}</h2>
      <p className="event-description">{description}</p>
      <p className="event-details">
        <strong>Location:</strong> {location} <br />
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      {showRegisterButton && (
        <button
          onClick={() => {
            console.log("Register");
            onRegister(_id);
          }}
          className="register-btn"
        >
          {isAdmin ? "View Registrations" : "Register"}
        </button>
      )}
      {isAdmin && (
        <button
          className="delete-btn"
          onClick={() => onDelete?.(_id)}
          
          
        >
          <DeleteIcon className="icon1" />
        </button>
      )}
    </div>
  );
}

export default Event;
