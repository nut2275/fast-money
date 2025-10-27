import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import DepositPage from './components/DepositPage'; 
import WithdrawalPage from './components/WithdrawalPage'; 
import LoanDetailPage from './components/LoanDetailPage'; 
import LoanApplicationPage from './components/LoanApplicationPage'; 
import './components/styles.css'; 

// Component สำหรับป้องกันหน้า (Redirect ไปหน้า Login หากยังไม่เข้าสู่ระบบ)
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-main">
          <Routes>
            {/* หน้าหลัก: นำทางไปยัง Profile หากล็อกอินแล้ว */}
            <Route path="/" element={<Navigate to="/profile" replace />} />
            
            {/* หน้าเข้าสู่ระบบและลงทะเบียน */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* หน้าที่ต้องมีการยืนยันตัวตน (Protected Routes) */}
            <Route 
              path="/profile" 
              element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
            />
            <Route 
              path="/deposit" 
              element={<ProtectedRoute><DepositPage /></ProtectedRoute>} 
            />
            <Route 
              path="/withdraw" 
              element={<ProtectedRoute><WithdrawalPage /></ProtectedRoute>} 
            />
            {/* หน้าแสดงรายละเอียดสินเชื่อ */}
            <Route 
              path="/loan" 
              element={<ProtectedRoute><LoanDetailPage /></ProtectedRoute>} 
            />
            {/* หน้าสมัครสินเชื่อ */}
            <Route 
              path="/apply-loan" 
              element={<ProtectedRoute><LoanApplicationPage /></ProtectedRoute>} 
            />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;