import React, { useState } from 'react';
import { motion } from 'framer-motion';


export default function UserSystem() {
    const [page, setPage] = useState('login'); // 'login' | 'register' | 'profile'
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleRegister = (e) => {
        e.preventDefault();
        if (!form.username || !form.email || !form.password || !form.confirm) {
        setError('กรอกข้อมูลให้ครบ');
        return;
        }
        if (form.password !== form.confirm) {
        setError('รหัสผ่านไม่ตรงกัน');
        return;
        }
        setUser({ username: form.username, email: form.email, balance: 10000 });
        setPage('profile');
        };


        const handleLogin = (e) => {
        e.preventDefault();
        if (!form.username || !form.password) {
        setError('กรอกข้อมูลให้ครบ');
        return;
        }
        setUser({ username: form.username, email: 'demo@mail.com', balance: 10000 });
        setPage('profile');
        };


        const handleLogout = () => {
        setUser(null);
        setPage('login');
        setForm({ username: '', email: '', password: '', confirm: '' });
        };


        const Card = ({ children }) => (
        <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        >
        {children}
        </motion.div>
        );


        const Input = ({ label, ...props }) => (
        <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">{label}</label>
        <input {...props} className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </div>
        );


    return (<>
    <Input />
    </>)
}