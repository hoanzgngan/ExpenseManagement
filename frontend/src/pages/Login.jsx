import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { MdEmail, MdLock, MdPerson, MdVisibilityOff, MdVisibility } from 'react-icons/md';

const API_URL = 'http://localhost:3000/auth';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle login input
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  // Handle signup input
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData(prev => ({ ...prev, [name]: value }));
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      setMessage('Vui lòng nhập email và mật khẩu');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ Đăng nhập thành công!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage('✗ ' + (data.message || 'Đăng nhập thất bại'));
      }
    } catch (error) {
      setMessage('✗ Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submit
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (!signUpData.fullName || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setMessage('Vui lòng điền tất cả các trường');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setMessage('✗ Mật khẩu không khớp');
      return;
    }

    if (signUpData.password.length < 6) {
      setMessage('✗ Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: signUpData.fullName,
          email: signUpData.email,
          password: signUpData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ Đăng ký thành công! Vui lòng đăng nhập');
        setSignUpData({ fullName: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          setIsSignUp(false);
        }, 1500);
      } else {
        setMessage('✗ ' + (data.message || 'Đăng ký thất bại'));
      }
    } catch (error) {
      setMessage('✗ Lỗi kết nối: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`}>
      
      {/* Message Alert */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 24px',
          backgroundColor: message.includes('✓') ? '#4CAF50' : '#f44336',
          color: 'white',
          borderRadius: '5px',
          zIndex: 1000,
          maxWidth: '90%',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}
      
      {/* FORM ĐĂNG KÝ */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Đăng ký</h1>
          <span className="subtitle">Tạo tài khoản mới của bạn</span>
          
          <div className="input-group">
            <MdPerson className="input-icon" />
            <input 
              type="text" 
              name="fullName"
              placeholder="Họ và tên" 
              value={signUpData.fullName}
              onChange={handleSignUpChange}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <MdEmail className="input-icon" />
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={signUpData.email}
              onChange={handleSignUpChange}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <MdLock className="input-icon" />
            <input 
              type={showPasswordSignUp ? "text" : "password"} 
              name="password"
              placeholder="Mật khẩu" 
              value={signUpData.password}
              onChange={handleSignUpChange}
              disabled={loading}
            />
            <span 
              className="input-icon-right cursor-pointer" 
              onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
            >
              {showPasswordSignUp ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>

          <div className="input-group">
            <MdLock className="input-icon" />
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu" 
              value={signUpData.confirmPassword}
              onChange={handleSignUpChange}
              disabled={loading}
            />
            <span 
              className="input-icon-right cursor-pointer" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>

          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
          
          <div className="divider">
            <span>hoặc</span>
          </div>

          <div className="social-container">
            <a href="#" className="social-icon google"><FaGoogle /></a>
            <a href="#" className="social-icon facebook"><FaFacebookF /></a>
          </div>
        </form>
      </div>

      {/* FORM ĐĂNG NHẬP */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLoginSubmit}>
          <h1>Đăng nhập</h1>
          <span className="subtitle">Chào mừng bạn quay trở lại!</span>
          
          <div className="input-group">
            <MdEmail className="input-icon" />
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={loginData.email}
              onChange={handleLoginChange}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <MdLock className="input-icon" />
            <input 
              type={showPasswordSignIn ? "text" : "password"} 
              name="password"
              placeholder="Mật khẩu" 
              value={loginData.password}
              onChange={handleLoginChange}
              disabled={loading}
            />
            <span 
              className="input-icon-right cursor-pointer" 
              onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
            >
              {showPasswordSignIn ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>
          
          <a href="#" className="forgot-pass">Quên mật khẩu?</a>
          
          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>

          <div className="divider">
            <span>hoặc</span>
          </div>
          
          <div className="social-container">
            <a href="#" className="social-icon google"><FaGoogle /></a>
            <a href="#" className="social-icon facebook"><FaFacebookF /></a>
          </div>
        </form>
      </div>

      {/* OVERLAY */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Xin chào!</h1>
            <p>Đã có tài khoản? Đăng nhập để tiếp tục quản lí money của bạn nào</p>
            <button type="button" className="ghost" onClick={() => setIsSignUp(false)}>Đăng nhập</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Chào mừng trở lại!</h1>
            <p>Chưa có tài khoản? Đăng ký ngay để quản lí tài chính của mình</p>
            <button type="button" className="ghost" onClick={() => setIsSignUp(true)}>Đăng ký</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;