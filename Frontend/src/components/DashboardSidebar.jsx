import React from "react";
import { FaCalendarAlt, FaUser, FaHistory, FaTicketAlt } from "react-icons/fa";
import "./DashboardSidebar.css";

function DashboardSidebar({ selected, onSelect }) {
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-title">Dashboard Menu</div>
      <ul className="sidebar-list">
        <li
          className={selected === "events" ? "active" : ""}
          onClick={() => onSelect("events")}
        >
          <FaCalendarAlt /> Upcoming Events
        </li>
        <li
          className={selected === "tickets" ? "active" : ""}
          onClick={() => onSelect("tickets")}
        >
          <FaTicketAlt /> My Tickets
        </li>
        
        <li
          className={selected === "profile" ? "active" : ""}
          onClick={() => onSelect("profile")}
        >
          <FaUser /> Profile
        </li>
      </ul>
    </aside>
  );
}

export default DashboardSidebar;
