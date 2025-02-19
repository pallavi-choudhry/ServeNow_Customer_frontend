import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Home from "./components/pages/home";
import Services from "./components/pages/Services";
import About from "./components/pages/about";
import Contact from "./components/contact";
import Footer from "./components/footer";


const App = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(false);

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const homeSection = document.getElementById('home');
      const footerSection = document.getElementById('footer');
      const homeHeight = homeSection.clientHeight;
      const footerTop = footerSection.offsetTop;

      // Show navbar when at home; hide when scrolling down
      setShowNavbar(window.scrollY < homeHeight);

      // Show footer when near the footer section
      setShowFooter(window.scrollY >= footerTop - window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      {/* Conditional Navbar */}
      {showNavbar && <Navbar />}

      {/* Page Sections */}
      <section id="home" className="section">
        <Home />
      </section>

      <section id="services" className="section">
        <Services />
      </section>

      <section id="about" className="section">
        <About />
      </section>

      <section id="contact" className="section">
        <Contact />
      </section>

      {/* Footer only shows when scrolled to footer section */}
      <section id="footer" className="section">
        {showFooter && <Footer />}
      </section>
    </div>
  );
};

export default App;
