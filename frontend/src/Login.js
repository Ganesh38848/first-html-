import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login3D.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      
      // Success animation
      const card = cardRef.current;
      card.classList.add('success-animation');
      setTimeout(() => {
        alert('✅ Login Successful');
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      // Error animation
      const card = cardRef.current;
      card.classList.add('error-shake');
      setTimeout(() => card.classList.remove('error-shake'), 500);
      alert(err.response?.data?.message || 'Login failed');
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
            <span className="title-char">W</span>
            <span className="title-char">E</span>
            <span className="title-char">L</span>
            <span className="title-char">C</span>
            <span className="title-char">O</span>
            <span className="title-char">M</span>
            <span className="title-char">E</span>
          </h1>
          <p className="subtitle-3d">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login3d-form">
          {/* 3D Input Fields */}
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

          {/* 3D Animated Button */}
          <button 
            type="submit" 
            className={`btn3d ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            <span className="btn3d-text">
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </span>
            <div className="btn3d-glow"></div>
            <div className="btn3d-hover"></div>
          </button>
        </form>

        {/* 3D Register Link */}
        <div className="register3d-section">
          <p className="register3d-text">
            New here?{' '}
            <span 
              className="register3d-link" 
              onClick={() => navigate('/register')}
            >
              Create Account
            </span>
          </p>
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

export default Login;