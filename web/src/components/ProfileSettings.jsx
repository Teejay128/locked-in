import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const apiUrl = import.meta.env.VITE_API_URL

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const RegenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

const ProfileSettings = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log(userData)
            setUser(userData);
            setUsername(userData.username || '');
            setBio(userData.bio || '');
            setApiKey(userData.apiKey || '');
          } else {
            setError('User data not found.');
          }
        }
      } catch (err) {
        setError('Failed to fetch user data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          username,
          bio,
        });
        alert('Profile updated successfully!');
      }
    } catch (err) {
      setError('Failed to save changes.');
      console.error(err);
    }
  };

  const handleRegenerateApiKey = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        const response = await fetch(`${apiUrl}/auth/generate-key`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setApiKey(data.apiKey);
          alert('API key regenerated successfully!');
        } else {
          throw new Error('Failed to regenerate API key.');
        }
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={user?.email || ''} disabled />
      </div>
      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
      </div>
      <div className="api-key-section">
        <h3>API Key</h3>
        <div className="api-key-wrapper">
          <pre>
            <code>{apiKey ? apiKey.slice(0, 8) + "..." + apiKey.slice(-8) : ''}</code>
          </pre>
          <div style={{display: "flex"}}>
            <button className="btn-icon" onClick={copyToClipboard}>
              {copied ? 'Copied!' : <CopyIcon />}
            </button>
            <button className="btn-icon" onClick={handleRegenerateApiKey}><RegenerateIcon/></button>
            </div>
        </div>
      </div>
      <button onClick={handleSaveChanges} className="save-changes-btn">
        Save Changes
      </button>
    </div>
  );
};

export default ProfileSettings;
