import React from "react";
import Home from "./Home";
import Menu1 from "./Menu1";
import Nav from "../components/Nav";
import { Routes, Route } from "react-router-dom";

function Combined() {
  return (
    <div>
      <Nav className="Nav" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu1" element={<Menu1 />} />
      </Routes>
    </div>
  );
}

export default Combined;
