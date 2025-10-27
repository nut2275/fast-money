import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaEnvelope, FaIdCard, FaLock, FaKey } from 'react-icons/fa';
import './styles.css'; 

//{dataUser}
const RegisterPage = () => {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(form);
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="auth-form register-form">
        <h2>ลงทะเบียน <FaUserPlus className="icon-title" /></h2>

        {message && <motion.p 
          className="success-message"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >{message}</motion.p>}

        {/* Input fields for registration */}
        <div className="input-group"><FaUserPlus className="input-icon" /><input name="username" type="text" placeholder="ชื่อผู้ใช้" onChange={handleChange} required /></div>
        <div className="input-group"><FaLock className="input-icon" /><input name="password" type="password" placeholder="รหัสผ่าน" onChange={handleChange} required /></div>
        <div className="input-group"><FaEnvelope className="input-icon" /><input name="email" type="email" placeholder="อีเมล" onChange={handleChange} required /></div>
        <div className="input-group"><FaIdCard className="input-icon" /><input name="name" type="text" placeholder="ชื่อ (Alice)" onChange={handleChange} required /></div>
        <div className="input-group"><FaIdCard className="input-icon" /><input name="lastname" type="text" placeholder="นามสกุล (Smith)" onChange={handleChange} required /></div>
        <div className="input-group"><FaKey className="input-icon" /><input name="pin" type="text" placeholder="รหัส PIN (4 หลัก)" onChange={handleChange} maxLength="4" required /></div>
        {/* Simplified for demo. In production, use separate fields for name/lastname */}

        <motion.button 
          type="submit" 
          className="auth-button secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ยืนยันการลงทะเบียน
        </motion.button>

        <p className="form-link">
          มีบัญชีอยู่แล้ว? <span onClick={() => navigate('/login')}>เข้าสู่ระบบ</span>
        </p>
      </form>
    </motion.div>
  );
};

export default RegisterPage;