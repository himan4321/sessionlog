import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile({ user, setUser }) {
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profile", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setError("Failed to fetch profile");
        setUser(null);
      }
    };

    checkSession();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setUser(null);
      alert("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout");
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {error && <div className="error-message">{error}</div>}
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}

export default Profile;
