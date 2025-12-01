import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaStethoscope, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaStethoscope className="logo-icon" />
          <span>MediCare AI</span>
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <Link to="/chat" className="navbar-link">Chat</Link>
              <div className="navbar-user">
                <FaUser className="user-icon" />
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="navbar-button logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button">Login</Link>
              <Link to="/signup" className="navbar-button signup-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;