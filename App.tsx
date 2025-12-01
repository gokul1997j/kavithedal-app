import React, { useState } from 'react';
import { BookOpen, MessageCircle, Menu, X, Globe, Phone, Mail, ShoppingCart, Lock } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import BookCard from './components/BookCard';
import AdminDashboard from './components/AdminDashboard';
import CheckoutModal from './components/CheckoutModal';
import { ViewMode, Book } from './types';
import { StoreProvider, useStore } from './services/store';

// Helper component to separate logic from Context Provider
const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewMode>('catalog');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [initialChatMsg, setInitialChatMsg] = useState<string | undefined>(undefined);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const { books, cart, isAdmin, loginAdmin } = useStore();

  const handleBookInquiry = (book: Book) => {
      setInitialChatMsg(`I'd like to know more about the book "${book.title}" by ${book.author}.`);
      setActiveTab('chat');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const success = loginAdmin(adminPassword);
      if (success) {
          setShowAdminLogin(false);
          setAdminPassword('');
      } else {
          alert('Invalid password (Try: admin123)');
      }
  };

  if (isAdmin) {
      return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif font-bold text-xl">Admin Access</h3>
                    <button onClick={() => setShowAdminLogin(false)}><X size={20} /></button>
                </div>
                <form onSubmit={handleAdminLogin}>
                    <input 
                        type="password" 
                        placeholder="Enter Admin Password" 
                        className="w-full border border-stone-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-orange-500 outline-none"
                        value={adminPassword}
                        onChange={e => setAdminPassword(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="w-full bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800">
                        Login
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-orange-600" />
              <span className="ml-3 text-xl font-serif font-bold text-stone-900 tracking-tight">
                Kavithedal <span className="text-stone-400 font-light">Publication</span>
              </span>
            </div>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-stone-600 hover:text-orange-600 font-medium transition-colors">Home</a>
              <a href="#" className="text-stone-900 font-medium border-b-2 border-orange-500 pb-1">Catalog</a>
              
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="relative bg-stone-100 hover:bg-orange-50 text-stone-800 p-2.5 rounded-full transition-colors"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-4">
              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="relative text-stone-600 p-2"
              >
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cart.length}
                    </span>
                )}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-stone-500 hover:text-stone-900 p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-100 animate-fade-in-down">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-orange-600">Home</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-orange-600">Catalog</a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Hero Section (Small) */}
        <div className="mb-8 text-center md:text-left">
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-2">
                Discover Literature that Resonates
             </h1>
             <p className="text-stone-600 max-w-2xl">
                Explore our curated collection of Tamil and English literature, poetry, and history. 
                Use our AI assistant to find the perfect book for your mood.
             </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)] min-h-[600px]">
          
          {/* Left Column: Catalog (Hidden on Mobile if Chat active) */}
          <div className={`lg:col-span-8 flex flex-col h-full ${activeTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Catalog Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-stone-800 flex items-center">
                    <span className="bg-orange-100 text-orange-600 p-1.5 rounded-md mr-2">
                        <BookOpen size={20} />
                    </span>
                    Featured Collection
                </h2>
                <div className="flex space-x-2">
                    <select className="bg-white border border-stone-200 text-sm rounded-lg p-2.5 focus:ring-orange-500 focus:border-orange-500 outline-none">
                        <option>All Genres</option>
                        <option>Fiction</option>
                        <option>Poetry</option>
                        <option>History</option>
                    </select>
                </div>
            </div>

            {/* Book Grid - Scrollable */}
            <div className="overflow-y-auto pr-2 pb-4 scrollbar-hide flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <BookCard 
                        key={book.id} 
                        book={book} 
                        onSelect={handleBookInquiry}
                    />
                ))}
                </div>
                
                {/* Marketing Banner in Grid */}
                <div className="mt-8 bg-stone-900 rounded-xl p-8 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-serif text-2xl font-bold mb-2">Publish Your Work With Us</h3>
                        <p className="text-stone-300 mb-4 max-w-lg mx-auto">Are you an aspiring author? Kavithedal helps bring your stories to the world.</p>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full transition-colors">
                            Submit Manuscript
                        </button>
                    </div>
                    {/* Decorative circle */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-stone-800 rounded-full opacity-50"></div>
                </div>
            </div>
          </div>

          {/* Right Column: Chat Assistant */}
          <div className={`lg:col-span-4 h-full flex flex-col ${activeTab === 'catalog' ? 'hidden lg:flex' : 'flex'}`}>
             <div className="h-full">
                <ChatInterface 
                    key={initialChatMsg}
                    initialMessage={initialChatMsg} 
                />
             </div>
          </div>

        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around p-3 z-30">
        <button 
            onClick={() => setActiveTab('catalog')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'catalog' ? 'text-orange-600' : 'text-stone-400'}`}
        >
            <BookOpen size={24} />
            <span className="text-xs font-medium">Books</span>
        </button>
        <button 
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'chat' ? 'text-orange-600' : 'text-stone-400'}`}
        >
            <MessageCircle size={24} />
            <span className="text-xs font-medium">Assistant</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8 mt-auto hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
                <h4 className="text-white font-bold mb-4">Contact</h4>
                <div className="space-y-2">
                    <p className="flex items-center"><Mail size={16} className="mr-2" /> support@kavithedal.com</p>
                    <p className="flex items-center"><Phone size={16} className="mr-2" /> +91-98765-43210</p>
                </div>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Policies</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Shipping & Delivery</a></li>
                    <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
                </ul>
            </div>
            <div className="text-right flex flex-col justify-between">
                <div>
                     <p>&copy; 2024 Kavithedal Publication.</p>
                     <p className="mt-1">All rights reserved.</p>
                </div>
                <button 
                    onClick={() => setShowAdminLogin(true)}
                    className="flex items-center justify-end text-xs text-stone-600 hover:text-stone-400 mt-4"
                >
                    <Lock size={12} className="mr-1" /> Admin
                </button>
            </div>
        </div>
      </footer>

      {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
    </div>
  );
}

function App() {
    return (
        <StoreProvider>
            <MainApp />
        </StoreProvider>
    );
}

export default App;