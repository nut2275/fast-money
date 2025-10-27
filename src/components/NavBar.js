import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // เพิ่ม AnimatePresence
import { FaHome, FaArrowUp, FaArrowDown, FaMoneyBillAlt, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa'; // เพิ่ม FaBars, FaTimes
import { useAuth } from '../AuthContext';
import './styles.css'; 

const navItems = [
    { path: '/profile', name: 'บัญชี', icon: FaHome },
    { path: '/deposit', name: 'ฝากเงิน', icon: FaArrowUp },
    { path: '/withdraw', name: 'ถอนเงิน', icon: FaArrowDown },
    { path: '/loan', name: 'สินเชื่อ', icon: FaMoneyBillAlt },
];

// Variants สำหรับ Mobile Menu (Side Drawer)
const mobileMenuVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { 
        x: "0%", 
        opacity: 1,
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            when: "beforeChildren"
        } 
    },
    exit: { 
        x: "100%", 
        opacity: 0,
        transition: { 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.1 // ให้ link ออกไปก่อนแล้วค่อยเมนูปิด
        } 
    }
};

const mobileLinkVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
    exit: { x: 50, opacity: 0 }
};

const NavBar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State สำหรับ Mobile Menu

    // ไม่แสดง Navbar ถ้าผู้ใช้ไม่ได้ล็อกอิน (อยู่ที่หน้า login/register)
    if (!user || location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false); // ปิดเมนูมือถือด้วย
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <motion.nav 
                className="main-navbar"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
            >
                {/* Logo/Brand Name */}
                <motion.div 
                    className="navbar-logo"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/profile" onClick={closeMobileMenu}>
                        <span className="logo-text">Fast Money</span> 
                        <span className="user-initials">({user.username})</span>
                    </Link>
                </motion.div>

                {/* Desktop Links */}
                <div className="navbar-links desktop-only">
                    {navItems.map((item) => (
                        <motion.div 
                            key={item.path}
                            whileHover={{ scale: 1.1, color: 'var(--color-primary-dark)' }}
                            whileTap={{ scale: 0.95 }}
                            className="nav-item-wrapper"
                        >
                            <Link 
                                to={item.path} 
                                className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                            >
                                <item.icon className="nav-icon" />
                                <span className="nav-text">{item.name}</span>
                                {location.pathname.startsWith(item.path) && (
                                    <motion.div 
                                        className="nav-indicator"
                                        layoutId="navIndicator"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    />
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Hamburger Menu Icon (Mobile Only) */}
                <motion.button 
                    className="hamburger-menu mobile-only" 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </motion.button>

                {/* Desktop Logout Button */}
                <motion.button 
                    className="logout-nav-button desktop-only" 
                    onClick={handleLogout}
                    whileHover={{ scale: 1.05, backgroundColor: '#c82333' }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaSignOutAlt className="nav-icon" /> ออกจากระบบ
                </motion.button>
            </motion.nav>

            {/* Mobile Menu (Side Drawer) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)} // ปิดเมนูเมื่อคลิกนอก
                    >
                        <motion.div 
                            className="mobile-menu-drawer"
                            variants={mobileMenuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            // ไม่ให้ event propagation เมื่อคลิกใน drawer
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div className="mobile-menu-header">
                                <span className="logo-text">Fast Money</span>
                                <motion.button 
                                    className="close-menu-button" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FaTimes />
                                </motion.button>
                            </div>
                            <motion.div 
                                className="mobile-nav-links"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.07,
                                            delayChildren: 0.2
                                        }
                                    },
                                    exit: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            staggerDirection: -1
                                        }
                                    }
                                }}
                            >
                                {navItems.map((item) => (
                                    <motion.div key={item.path} variants={mobileLinkVariants}>
                                        <Link 
                                            to={item.path} 
                                            className={`mobile-nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                                            onClick={closeMobileMenu}
                                        >
                                            <item.icon className="nav-icon" />
                                            <span className="nav-text">{item.name}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                            <motion.button 
                                className="logout-mobile-button" 
                                onClick={handleLogout}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                variants={mobileLinkVariants}
                            >
                                <FaSignOutAlt className="nav-icon" /> ออกจากระบบ
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NavBar;