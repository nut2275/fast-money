import React, { createContext, useState, useContext } from 'react';

const INITIAL_MOCK_USERS = [
  {
    username: 'alice_t',
    password: 'hashed_password_mock', 
    name: 'Alice',
    lastname: 'Smith',
    email: 'alice@mail.com',
    บัตรประชาชน: '1234567890123',
    pin: '1234',
    balance: 50000,
    transactions: [
      { transactionId: 'T1', เวลา: '2025-10-27 10:00', type: 'Deposit', ยอดฝากถอน: 10000, ยอดคงเหลือ: 50000 },
      { transactionId: 'T2', เวลา: '2025-10-25 15:30', type: 'Withdrawal', ยอดฝากถอน: 5000, ยอดคงเหลือ: 40000 },
    ]
  },
];

// ข้อมูลสินเชื่อเริ่มต้น (ใช้เป็น Initial State)
const INITIAL_MOCK_LOANS = [
  {
    loanId: 1,
    username: 'alice_t', // ผู้ใช้คนนี้มีสินเชื่อแล้ว
    amount: 100000,
    interestRate: 0.01,
    termMonths: 12,
    monthlyPayment: 8884.88,
    startDate: '2025-10-01',
    dueDate: '2025-11-01',
    currentBalance: 91115.12,
    status: 'Active',
    paymentsHistory: [
      { paymentDate: '2025-10-27', paidAmount: 8884.88, remainingBalance: 91115.12 },
      { paymentDate: '2025-09-27', paidAmount: 8884.88, remainingBalance: 100000.00 },
    ]
  },
];


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mockUsers, setMockUsers] = useState(INITIAL_MOCK_USERS); 
  // ✅ ใช้ State เพื่อเก็บข้อมูลสินเชื่อทั้งหมด
  const [mockLoans, setMockLoans] = useState(INITIAL_MOCK_LOANS); 
  
  const login = (username, password) => {
    const foundUser = mockUsers.find(
      u => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData) => {
    if (mockUsers.some(u => u.username === userData.username)) {
      return { success: false, message: 'ชื่อผู้ใช้ซ้ำ, กรุณาใช้ชื่ออื่น' };
    }

    const newUser = {
      ...userData,
      password: userData.password, 
      balance: 0, 
      transactions: [], 
    };

    setMockUsers([...mockUsers, newUser]);

    return { success: true, message: 'ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ' };
  };

  const updateTransaction = (amount, type) => {
    if (!user) return { success: false, message: 'กรุณาเข้าสู่ระบบ' };

    const newBalance = type === 'Deposit' ? user.balance + amount : user.balance - amount;

    if (newBalance < 0) {
        return { success: false, message: 'ยอดเงินคงเหลือไม่พอสำหรับการถอน' };
    }

    const newTransaction = {
      transactionId: `${type.slice(0, 1)}${Date.now()}`,
      เวลา: new Date().toISOString().slice(0, 19).replace('T', ' '),
      type: type,
      ยอดฝากถอน: amount,
      ยอดคงเหลือ: newBalance,
    };

    const updatedUser = {
      ...user,
      balance: newBalance,
      transactions: [...user.transactions, newTransaction],
    };

    setUser(updatedUser);

    setMockUsers(mockUsers.map(u => 
        u.username === user.username ? updatedUser : u
    ));

    return { success: true, newBalance };
  };

  const deposit = (amount) => updateTransaction(amount, 'Deposit');
  const withdraw = (amount) => updateTransaction(amount, 'Withdrawal');

  // ฟังก์ชันสำหรับดึงข้อมูลสินเชื่อของผู้ใช้ที่ล็อกอิน
  const getUserLoan = (username) => {
      // ค้นหาจาก mockLoans state
      return mockLoans.find(loan => loan.username === username);
  };
  
  // ✅ ฟังก์ชันใหม่สำหรับบันทึกสินเชื่อที่ยื่นขอใหม่
  const submitLoanApplication = (formData, monthlyPayment, username) => {
      // ตรวจสอบว่ามีสินเชื่อที่ใช้งาน/รอดำเนินการอยู่แล้วหรือไม่
      if (mockLoans.some(loan => loan.username === username && (loan.status === 'Active' || loan.status === 'Pending'))) {
          return { success: false, message: 'คุณมีคำขอสินเชื่อที่กำลังดำเนินการอยู่แล้ว' };
      }
      
      // สร้าง Object สินเชื่อใหม่
      const newLoan = {
          loanId: mockLoans.length + 1,
          username: username,
          amount: parseFloat(formData.amount),
          interestRate: 0.01, 
          termMonths: parseInt(formData.termMonths),
          monthlyPayment: monthlyPayment,
          startDate: new Date().toISOString().slice(0, 10),
          dueDate: null, 
          currentBalance: parseFloat(formData.amount),
          status: 'Pending', // สถานะรอดำเนินการ
          paymentsHistory: [],
      };

      // อัปเดต State: เพิ่มสินเชื่อใหม่เข้าไปในรายการ
      setMockLoans(prevLoans => [...prevLoans, newLoan]);

      return { success: true, loanId: newLoan.loanId };
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        register, 
        deposit, 
        withdraw, 
        mockUsers, 
        getUserLoan, 
        submitLoanApplication // ✅ ส่งออกฟังก์ชัน
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);