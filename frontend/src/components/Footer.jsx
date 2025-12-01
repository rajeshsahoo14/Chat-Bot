import React from 'react';
import { FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>
          Made with <FaHeart className="heart-icon" /> by MediCare AI Team
        </p>
        <p className="footer-disclaimer">
          Disclaimer: This chatbot provides general health information only. 
          Always consult a qualified healthcare professional for medical advice.
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} MediCare AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;