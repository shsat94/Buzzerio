import React, { useState } from "react";
import logo from '../assests/logo.png';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");

  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="Logo" style={{ height: '4rem' }} />
      </div>
      <div className="middle">
        <ul>
          <li>
            <Link
              className={activeLink === "home" ? "active" : ""}
              onClick={() => setActiveLink("home")} to="/home"
            >HOME</Link>
          </li>
          <li>
          <Link
            className={activeLink === "about" ? "active" : ""}
            onClick={() => setActiveLink("about")} to="/aboutus"
          >
            ABOUT US
          </Link>
          </li>
          <li>
          <Link
            className={activeLink === "contact" ? "active" : ""}
            onClick={() => setActiveLink("contact")} to="/contactus"
          >
            CONTACT US
          </Link>
          </li>
        </ul>
      </div>
      <div className="auth">
        <ul>
          <li>
    LOGIN
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
