import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
// ⚠️ ต้อง import useNavigate เข้ามาด้วย
import { useNavigate } from 'react-router-dom'; 
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './styles.css'; 
import NavBar from './NavBar';

const WithdrawalPage = () => {
  const { user, withdraw } = useAuth();
  const navigate = useNavigate(); // 👈 ประกาศใช้ useNavigate
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setIsProcessing(true);

    // ... (การตรวจสอบ PIN, จำนวนเงิน, ยอดคงเหลือเดิม) ...
    if (pin !== user.pin) {
      setStatus({ type: 'error', message: 'รหัส PIN ไม่ถูกต้อง' });
      setIsProcessing(false);
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setStatus({ type: 'error', message: 'กรุณาใส่จำนวนเงินที่ถูกต้อง' });
      setIsProcessing(false);
      return;
    }
    
    if (withdrawAmount > user.balance) {
        setStatus({ type: 'error', message: `ยอดเงินคงเหลือไม่พอ (${user.balance.toLocaleString()} บาท)` });
        setIsProcessing(false);
        return;
    }

    // 3. ทำธุรกรรม
    setTimeout(() => { // จำลองการรอ API
      const result = withdraw(withdrawAmount);
      
      if (result.success) {
        setStatus({ type: 'success', message: `ถอนเงินสำเร็จ! ยอดคงเหลือใหม่: ${result.newBalance.toLocaleString()} บาท` });
        setAmount('');
        setPin('');
        
        // 🚀 เพิ่มโค้ดส่วนนี้เพื่อเปลี่ยนหน้าไป Profile
        setTimeout(() => {
            navigate('/profile'); 
        }, 1000); // หน่วงเวลา 1 วินาที ให้ผู้ใช้เห็นข้อความแจ้งเตือน
        
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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        >
        <form onSubmit={handleSubmit} className="transaction-form">
            <h2><FaMoneyBillWave /> ถอนเงิน</h2>

            {/* Balance Display */}
            <motion.div 
                className="current-balance-display withdrawal-color"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                ยอดคงเหลือ: {user.balance.toLocaleString()} บาท
            </motion.div>
            

            {/* Amount Input */}
            <div className="input-group">
            <input
                type="number"
                placeholder="จำนวนเงินที่ต้องการถอน (บาท)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                disabled={isProcessing}
            />
            </div>
            
            {/* PIN Input */}
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

            {/* Status Message (Animation) */}
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

            {/* Submit Button (Animation) */}
            <motion.button 
            type="submit" 
            className="transaction-button withdrawal-btn"
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
                `ถอนเงินออกจากบัญชี`
            )}
            </motion.button>
        </form>
        </motion.div>
    </>
  );
};

export default WithdrawalPage;