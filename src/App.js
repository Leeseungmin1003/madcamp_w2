import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import Combined from "./Page/Combined";
import Login from "./Page/Login";
import Signup from "./Page/Signup";

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Combined />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
