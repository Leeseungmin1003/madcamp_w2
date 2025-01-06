import React from "react";
import Home from "./Home";
import Favorite from "./Favorite";
import Nav from "../components/Nav";

function Combined() {
  return (
    <div>
      <Nav className="Nav" />
      <Home id="home"></Home>
      <Favorite id="favorite" />
    </div>
  );
}

export default Combined;
