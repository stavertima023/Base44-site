import React from "react";
import Layout from "./Layout.jsx";

import Home from "./Home";

import All from "./All";

import New from "./New";

import Shirts from "./Shirts";

import Hoodie from "./Hoodie";

import Bottoms from "./Bottoms";

import Womens from "./Womens";

import Sale from "./Sale";

import Product from "./Product";

import AdminOrders from "./AdminOrders";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminSimple from "./AdminSimple";
import AdminProductEdit from "./AdminProductEdit";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

function Register() {
    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [telegram, setTelegram] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone || !telegram) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, telegram })
            });
            if (!res.ok) throw new Error('Failed');
            window.location.href = '/register/success';
        } catch (_e) {
            alert('Не удалось отправить данные. Повторите попытку позже.');
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Регистрация</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Имя</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Номер телефона</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Ник в Telegram</label>
                        <input value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="@username" required />
                    </div>
                    <button type="submit" disabled={submitting} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        {submitting ? 'Отправка...' : 'Зарегистрироваться'}
                    </button>
                </form>
            </div>
        </div>
    );
}

function RegisterSuccess() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Ваша регистрация успешно пройдена</h1>
                <p className="text-gray-700">Ожидайте подтверждения модератором</p>
            </div>
        </div>
    );
}

function ContactUs() {
    const [name, setName] = React.useState("");
    const [telegram, setTelegram] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [sending, setSending] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !telegram || !message) return;
        setSending(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, telegram, message })
            });
            if (!res.ok) throw new Error('Failed');
            alert('Сообщение отправлено!');
            setName("");
            setTelegram("");
            setMessage("");
        } catch (_e) {
            alert('Не удалось отправить сообщение. Попробуйте позже.');
        }
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Связаться с нами</h1>
                <p className="text-gray-700 mb-6">
                    По всем вопросам, касающимся нашего интернет-магазина и заказов, пожалуйста, обращайтесь к нам через форму ниже. Мы ответим в течение 24 часов. Обратите внимание, что на запросы, отправленные в праздничные дни и в выходные, мы ответим после возобновления рабочей недели.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Имя</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Ник в телеграмм</label>
                        <input value={telegram} onChange={(e) => setTelegram(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="@username" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">Сообщение</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32" required />
                    </div>
                    <button type="submit" disabled={sending} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                        {sending ? 'Отправка...' : 'Отправить'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const PAGES = {
    
    Home: Home,
    
    All: All,
    
    New: New,
    
    Shirts: Shirts,
    
    Hoodie: Hoodie,
    
    Bottoms: Bottoms,
    
    Womens: Womens,
    
    Sale: Sale,
    
    Product: Product,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    React.useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [location.pathname]);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/All" element={<All />} />
                
                <Route path="/New" element={<New />} />
                
                <Route path="/Shirts" element={<Shirts />} />
                
                <Route path="/Hoodie" element={<Hoodie />} />
                
                <Route path="/Bottoms" element={<Bottoms />} />
                
                <Route path="/Womens" element={<Womens />} />
                
                <Route path="/Sale" element={<Sale />} />
                <Route path="/sale" element={<Sale />} />
                
                <Route path="/Product" element={<Product />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/success" element={<RegisterSuccess />} />
                <Route path="/contact-us" element={<ContactUs />} />
                
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/edit" element={<AdminProductEdit />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}