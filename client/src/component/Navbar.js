import React, { useState } from "react";
import logo from '../assests/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  let navigate=useNavigate();
  const handleLogin=(e)=>{
    e.preventDefault();
    navigate('/login');
  }
  const handleprofileClick=(e)=>{
    e.preventDefault();
    navigate('/profile');
  }

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
              onClick={() => setActiveLink("home")} to="/"
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
          <li>
          <Link
            className={activeLink === "avialableroom" ? "active" : ""}
            onClick={() => setActiveLink("avialableroom")} to="/avialableroom"
          >
            ROOM
          </Link>
          </li>
        </ul>
      </div>
      <div className="auth">
        <ul>
          {localStorage.getItem('token')===null?<li onClick={handleLogin} style={{cursor:'pointer'}}>
    LOGIN
          </li>:<span onClick={handleprofileClick} style={{cursor:'pointer'}} className="material-symbols-outlined">
person
</span>}
          
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
