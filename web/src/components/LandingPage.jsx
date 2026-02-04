import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="header">
        <h1>Locked-In</h1>
        <p>You just need to lock in</p>
      </header>
      <main className="main-content">
        <div className="quote-container">
          <p className="quote">"The only way to do great work is to love what you do."</p>
          <p className="author">- Steve Jobs</p>
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-primary">Sign In</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
        <div className="quick-tools-section">
          <p>Or test out our features directly, without registration</p>
          <button className='btn btn-primary'>
            <Link to="/quick-tools" className="btn btn-primary">Try it out!</Link>
          </button>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Locked-In. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
