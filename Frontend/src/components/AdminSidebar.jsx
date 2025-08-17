import React from "react";
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import "./AdminSidebar.css";

function AdminSidebar({ selected, onSelect }) {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-title">Admin Menu</div>
      <ul className="sidebar-list">
        <li
          className={selected === "events" ? "active" : ""}
          onClick={() => onSelect("events")}
        >
          <FaCalendarAlt /> Events
        </li>
        <li
          className={selected=="create"?"active": ""}
          onClick={()=>onSelect("create")}
        >
          <FaCalendarAlt /> Create 
          
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

export default AdminSidebar;
