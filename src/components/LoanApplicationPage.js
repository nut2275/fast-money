import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // 👈 Import useAuth
import { FaUser, FaMoneyBillWave, FaClock, FaCheckCircle, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import './styles.css'; 
import NavBar from './NavBar';

// ----------------------------------------------------
// ค่าคงที่สำหรับคำนวณสินเชื่อ
// ----------------------------------------------------
const MONTHLY_INTEREST_RATE = 0.01; 

const calculateEMI = (principal, rate, term) => {
    if (principal <= 0 || term <= 0 || rate <= 0) {
        return 0;
    }
    const power = Math.pow(1 + rate, term);
    return principal * (rate * power) / (power - 1);
};


// ----------------------------------------------------
// Variants และ Stepper Components (โค้ดเดิม)
// ----------------------------------------------------
const formVariants = {
    initial: { opacity: 0, x: 200 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -200 }
};

const Stepper = ({ currentStep, totalSteps }) => (
    <div className="loan-stepper">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
            <motion.div 
                key={step} 
                className={`step-indicator ${step === currentStep ? 'active' : ''} ${step < currentStep ? 'complete' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: step === currentStep ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {step < currentStep ? <FaCheckCircle /> : step}
            </motion.div>
        ))}
    </div>
);


// ----------------------------------------------------
// Components สำหรับแต่ละขั้นตอนของฟอร์ม (โค้ดเดิม)
// ----------------------------------------------------

const Step1_Amount = ({ formData, handleChange, monthlyPayment }) => {
    const formatCurrency = (amount) => 
        amount.toLocaleString('th-TH', { minimumFractionDigits: 2 });

    return (
        <motion.div key="step1" variants={formVariants} initial="initial" animate="in" exit="out" className="step-content">
            <h3 className="step-title"><FaMoneyBillWave /> 1. ข้อมูลสินเชื่อที่ต้องการ</h3>
            
            <div className="input-group loan-input">
                <label>วงเงินกู้ (บาท)</label>
                <input
                    type="number"
                    name="amount"
                    placeholder="เช่น 100000"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    required
                    min="10000"
                />
            </div>
            <div className="input-group loan-input">
                <label>ระยะเวลาผ่อนชำระ (เดือน)</label>
                <input
                    type="number"
                    name="termMonths"
                    placeholder="เช่น 12"
                    value={formData.termMonths || ''}
                    onChange={handleChange}
                    required
                    min="6"
                    max="60"
                />
            </div>

            <motion.div 
                className={`emi-result-card ${monthlyPayment > 0 ? 'active' : ''}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                {monthlyPayment > 0 ? (
                    <>
                        <p className="emi-label">ยอดชำระคืนต่อเดือน (โดยประมาณ)</p>
                        <p className="emi-value">
                            {formatCurrency(monthlyPayment)} ฿
                        </p>
                        <p className="emi-rate">อัตราดอกเบี้ยคงที่: 1% ต่อเดือน</p>
                    </>
                ) : (
                    <p className="emi-placeholder">กรุณากรอกวงเงินและระยะเวลาเพื่อคำนวณยอดชำระต่อเดือน</p>
                )}
            </motion.div>

        </motion.div>
    );
};

const Step2_Details = ({ formData, handleChange }) => (
    <motion.div key="step2" variants={formVariants} initial="initial" animate="in" exit="out" className="step-content">
        <h3 className="step-title"><FaUser /> 2. ข้อมูลส่วนตัวและรายได้</h3>
        <div className="input-group loan-input">
            <label>อาชีพ</label>
            <input
                type="text"
                name="occupation"
                placeholder="พนักงานบริษัท, ธุรกิจส่วนตัว"
                value={formData.occupation || ''}
                onChange={handleChange}
                required
            />
        </div>
        <div className="input-group loan-input">
            <label>รายได้ต่อเดือน (บาท)</label>
            <input
                type="number"
                name="income"
                placeholder="30000"
                value={formData.income || ''}
                onChange={handleChange}
                required
                min="10000"
            />
        </div>
    </motion.div>
);

const Step3_Summary = ({ formData, monthlyPayment }) => (
    <motion.div key="step3" variants={formVariants} initial="initial" animate="in" exit="out" className="step-content">
        <h3 className="step-title"><FaCheckCircle /> 3. สรุปและยืนยัน</h3>
        <div className="summary-box">
            <h4>ข้อมูลสรุปการขอสินเชื่อ</h4>
            <div className="summary-item">
                <span className="summary-label">วงเงินที่ต้องการ:</span>
                <span className="summary-value">{formData.amount ? parseFloat(formData.amount).toLocaleString() : '-'} บาท</span>
            </div>
            <div className="summary-item payment-summary">
                <FaCalendarAlt className="summary-icon" />
                <span className="summary-label">ยอดผ่อนชำระต่อเดือน:</span>
                <span className="summary-value payment-value">
                    {monthlyPayment > 0 ? parseFloat(monthlyPayment).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '-'} บาท
                </span>
            </div>
            <div className="summary-item">
                <span className="summary-label">ระยะเวลาผ่อน:</span>
                <span className="summary-value">{formData.termMonths || '-'} เดือน</span>
            </div>
            <div className="summary-item">
                <span className="summary-label">รายได้ต่อเดือน:</span>
                <span className="summary-value">{formData.income ? parseFloat(formData.income).toLocaleString() : '-'} บาท</span>
            </div>
        </div>
        <p className="agreement-text">
            * การกดปุ่มยืนยันถือเป็นการยินยอมให้ธนาคารตรวจสอบข้อมูลเครดิตของคุณ
        </p>
    </motion.div>
);


// ----------------------------------------------------
// Main Component
// ----------------------------------------------------

const LoanApplicationPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: null, text: '' });
    const totalSteps = 3;
    const navigate = useNavigate();
    
    // 💡 ดึง user และ submitLoanApplication มาใช้
    const { user, submitLoanApplication } = useAuth(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const monthlyPayment = useMemo(() => {
        const amount = parseFloat(formData.amount);
        const termMonths = parseInt(formData.termMonths);

        if (amount > 0 && termMonths > 0) {
            return calculateEMI(amount, MONTHLY_INTEREST_RATE, termMonths);
        }
        return 0;
    }, [formData.amount, formData.termMonths]);

    const handleNext = () => {
        // Validation check
        if (step === 1) {
            if (!formData.amount || !formData.termMonths) {
                setMessage({ type: 'error', text: 'กรุณากรอกวงเงินและระยะเวลาให้ครบถ้วน' });
                return;
            }
            if (monthlyPayment <= 0 || monthlyPayment === Infinity || isNaN(monthlyPayment)) {
                setMessage({ type: 'error', text: 'การคำนวณยอดชำระต่อเดือนผิดพลาด กรุณาตรวจสอบวงเงิน' });
                return;
            }
        }
        if (step === 2 && (!formData.occupation || !formData.income)) {
            setMessage({ type: 'error', text: 'กรุณากรอกข้อมูลรายได้และอาชีพให้ครบถ้วน' });
            return;
        }
        
        setMessage({ type: null, text: '' });
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => {
        setMessage({ type: null, text: '' });
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step !== totalSteps) return;

        setIsSubmitting(true);
        setMessage({ type: null, text: '' });
        
        // 1. ✅ บันทึกข้อมูลสินเชื่อเข้า Context 
        const submitResult = submitLoanApplication(formData, monthlyPayment, user.username);

        setTimeout(() => {
            setIsSubmitting(false);
            
            if (submitResult.success) {
                setMessage({ type: 'success', text: 'ยื่นคำขอสินเชื่อสำเร็จ! กำลังนำไปหน้าติดตามสถานะ...' });
                
                // 2. ✅ เปลี่ยนหน้าไปที่หน้าแสดงรายละเอียดสินเชื่อ (/loan)
                setTimeout(() => {
                    navigate('/loan'); 
                }, 2000); 
            } else {
                 setMessage({ type: 'error', text: submitResult.message });
            }

        }, 2500);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1_Amount formData={formData} handleChange={handleChange} monthlyPayment={monthlyPayment} />;
            case 2:
                return <Step2_Details formData={formData} handleChange={handleChange} />;
            case 3:
                return <Step3_Summary formData={formData} monthlyPayment={monthlyPayment} />;
            default:
                return null;
        }
    };

    return (
        <>
            <NavBar />
            <motion.div 
                className="loan-application-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                
                <div className="loan-application-card">
                    <h1 className="loan-form-header">ยื่นคำขอสินเชื่อ</h1>
                    
                    <Stepper currentStep={step} totalSteps={totalSteps} />

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>

                        {/* Status Message (Animation) */}
                        {message.type && (
                            <motion.p 
                                className={`status-message-form ${message.type}`}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {message.text}
                            </motion.p>
                        )}

                        <div className="form-navigation">
                            <motion.button
                                type="button"
                                className="nav-button back-button"
                                onClick={handleBack}
                                disabled={step === 1 || isSubmitting}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaChevronLeft /> ย้อนกลับ
                            </motion.button>

                            {step < totalSteps && (
                                <motion.button
                                    type="button"
                                    className="nav-button next-button"
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ถัดไป <FaChevronRight />
                                </motion.button>
                            )}

                            {step === totalSteps && (
                                <motion.button
                                    type="submit"
                                    className="nav-button submit-button"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isSubmitting ? 'กำลังยื่นคำขอ...' : 'ยืนยันและส่งคำขอ'}
                                </motion.button>
                            )}
                        </div>
                    </form>
                </div>
            </motion.div>
        </>
    );
};

export default LoanApplicationPage;