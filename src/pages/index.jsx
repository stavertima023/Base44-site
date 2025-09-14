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

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
                
                <Route path="/Product" element={<Product />} />
                
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<AdminProducts />} />
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