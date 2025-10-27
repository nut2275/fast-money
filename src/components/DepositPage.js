import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 👈 ต้อง import
import { FaMoneyBillAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './styles.css'; 
import NavBar from './NavBar';

const DepositPage = () => {
  const { user, deposit } = useAuth();
  const navigate = useNavigate(); // 👈 ต้องเรียกใช้
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setIsProcessing(true);
    
    if (pin !== user.pin) {
      setStatus({ type: 'error', message: 'รหัส PIN ไม่ถูกต้อง' });
      setIsProcessing(false);
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setStatus({ type: 'error', message: 'กรุณาใส่จำนวนเงินที่ถูกต้อง' });
      setIsProcessing(false);
      return;
    }

    setTimeout(() => { 
      const result = deposit(depositAmount);
      
      if (result.success) {
        setStatus({ type: 'success', message: `ฝากเงินสำเร็จ! ยอดคงเหลือใหม่: ${result.newBalance.toLocaleString()} บาท` });
        setAmount('');
        setPin('');
        
        // ✅ โค้ดที่เพิ่ม: เปลี่ยนหน้าไป Profile
        setTimeout(() => {
            navigate('/profile'); 
        }, 1000); 
        
      } else {
        setStatus({ type: 'error', message: result.message });
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <>
        <NavBar />
        <motion.div
        className="transaction-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
        
        <form onSubmit={handleSubmit} className="transaction-form">
            <h2><FaMoneyBillAlt /> ฝากเงิน</h2>
            
            <motion.div 
                className="current-balance-display deposit-color"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                ยอดคงเหลือ: {user.balance.toLocaleString()} บาท
            </motion.div>

            <div className="input-group">
            <input
                type="number"
                placeholder="จำนวนเงินที่ต้องการฝาก (บาท)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                disabled={isProcessing}
            />
            </div>
            
            <div className="input-group">
            <input
                type="password"
                placeholder="รหัส PIN 4 หลัก"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength="4"
                required
                disabled={isProcessing}
            />
            </div>

            {status.type && (
            <motion.p 
                className={`status-message ${status.type}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
            >
                {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
                {status.message}
            </motion.p>
            )}

            <motion.button 
            type="submit" 
            className="transaction-button deposit-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={isProcessing}
            >
            {isProcessing ? (
                <motion.span 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    ⚙️
                </motion.span>
            ) : (
                `ฝากเงินเข้าบัญชี`
            )}
            </motion.button>
        </form>
        </motion.div>
    </>
  );
};

export default DepositPage;