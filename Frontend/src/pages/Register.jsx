import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css" ;

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed";
      setError(msg);
    }
  };

  return (
    <div className="reg-page">
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          pattern="^[^@\s]+@[^@\s]+\.com$"
          value={formData.email}
          placeholder="Email(abc@example.com)"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
           pattern="^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{5,}$"
          title="Password must be at least 5 characters, include 1 uppercase letter and 1 special character"
          required
        />
        <button type="submit" className="register-btn">
          Create Account
        </button>
        {error && <p className="register-error">{error}</p>}
      </form>
    </div>
    </div>
  );
}

export default Register;




// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const [formData, setFormData] = useState({
//   username: "",
//   fullname: "",
//   email: "",
//   password: "",
// });
 

//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//     setError(""); // Clear error on change
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("http://localhost:3000/api/v1/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       // Redirect to login on success
//       navigate("/login");
//     } catch (err) {
//         console.log("💥 Full error response:", err.response?.data);
//   console.error("Registration error:", err.response?.data || err.message);

//   const msg =
//     err.response?.data?.error ||     // for ApiError like "User already exists"
//     err.response?.data?.message ||   // for other general messages
//     err.message ||                   // fallback for axios/network errors
//     "Registration failed";           // default fallback

//   setError(msg); // Show the actual reason
// }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Register</h2>

//       <form onSubmit={handleSubmit} style={styles.form}>
//         <input
//   type="text"
//   name="username"
//   placeholder="Username"
//   onChange={handleChange}
//   required
//   className="w-full mb-3 p-2 border border-gray-300 rounded"
// />

// <input
//   type="text"
//   name="fullname"
//   placeholder="Full Name"
//   onChange={handleChange}
//   required
//   className="w-full mb-3 p-2 border border-gray-300 rounded"
// />

// <input
//   type="email"
//   name="email"
//   placeholder="Email"
//   onChange={handleChange}
//   required
//   className="w-full mb-3 p-2 border border-gray-300 rounded"
// />

// <input
//   type="password"
//   name="password"
//   placeholder="Password"
//   onChange={handleChange}
//   required
//   className="w-full mb-3 p-2 border border-gray-300 rounded"
// />

//         <button type="submit" style={styles.button}>
//           Create Account
//         </button>
//         {error && <p style={styles.error}>{error}</p>}
//       </form>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     maxWidth: "400px",
//     margin: "auto",
//     paddingTop: "80px",
//     textAlign: "center",
//   },
//   title: {
//     fontSize: "2rem",
//     marginBottom: "20px",
//     color: "#ff6666",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "1rem",
//   },
//   input: {
//     padding: "10px",
//     fontSize: "1rem",
//     borderRadius: "8px",
//     border: "1px solid #ccc",
//   },
//   button: {
//     backgroundColor: "#ff6666",
//     color: "#fff",
//     padding: "10px",
//     fontSize: "1rem",
//     borderRadius: "8px",
//     border: "none",
//     cursor: "pointer",
//   },
//   error: {
//     color: "red",
//     fontSize: "0.9rem",
//     marginTop: "10px",
//   },
// };

// export default Register;
