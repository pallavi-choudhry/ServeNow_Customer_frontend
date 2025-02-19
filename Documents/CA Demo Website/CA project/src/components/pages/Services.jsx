import React from "react";
import services1 from "../Image/service_image1.jpg"
import services2 from "../Image/service_image2.jpg"
import services3 from "../Image/service_image3.jpg"
import services4 from "../Image/service_image4.jpg"
// import services5 from "../Image/service_image2.jpg"
import "./services.css"


const serviceList = [
  {
    title: "Accounting and Financial Reporting",
    description: "Prepare financial records and statements according to GAAP/IFRS standards.",
    image: services1
  },
  {
    title: "Auditing",
    description: "Verify financial statements and internal controls for accuracy and compliance.",
    image: services2 
  },
  {
    title: "Taxation",
    description: "Provide tax planning, preparation and compliance services for all tax categories.",
    image: services3
  },

  {
    title: "Financial Advisory",
    description: "Guide financial planning, investments, valuations, and risk management.",
    image: services4
  },

  //
  {
    title: "GST Services",
    description: "Manage GST compliance, filing, and strategic optimization for businesses.",
    image: services4
  },

  
];

const Services = () => {
  return (
    <div className="services-container">
      <h1>Our Services</h1>
      <p>We offer a wide range of financial and tax consultancy services.</p>
      <div className="services-grid">
        {serviceList.map((service, index) => (
          <div key={index} className="service-card">
      
           {<img 
              src={service.image } 
              alt={service.title} 
              style={{width : "100px, border-radius: 4px"}
            }
            />}
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;


