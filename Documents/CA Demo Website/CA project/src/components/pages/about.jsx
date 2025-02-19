import React from "react";
import "./about.css";
import aboutImage from "../Image/About-us.jpg"; // Add your image in the images folder

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>
        <div className="about-description">
          <h1>About Us</h1>
          <p>
            We are a leading financial and tax consultancy firm committed to delivering top-notch services to our clients. 
            Our team of experienced professionals provides comprehensive financial solutions, including tax planning, business advisory, 
            and financial reporting, ensuring that our clients achieve their business goals efficiently and effectively.
          </p>
          <p>
            At our firm, we value integrity, excellence, and client satisfaction, making us the preferred choice for businesses 
            seeking reliable financial consultancy services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
