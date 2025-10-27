import React, { useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaWallet, FaUserCircle, FaArrowUp, FaArrowDown, FaMoneyBillAlt } from 'react-icons/fa';
import './styles.css'; 
import NavBar from './NavBar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ProfilePage = () => {
  const { user, logout, getUserLoan } = useAuth(); // ✅ ดึง getUserLoan มาใช้
  const navigate = useNavigate();

  // ✅ แก้ไข: ย้าย Hook ขึ้นมาด้านบน
  const sortedTransactions = useMemo(() => {
    if (!user || !user.transactions) return []; 
    
    return [...user.transactions].sort((a, b) => new Date(b.เวลา) - new Date(a.เวลา));
  }, [user]); 
  
  // 💡 Logic สำคัญ: ตรวจสอบสถานะสินเชื่อของผู้ใช้ปัจจุบัน
  const userLoan = useMemo(() => {
      if (!user) return null;
      return getUserLoan(user.username);
  }, [user, getUserLoan]);
  
  // 💡 กำหนดเส้นทาง
  const loanPath = userLoan ? '/loan' : '/apply-loan';

  if (!user) {
    navigate('/login');
    return null; 
  }

  const formatCurrency = (amount) => 
    amount.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 });

  const getTransactionIcon = (type) => {
    if (type === 'Deposit') return <FaArrowUp className="transaction-icon deposit" />;
    if (type === 'Withdrawal') return <FaArrowDown className="transaction-icon withdrawal" />;
    return null;
  };

  const getTransactionClass = (type) => {
    if (type === 'Deposit') return 'transaction-deposit';
    if (type === 'Withdrawal') return 'transaction-withdrawal';
    return '';
  };

  return (
    <>
        <NavBar />
        <motion.div
        className="profile-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        
        <header className="profile-header">
            <h1 className="profile-title">
            <FaUserCircle className="icon-header" />
            บัญชีของคุณ
            </h1>
            <motion.button 
            className="logout-button" 
            onClick={() => {
                logout();
                navigate('/login');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            ออกจากระบบ <FaSignOutAlt />
            </motion.button>
        </header>
        
        <motion.section 
            className="balance-card"
            variants={itemVariants}
        >
            <FaWallet className="balance-icon" />
            <p className="balance-label">ยอดคงเหลือปัจจุบัน</p>
            <p className="balance-value">{formatCurrency(user.balance)}</p>
            <p className="user-info-text">สวัสดีคุณ {user.name} {user.lastname}</p>
        </motion.section>
        
        <motion.section className="quick-actions" variants={itemVariants}>
            <motion.button 
                className="action-button deposit-action" 
                onClick={() => navigate('/deposit')}
                whileHover={{ scale: 1.05 }}
            >
                <FaArrowUp /> ฝากเงิน
            </motion.button>
            <motion.button 
                className="action-button withdraw-action" 
                onClick={() => navigate('/withdraw')}
                whileHover={{ scale: 1.05 }}
            >
                <FaArrowDown /> ถอนเงิน
            </motion.button>
            {/* 💡 ปุ่มสินเชื่อใช้ loanPath ที่คำนวณจากสถานะสินเชื่อ */}
            <motion.button 
                className="action-button loan-action" 
                onClick={() => navigate(loanPath)} 
                whileHover={{ scale: 1.05 }}
            >
                <FaMoneyBillAlt /> สินเชื่อ
            </motion.button>
        </motion.section>

        <motion.section 
            className="profile-info-grid"
            variants={itemVariants}
        >
            <h2 className="section-title">ข้อมูลส่วนตัว</h2>
            <div className="info-item">
            <span className="info-label">ชื่อเต็ม:</span>
            <span className="info-value">{user.name} {user.lastname}</span>
            </div>
            <div className="info-item">
            <span className="info-label">ชื่อผู้ใช้:</span>
            <span className="info-value">{user.username}</span>
            </div>
            <div className="info-item">
            <span className="info-label">อีเมล:</span>
            <span className="info-value">{user.email}</span>
            </div>
        </motion.section>

        <motion.section 
            className="transaction-history"
            variants={itemVariants}
        >
            <h2 className="section-title">รายการธุรกรรม</h2>
            {sortedTransactions.length === 0 ? (
            <p className="no-history-message">ยังไม่มีรายการธุรกรรม</p>
            ) : (
            <div className="table-container">
                <motion.table 
                className="transaction-table"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                >
                <thead>
                    <tr>
                    <th>รหัส</th>
                    <th>เวลา</th>
                    <th>ประเภท</th>
                    <th className="text-right">ยอดฝาก/ถอน</th>
                    <th className="text-right">ยอดคงเหลือ</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTransactions.map((tx) => (
                    <tr key={tx.transactionId} className={getTransactionClass(tx.type)}>
                        <td>{tx.transactionId}</td>
                        <td>{tx.เวลา}</td>
                        <td>
                        {getTransactionIcon(tx.type)}
                        {tx.type === 'Deposit' ? 'ฝาก' : 'ถอน'}
                        </td>
                        <td className="text-right amount-cell">{formatCurrency(tx.ยอดฝากถอน)}</td>
                        <td className="text-right">{formatCurrency(tx.ยอดคงเหลือ)}</td>
                    </tr>
                    ))}
                </tbody>
                </motion.table>
            </div>
            )}
        </motion.section>
        </motion.div>
    </>
  );
};

export default ProfilePage;