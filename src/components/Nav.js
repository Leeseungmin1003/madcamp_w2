import React from "react";
import { ReactComponent as Logo } from "../assets/logo/logo.svg";
import "../components/nav.css";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Navigation Elements */}
        <div className="nav-elements">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu1">Menu1</Link>
            </li>
            <li>
              <a href="#menu2">Menu2</a>
            </li>

            <li className="login-button-nav">
              <Link to="/Login">
                <button>로그인</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
