import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login3D.css'; // Using the same CSS file

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Mouse move effect for 3D parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      
      // Success animation
      const card = cardRef.current;
      card.classList.add('success-animation');
      setTimeout(() => {
        alert('✅ Registered successfully!');
        navigate('/login');
      }, 1000);
      
    } catch (err) {
      // Error animation
      const card = cardRef.current;
      card.classList.add('error-shake');
      setTimeout(() => card.classList.remove('error-shake'), 500);
      alert(err.response?.data?.message || 'Error registering');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate 3D transform based on mouse position
  const cardStyle = {
    transform: `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${mousePosition.y * -10}deg)`
  };

  return (
    <div className="login3d-container">
      {/* Animated Background */}
      <div className="bg-cubes">
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles-3d">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle-3d" style={{
            '--i': i,
            '--delay': Math.random() * 5 + 's'
          }}></div>
        ))}
      </div>

      {/* Main 3D Card */}
      <div 
        ref={cardRef}
        className="login3d-card" 
        style={cardStyle}
      >
        {/* 3D Header with Animated Text */}
        <div className="card3d-header">
          <div className="logo-3d-spin">
            <div className="sphere">
              <div className="ring"></div>
              <div className="ring"></div>
              <div className="ring"></div>
            </div>
          </div>
          <h1 className="title-3d">
            <span className="title-char" style={{ '--char-index': 0 }}>C</span>
            <span className="title-char" style={{ '--char-index': 1 }}>R</span>
            <span className="title-char" style={{ '--char-index': 2 }}>E</span>
            <span className="title-char" style={{ '--char-index': 3 }}>A</span>
            <span className="title-char" style={{ '--char-index': 4 }}>T</span>
            <span className="title-char" style={{ '--char-index': 5 }}>E</span>
          </h1>
          <p className="subtitle-3d">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="login3d-form">
          {/* Name Input */}
          <div className="input3d-group">
            <div className="input3d-container">
              <input 
                type="text" 
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="input3d-field"
              />
              <label className="input3d-label">Full Name</label>
              <div className="input3d-glow"></div>
            </div>
          </div>

          {/* Email Input */}
          <div className="input3d-group">
            <div className="input3d-container">
              <input 
                type="email" 
                required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="input3d-field"
              />
              <label className="input3d-label">Email Address</label>
              <div className="input3d-glow"></div>
            </div>
          </div>

          {/* Password Input */}
          <div className="input3d-group">
            <div className="input3d-container">
              <input 
                type="password" 
                required
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="input3d-field"
              />
              <label className="input3d-label">Password</label>
              <div className="input3d-glow"></div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="form-options-3d">
            <label className="checkbox3d-container">
              <input type="checkbox" required />
              <span className="checkmark3d"></span>
              I agree to the Terms & Conditions
            </label>
          </div>

          {/* 3D Animated Button */}
          <button 
            type="submit" 
            className={`btn3d ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="btn3d-text">
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </span>
            <div className="btn3d-glow"></div>
            <div className="btn3d-hover"></div>
          </button>
        </form>

        {/* 3D Login Link */}
        <div className="register3d-section">
          <p className="register3d-text">
            Already have an account?{' '}
            <span 
              className="register3d-link" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </span>
          </p>
        </div>

        {/* Quick Info */}
        <div className="quick-info-3d">
          <div className="info-item">
            <span className="info-icon">⚡</span>
            <span className="info-text">Fast Registration</span>
          </div>
          <div className="info-item">
            <span className="info-icon">🔒</span>
            <span className="info-text">Secure & Private</span>
          </div>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="corner-deco corner-tl"></div>
      <div className="corner-deco corner-tr"></div>
      <div className="corner-deco corner-bl"></div>
      <div className="corner-deco corner-br"></div>
    </div>
  );
}

export default Register;