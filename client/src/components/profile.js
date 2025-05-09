import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile({user,setUser}) {
  

  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user); // Store the user data in the state
      })
      .catch((error) => {
        console.error(error);
        setUser(null); // Set user to null if not logged in
      });
  }, []);

  console.log("this is user: "+ user);

  const handleLogout = async () => {
    await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
    setUser(null); // Reset the user state after logout
    alert("Logged out");
  };

  return (
    <div>
      <h2>Profile</h2>
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
