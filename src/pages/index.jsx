import Layout from "./Layout.jsx";

import Catalog from "./Catalog";

import About from "./About";

import Import from "./Import";

import DeployGuide from "./DeployGuide";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Catalog: Catalog,
    
    About: About,
    
    Import: Import,
    
    DeployGuide: DeployGuide,
    
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
                
                    <Route path="/" element={<Catalog />} />
                
                
                <Route path="/Catalog" element={<Catalog />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Import" element={<Import />} />
                
                <Route path="/DeployGuide" element={<DeployGuide />} />
                
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