import React from 'react';
import { Link } from 'react-router-dom';
import { X, MessageCircle } from 'lucide-react';

export default function MobileNav({ isOpen, onClose, navigationItems }) {
  if (!isOpen) return null;

  const handleAskQuestion = () => {
    window.open(`https://t.me/mansionsell?text=Здравствуйте! У меня есть вопрос`, '_blank');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 md:hidden" 
        onClick={onClose}
      ></div>
      <div
        className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4 border-b">
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6 text-gray-800" />
            </button>
          </div>
          <nav className="flex-grow p-6">
            <ul className="space-y-6">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.url}
                    onClick={onClose}
                    className="text-lg font-medium text-gray-800 hover:text-red-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-6 border-t">
            <button 
              onClick={handleAskQuestion} 
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Ask a question</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}