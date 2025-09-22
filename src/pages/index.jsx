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
    const [sent, setSent] = React.useState(false);

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
            setSent(true);
            setName("");
            setTelegram("");
            setMessage("");
        } catch (_e) {
            // можно отобразить скрытую ошибку при необходимости
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
                    {sent && (
                        <p className="text-green-600 text-sm">Сообщение отправлено. Мы свяжемся с вами в течение 24 часов.</p>
                    )}
                </form>
            </div>
        </div>
    );
}

function ShippingPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Политика Доставки</h1>

                <div className="space-y-6 text-gray-800">
                    <div>
                        <p className="font-semibold">Какими перевозчиками вы пользуетесь?</p>
                        <p>Мы пользуемся услугами Яндекс доставки, Почты России, Сдэк.</p>
                    </div>

                    <div>
                        <p className="font-semibold">Как я могу отследить свой заказ?</p>
                        <p>После отправки заказа вы получите уведомление в телеграмм с трэк номером вашего заказа.</p>
                    </div>

                    <div>
                        <p className="font-semibold">Сколько времени займёт доставка моего заказа?</p>
                        <p>Для заказов внутри России: после отправки заказа доставка обычно занимает от 3 до 7 рабочих дней, в зависимости от способа доставки, выбранного при оформлении заказа. Праздничные и выходные дни не учитываются в сроке доставки.</p>
                        <p className="mt-2">Для международных заказов: после отправки заказа доставка обычно занимает 7–20 рабочих дней. Таможня может задержать доставку вашего заказа на срок до 30 рабочих дней.</p>
                        <p className="mt-2">Пожалуйста, имейте в виду, что это примерное время доставки, указанное нашими перевозчиками, и оно не включает время обработки заказа. Выходные, праздничные дни, таможенные процедуры и погодные условия могут привести к задержке доставки вашего заказа.</p>
                        <p className="mt-2">Стоимость доставки не возвращается. Если ваша посылка будет возвращена из-за того, что адрес доставки не соответствует действительности, мы вернем вам деньги только за стоимость товаров. При запросе на повторную отправку взимается плата за повторную доставку. Мы не осуществляем доставку по адресу, указанному в вашем первоначальном заказе. Мы не несем ответственности за утерянные/украденные/поврежденные отправления.</p>
                    </div>

                    <div>
                        <p className="font-semibold">Нужно ли мне будет платить международные налоги и пошлины?</p>
                        <p>Международные заказы облагаются пошлинами, таможенными сборами и налогом на добавленную стоимость. Эти сборы ДОЛЖНЫ быть оплачены при получении заказа. Обязательно уточните у властей страны, в которую отправляется заказ, какие дополнительные расходы могут возникнуть. Вы несёте ответственность за уплату всех налогов и пошлин, взимаемых с вашей посылки; эта плата не включена в стоимость доставки.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RefundPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Политика Возврата денежных средств</h1>

                <div className="space-y-4 text-gray-800">
                    <p className="font-semibold">Правила возврата</p>
                    <p>Если по какой-либо причине вы недовольны своей покупкой, пожалуйста, обратитесь в службу поддержки. Пожалуйста, подождите 2 недели с момента отправки заказа, чтобы мы могли оформить возврат. Мы сообщим вам по электронной почте, когда ваш возврат будет оформлен.</p>
                    <p className="mt-2">*Товар необходимо вернуть в течение 30 календарных дней с момента получения.</p>
                    <p>*Товар должен быть неношеным, неиспользованным, нестиранным, в оригинальной упаковке с прикреплёнными бирками</p>
                    <p>*Товары со скидкой / товары по сниженной цене — это  окончательная распродажа</p>
                    <p>*Стоимость доставки, пошлины, налоги и таможенные сборы не возвращаются при возврате или обмене товара.</p>
                    <p>* Если при возврате заказа использовалась акция, например бесплатная доставка, стоимость акции будет вычтена из суммы возврата.</p>
                    <p>*Все предметы нижнего белья продаются без возможности возврата или обмена.</p>
                    <p>*Все маски для лица продаются без возможности возврата или обмена.</p>
                    <p>*Вся ОБУВЬ продаётся без возможности возврата или обмена.</p>
                    <p>*Все носки продаются без возможности возврата или обмена.</p>
                    <p>*Все шляпы продаются без возможности возврата или обмена.</p>

                    <p className="font-semibold mt-6">Возврат средств и Обработка</p>
                    <p>*Пожалуйста, подождите 2 недели с момента отправки заказа, чтобы мы могли оформить возврат или обмен. Мы сообщим вам по электронной почте, как только ваш возврат будет оформлен.</p>
                    <p>Чтобы обеспечить наилучшее обслуживание клиентов, любые вопросы, связанные с заказами, должны быть заданы в письменной форме в течение 7 дней с момента доставки.</p>
                </div>
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
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                
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