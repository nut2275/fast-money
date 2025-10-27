import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import './styles.css'; // นำเข้า CSS ที่จะสร้างในส่วนที่ 5

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>เข้าสู่ระบบ <FaSignInAlt className="icon-title" /></h2>
        
        {error && <motion.p 
          className="error-message"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >{error}</motion.p>}

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <motion.button 
          type="submit" 
          className="auth-button primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          เข้าสู่ระบบ
        </motion.button>

        <p className="form-link">
          ยังไม่มีบัญชี? <span onClick={() => navigate('/register')}>ลงทะเบียนที่นี่</span>
        </p>
      </form>
    </motion.div>
  );
};

export default LoginPage;