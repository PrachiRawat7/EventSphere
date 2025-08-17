import React from "react";
import QRCode from "react-qr-code";;  // Make sure to install this: npm install qrcode.react
import "./Ticket.css";

function Ticket({ ticket }) {
  const { qrCode, event } = ticket; 
  // event assumed to have fields: name, date, eimage (like your event model)

  return (
    <div className="ticket-card">
      <img src={event.eimage} alt={event.name} className="ticket-event-image" />
      <h3 className="ticket-event-name">{event.name}</h3>
      <p className="ticket-event-date">{new Date(event.date).toLocaleDateString()}</p>
      <div style={{ background: 'white', padding: '16px' }}>
      <QRCode value={qrCode} size={128} />
      </div>
    </div>
  );
}

export default Ticket;
