import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-left" >
        EVENT SPHERE
      </div>
      <div className="header-right">
        <button className="header-btn" onClick={() => navigate("/about")}>
          About Us
        </button>
        <button className="header-btn" onClick={() => navigate("/contact")}>
          Contact Us
        </button>
      </div>
    </header>
  );
}

export default Header;
