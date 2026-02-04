import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div className="back-link-container">
        <Link to="/">Go to Homepage</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
