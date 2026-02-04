import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const Dashboard = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newEntry, setNewEntry] = useState('');
  const [socialMediaPackage, setSocialMediaPackage] = useState(null);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleNewEntry = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSocialMediaPackage(null);

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newEntry }),
      });

      if (!response.ok) {
        throw new Error('Failed to create a new entry.');
      }

      const data = await response.json();
      setSocialMediaPackage({ summary: data.summary, fullText: data.content });
      setNewEntry('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activeStreakDays = 3;
  const currentStreak = 3;
  const longestStreak = 10;
  const totalEntries = 50;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>"The only way to do great work is to love what you do."</h1>
        <p>Welcome, {user.displayName || user.email}!</p>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: 'center', width: '100%', marginTop: '1rem' }}>
          <Link to="/profile" className="btn">Profile</Link>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <section className="calendar-section">
        <h2>This Week's Progress</h2>
        <div className="calendar">
          {weekDays.map((day, index) => (
            <div key={day} className={`day ${index < activeStreakDays ? 'active' : ''}`}>
              {day}
            </div>
          ))}
        </div>
        <p>Current Streak: {currentStreak} days</p>
      </section>

      <section className="new-entry-section">
        <h2>New Journal Entry</h2>
        <form onSubmit={handleNewEntry}>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Entry'}
          </button>
        </form>
        {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
        {socialMediaPackage && (
          <div className="social-media-package" style={{marginTop: '1rem'}}>
            <h3>Your Social Media Post Preview</h3>
            <div className="post-preview" title={socialMediaPackage.fullText} style={{border: '1px solid #ccc', padding: '10px', borderRadius: '5px', background: '#f9f9f9', cursor: 'pointer'}}>
              <p>{socialMediaPackage.summary}</p>
            </div>
          </div>
        )}
      </section>

      <section className="history-section">
        <h2>History</h2>
        <div className="streak-history">
          <p>Longest Streak: {longestStreak} days</p>
          <p>Total Entries: {totalEntries}</p>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
