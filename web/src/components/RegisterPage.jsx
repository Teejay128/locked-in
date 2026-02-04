import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        
        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
        
        <div className="input-group">
          <input 
            type="email" 
            id="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>
        
        <div className="input-group">
          <input 
            type="password" 
            id="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <input 
            type="password" 
            id="confirmPassword" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;