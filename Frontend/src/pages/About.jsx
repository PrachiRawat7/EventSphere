import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  return (
    <>
      <Header />

      <main className="about-container">
        <h1>About Event Sphere</h1>
        <p>
          <strong>Event Sphere</strong> is your local hub to discover, create, and manage exciting community events.
          Our mission is to connect people with meaningful activities — whether concerts, workshops, meetups, or study groups.
        </p>

        <section>
          <h2>Our Vision</h2>
          <p>
            To foster community connections and make event management simple and fun for everyone.
          </p>
        </section>

        <section>
          <h2>Our Team</h2>
          <p>
            We’re a passionate group of developers and event enthusiasts dedicated to building a seamless event platform.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;
