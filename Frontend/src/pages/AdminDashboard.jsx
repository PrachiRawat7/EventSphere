import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdminSidebar from "../components/AdminSidebar.jsx";
import Event from "../components/Event";
import Profile from "../components/Profile";
import "./Dashboard.css";   
import "./AdminDashboard.css";
           // for .dashboard-container, .dashboard-content, .event-grid
import { useNavigate } from "react-router-dom";
 

function AdminDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("events");
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [attendeeError, setAttendeeError] = useState("");
  const navigate = useNavigate();

  // fetch current admin user
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/users/me", { withCredentials: true })
      .then((res) => setUser(res.data.data || res.data.user))
      .catch(() => {});
  }, []);

  // fetch events
  const fetchEvents = () =>
    axios
      .get("http://localhost:3000/api/v1/events/all", { withCredentials: true })
      .then((res) => {
        setEvents(res.data.data.events || []);
        setError("");
      })
      .catch((_) => {
        setError("Failed to load events");
        setEvents([]);
      });

  useEffect(() => {
    if (selectedMenu === "events") fetchEvents();
  }, [selectedMenu]);

  // form handling
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/api/v1/events/create",
        formData,
        { withCredentials: true }
      );
      setFormData({ name: "", description: "", location: "", date: "" });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch {
      /* ignore */
    }
  };

  const handleRegister=async(eventId)=>{
    setSelectedEventId(eventId);
    setShowModal(true);          // open modal
    setLoadingAttendees(true);   // show loading
    setAttendeeError("");
    setAttendees([]);

    try {
    const response = await axios.get(
      `http://localhost:3000/api/v1/admin/events/${eventId}/attendees`,
      { withCredentials: true }
      );
      console.log("Attendee response:", response.data);
      setAttendees(response.data.data); // assuming API sends data in `data`
      } catch (error) {
       console.error("Error fetching attendees:", error);
      setAttendeeError(
      error.response?.data?.message || "Failed to fetch attendees"
    );
  } finally {
    setLoadingAttendees(false);
  }
  }

  const handleDeleteEvent = async (id) => {
  if (!window.confirm("Delete this event? Tickets/registrations will be removed.")) return;

  try {
    await axios.delete(`http://localhost:3000/api/v1/events/${id}`, {
      withCredentials: true,
    });
    // remove from list (or call fetchEvents())
    setEvents(prev => prev.filter(e => e._id !== id));
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete event");
  }
};

 




  
  return (
    <>
      <Header />

      <div className="dashboard-container">
        <AdminSidebar
          selected={selectedMenu}
          onSelect={setSelectedMenu}
        />

        <main className="admindashboard-content">

        {selectedMenu==="create"&&(
          <>
             <h2 className="section-title">Create  Events</h2>
              {/* create form */}
              <form className="event-form" onSubmit={handleCreate}>
                <input
                  type="text"
                  name="name"
                  placeholder="Event Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />

                <button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Add Event"}
                </button>
                {error && <p className="error">{error}</p>}
              </form>

          </>
        )}



          {selectedMenu === "events" && (
            <>
              <h2 className="section-title">View Events</h2>

             
              {/* list of events */}
              <div className="event-grid">
                {events.map((evt) => (
                  <Event
                    key={evt._id}
                    {...evt}
                    onRegister={handleRegister}
                    showRegisterButton={true}
                    isAdmin={true}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
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

       {showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h3 className="headEntry">Registered Users</h3>

      {loadingAttendees ? (
        <p>Loading...</p>
      ) : attendeeError ? (
        <p style={{color:"black"}}>{attendeeError}</p>
      ) : attendees.length === 0 ? (
        <p className="headEntry">No registrations found.</p>
      ) : (
        <ul>
          {attendees.map((attendee) => (
            <li className="attendee-entry" key={attendee._id}>
            {attendee.user?.username} - {attendee.user?.email}
            </li>
            ))}
        </ul>
      )}

      <button onClick={() => setShowModal(false)} className="close-btn">
        Close
      </button>
    </div>
  </div>
)}


      <Footer />
    </>
  );
}

export default AdminDashboard;





