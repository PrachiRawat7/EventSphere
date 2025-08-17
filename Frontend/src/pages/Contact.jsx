import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Contact.css";

function Contact() {
  return (
    <>
      <Header />

      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you! Reach out to us via any of the following:</p>

        <section className="contact-details">
          <div className="contact-item">
            <h2>Address</h2>
            <p>123 Event Sphere Blvd,<br />Cityville, Country 12345</p>
          </div>

          <div className="contact-item">
            <h2>Email</h2>
            <p>eventsphere@example.com</p>
          </div>

          <div className="contact-item">
            <h2>Phone</h2>
            <p>+91 9873937600</p>
          </div>

         
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;
