import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Home.css"; // Adjust path if your CSS is elsewhere

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <div className="home-container">
        <main className="home-main">
          <div className="content-wrapper">
            <section className="intro-section">
              <h2 className="main-heading">Welcome to Event Sphere</h2>
              <p className="sub-text">
                <strong>Event Sphere</strong> is your one-stop platform to create, manage, and join exciting community events. <br />
                From concerts and workshops to meetups and study groups – organize or participate in events with ease, track attendance, and never miss out!
              </p>
            </section>

            <section className="action-section">
              <div className="card">
                <h3 className="card-heading">Get Started</h3>
                <button onClick={() => navigate("/login")} className="btn btn-filled">Login</button>
                <button onClick={() => navigate("/register")} className="btn btn-outline">Register</button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}


export default Home;
