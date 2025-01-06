import React from "react";
import { ReactComponent as Logo } from "../assets/logo/logo.svg";
import "../components/nav.css";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function Nav() {
  return (
    <nav className="nav">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="nav-elements">
          <ul>
            <li>
              <HashLink smooth to="#home">
                Home
              </HashLink>
            </li>
            <li>
              <HashLink smooth to="#favorite">
                Favorite
              </HashLink>
            </li>
            <li>
              <HashLink smooth to="#my-channel">
                My Channel
              </HashLink>
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
