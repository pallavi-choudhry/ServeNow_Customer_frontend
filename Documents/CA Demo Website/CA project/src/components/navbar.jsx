import React from "react";
// import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/image/main_logo4.jpg"; // Add a logo image in 'src/assets/'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="CA Logo" className="logo" />
        {/* <h1>CA Firm</h1> */}
        </div>
  
      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#about">About Us</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    
    </nav>
    
  );
};

export default Navbar;

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import "./Navbar.css";
// import logo from "../assets/image/logo.png"; 

// const Navbar = () => {
//   return (
//     <nav className="navbar">

//       <div className="logo-container">
//         <img src={logo} alt="CA Logo" className="logo" />
//         {/* <h1>CA Firm</h1> */}
//       </div>
// //       <ul className="nav-list">
// //         <li><NavLink to="/" className="nav-link">Home</NavLink></li>
// //         <li><NavLink to="/services" className="nav-link">Services</NavLink></li>
// //         <li><NavLink to="/about" className="nav-link">About</NavLink></li>
// //         <li><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
// //       </ul>
// //     </nav>
   
//   );
// };

// export default Navbar;

// import React from 'react';
// import "./Navbar.css";
// import { NavLink } from 'react-router-dom';
// import logo from "../assets/image/logo.png"; 

// const Navbar = () => {
//   return (

//     <nav className="navbar">
//        <div className="logo-container">
//         <img src={logo} alt="CA Logo" className="logo" />
//       {/* <h1>CA Firm</h1> */}
//       </div>
  
//     {/* <nav className="navbar"> */}
//       <ul className="nav-list">
//         <li><NavLink to="/" className="nav-link">Home</NavLink></li>
//         <li><NavLink to="/services" className="nav-link">Services</NavLink></li>
//         <li><NavLink to="/about" className="nav-link">About</NavLink></li>
//         <li><NavLink to="/contact" className="nav-link">Contact</NavLink></li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;
