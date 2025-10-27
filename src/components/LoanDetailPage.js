


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext'; 
import { useNavigate } from 'react-router-dom'; 
import { FaCalendarAlt, FaMoneyBillWave, FaPercentage, FaClock, FaCheckCircle, FaExclamationCircle, FaDollarSign } from 'react-icons/fa';
import './styles.css'; 
import NavBar from './NavBar';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


// Component ย่อยสำหรับแสดงประวัติการชำระ
const PaymentHistoryTable = motion(({ history }) => {
  if (!history || history.length === 0) {
    return <p className="no-history-message">ยังไม่มีประวัติการชำระเงิน</p>;
  }
  const sortedHistory = [...history].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

  return (
    <>
        <NavBar />
        <div className="table-container loan-table">
        <motion.table 
            className="payment-history-table"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            
            <thead>
            <tr>
                <th>วันที่ชำระ</th>
                <th>ยอดที่ชำระ (บาท)</th>
                <th>เงินต้นคงเหลือ (บาท)</th>
            </tr>
            </thead>
            <tbody>
            {sortedHistory.map((payment, index) => (
                <tr key={index}>
                <td>{new Date(payment.paymentDate).toLocaleDateString('th-TH')}</td>
                <td className="text-right">{payment.paidAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                <td className="text-right">{payment.remainingBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                </tr>
            ))}
            </tbody>
        </motion.table>
        </div>
    </>
  );
}, { forwardMotionProps: true });


const LoanDetailPage = () => { 
  const { user, getUserLoan } = useAuth();
  const navigate = useNavigate();
  
  const loanData = useMemo(() => {
    if (!user) return null;
    return getUserLoan(user.username);
  }, [user, getUserLoan]);
  
  if (!loanData) {
      // 💡 นำทางไปยังหน้าสมัครสินเชื่อ (ใน Flow การทำงานจริง) หรือแสดงข้อความ Error
      return (
        <>
            <NavBar />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="loan-detail-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h2 className="section-title">ไม่พบข้อมูลสินเชื่อสำหรับผู้ใช้ {user ? user.username : 'นี้'}</h2>
            <p>คุณยังไม่มีสินเชื่อที่ใช้งานอยู่ กรุณา <span style={{color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => navigate('/apply-loan')}>ยื่นคำขอสินเชื่อที่นี่</span></p>
            </motion.div>
        </>
      );
  }

  const { status, amount, monthlyPayment, dueDate, interestRate, termMonths, startDate, currentBalance } = loanData;

  const getStatusIcon = (status) => {
    if (status === 'Active') return <FaCheckCircle className="status-icon active" />;
    return <FaExclamationCircle className="status-icon warning" />;
  };

  const formatCurrency = (amount) => 
    amount.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 2 });

  return (
    <>
        <NavBar />
        <motion.div
        className="loan-detail-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >
        <motion.header className="loan-detail-header" variants={itemVariants}>
            <h1 className="loan-title">สินเชื่อส่วนบุคคล <span className="loan-id">#{loanData.loanId}</span></h1>
            <div className={`loan-status status-${status.toLowerCase()}`}>
            {getStatusIcon(status)}
            <span>{status === 'Active' ? 'ใช้งานอยู่' : status}</span>
            </div>
        </motion.header>

        {/* Summary Cards */}
        <motion.section className="loan-summary-cards" variants={itemVariants}>
            <motion.div className="summary-card primary" whileHover={{ y: -5, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
            <FaMoneyBillWave className="card-icon" />
            <p className="card-label">วงเงินกู้</p>
            <p className="card-value">{formatCurrency(amount)}</p>
            </motion.div>
            <motion.div className="summary-card secondary" whileHover={{ y: -5, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
            <FaCalendarAlt className="card-icon" />
            <p className="card-label">ชำระรายเดือน</p>
            <p className="card-value">{formatCurrency(monthlyPayment)}</p>
            </motion.div>
            <motion.div className="summary-card info" whileHover={{ y: -5, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
            <FaDollarSign className="card-icon" />
            <p className="card-label">เงินต้นคงเหลือ</p>
            <p className="card-value">{formatCurrency(currentBalance)}</p>
            </motion.div>
            <motion.div className="summary-card tertiary" whileHover={{ y: -5, boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)" }}>
            <FaCalendarAlt className="card-icon" />
            <p className="card-label">ครบกำหนดงวดถัดไป</p>
            <p className="card-value date-value">{new Date(dueDate).toLocaleDateString('th-TH')}</p>
            </motion.div>
        </motion.section>

        {/* Details Grid */}
        <motion.section className="loan-info-grid" variants={itemVariants}>
            <h2 className="section-title">รายละเอียด</h2>
            <div className="info-item">
            <FaPercentage className="info-icon" />
            <span className="info-label">อัตราดอกเบี้ย:</span>
            <span className="info-value">{interestRate * 100}% ต่อเดือน</span>
            </div>
            <div className="info-item">
            <FaClock className="info-icon" />
            <span className="info-label">จำนวนงวด:</span>
            <span className="info-value">{termMonths} เดือน</span>
            </div>
            <div className="info-item">
            <FaCalendarAlt className="info-icon" />
            <span className="info-label">วันที่เริ่มกู้:</span>
            <span className="info-value">{new Date(startDate).toLocaleDateString('th-TH')}</span>
            </div>
        </motion.section>

        {/* History */}
        <motion.section className="loan-history-section" variants={itemVariants}>
            <h2 className="section-title">ประวัติการชำระ</h2>
            <PaymentHistoryTable history={loanData.paymentsHistory} />
        </motion.section>
        </motion.div>
    </>
  );
};

export default LoanDetailPage;