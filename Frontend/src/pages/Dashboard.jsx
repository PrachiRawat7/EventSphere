import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DashboardSidebar from "../components/DashboardSidebar";
import Event from "../components/Event";
import Ticket from "../components/Ticket"; // Import the Ticket component
import Profile from "../components/Profile";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);         // new state for tickets
  const [selectedMenu, setSelectedMenu] = useState("events");
  const [loading, setLoading] = useState(true);
  const [ticketsLoading, setTicketsLoading] = useState(false);  // loading state for tickets
  const [error, setError] = useState("");
  const [ticketsError, setTicketsError] = useState("");          // error state for tickets
  const [user, setUser] = useState(null);


  const navigate=useNavigate();

  const handleRegister = async (eventId) => {
    console.log("handleRegister called with eventId:", eventId);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/tickets",
        { eventId },
        { withCredentials: true }
      );
      alert("Ticket created successfully!");
      // Optionally refresh tickets after registration:
      if (selectedMenu === "tickets") {
        fetchTickets();  // call fetchTickets if on tickets tab
      }
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to create ticket. Try again."
      );
    }
    
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/users/logout", {}, { withCredentials: true });
      alert("Logged out successfully");
      navigate("/");  // navigate to homepage after success
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed, try again");
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/v1/events/all", {
        withCredentials: true,
      });
      setEvents(response.data.data.events || response.data.events || []);
      setError("");
    } catch (err) {
      setError("Failed to load events");
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      setTicketsLoading(true);
      const response = await axios.get("http://localhost:3000/api/v1/tickets", {
        withCredentials: true,
      });
      setTickets(response.data.data || []);
      setTicketsError("");
    } catch (err) {
      setTicketsError("No Tickets Available");
      setTickets([]);
    } finally {
      setTicketsLoading(false);
    }
  };
useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/users/me", {
          withCredentials: true,
        });
        setUser(response.data.data || response.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedMenu === "events") {
      fetchEvents();
    } else if (selectedMenu === "tickets") {
      fetchTickets();
    }
  }, [selectedMenu]);

 

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <DashboardSidebar selected={selectedMenu} onSelect={setSelectedMenu} />

        <main className="dashboard-content">
          {selectedMenu === "events" && (
            <>
              <h2 className="section-title">Upcoming Events</h2>

              {loading ? (
                <p>Loading events...</p>
              ) : error ? (
                <p className="error">{error}</p>
              ) : events.length === 0 ? (
                <p>No events available.</p>
              ) : (
                <div className="event-grid">
                  {events.map((event) => (
                    <Event key={event._id} {...event} onRegister={handleRegister} />
                  ))}
                </div>
              )}
            </>
          )}

          {selectedMenu === "tickets" && (
            <>
              <h2 className="section-title">My Tickets</h2>

              {ticketsLoading ? (
                <p>Loading tickets...</p>
              ) : ticketsError ? (
                <p className="error">{ticketsError}</p>
              ) : tickets.length === 0 ? (
                <p>No tickets found.</p>
              ) : (
                <div className="ticket-grid">
                  {tickets.map((ticket) => (
                    <Ticket key={ticket._id} ticket={ticket} />
                  ))}
                </div>
              )}
            </>
          )}

          {selectedMenu === "profile" && (
            <>
              <h2 className="section-title">Profile</h2>
              <Profile user={user} onLogout={handleLogout} />
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
