import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL

function QuickTools() {
  const [content, setContent] = useState('');
  const [socialPackage, setSocialPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSocialPackage(null);

    try {
      const response = await fetch(`${apiUrl}/tools/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();
      if (data.success) {
        setSocialPackage(data.social);
      } else {
        throw new Error(data.error || 'Failed to generate social content.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quick-tools-page">
      <h1>Quick Tools</h1>
      <p>Enter a piece of text and let AI create social media posts for you.</p>

      <div className="quick-tools-container">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              rows="5"
              cols="60"
              maxLength="500"
            />
            <br />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Social Posts'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {socialPackage && (
          <div className="social-section">
            <h2>Your Social Media Drafts</h2>
            <div className="social-card">
              <h3>Twitter</h3>
              <p>{socialPackage.twitter.text}</p>
              <a href={socialPackage.twitter.link} target="_blank" rel="noopener noreferrer">Post on Twitter</a>
            </div>
            <div className="social-card">
              <h3>LinkedIn</h3>
              <p>{socialPackage.linkedin.text}</p>
              <a href={socialPackage.linkedin.link} target="_blank" rel="noopener noreferrer">Post on LinkedIn</a>
            </div>
          </div>
        )}
      </div>

      <div className="back-link-container">
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
}

export default QuickTools;
