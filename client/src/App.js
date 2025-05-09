import React,{useState,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/signup";
import Login from "./components/login";
import Profile from "./components/profile";
import "./App.css"; // Import CSS file

function App() {

  const [user, setUser] = useState(null);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      <div className="container">
        <div className="card">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login user={user} setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
