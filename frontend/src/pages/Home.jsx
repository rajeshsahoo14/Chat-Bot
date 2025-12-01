import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaRobot, FaUserMd, FaShieldAlt, FaLanguage, FaComments, FaChartLine } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <Navbar />
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your AI Health Companion</h1>
          <p className="hero-subtitle">
            Get instant health insights, doctor recommendations, and precautions 
            powered by advanced AI technology
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/chat" className="cta-button primary">
                Start Chatting
              </Link>
            ) : (
              <>
                <Link to="/signup" className="cta-button primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="cta-button secondary">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Our Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaRobot className="feature-icon" />
            <h3>Disease Prediction</h3>
            <p>Describe your symptoms and get possible condition predictions with AI analysis</p>
          </div>
          
          <div className="feature-card">
            <FaUserMd className="feature-icon" />
            <h3>Doctor Suggestions</h3>
            <p>Receive recommendations on which medical specialist to consult</p>
          </div>
          
          <div className="feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>Health Precautions</h3>
            <p>Get personalized health tips and preventive care advice</p>
          </div>
          
          <div className="feature-card">
            <FaLanguage className="feature-icon" />
            <h3>Multi-language Support</h3>
            <p>Available in English, Hindi, and Kannada for your convenience</p>
          </div>

          <div className="feature-card">
            <FaComments className="feature-icon" />
            <h3>24/7 Availability</h3>
            <p>Get instant responses anytime, anywhere, without waiting</p>
          </div>

          <div className="feature-card">
            <FaChartLine className="feature-icon" />
            <h3>Smart Analysis</h3>
            <p>Powered by Google's Gemini AI for accurate health insights</p>
          </div>
        </div>
      </div>

      <div className="how-it-works-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in seconds</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Describe Symptoms</h3>
            <p>Tell us what you're experiencing</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Insights</h3>
            <p>Receive AI-powered health recommendations</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Consult Doctor</h3>
            <p>Use our suggestions to consult the right specialist</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;