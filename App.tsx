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

            {/* WhatsApp Banner for Publishing */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 py-3 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <a 
            href="https://wa.me/917904730223?text=Hi%20Kavithedal!%20I%20want%20to%20publish%20my%20book" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-3 hover:scale-105 transition-transform duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-white font-bold text-lg md:text-xl">
              📚 Want to Publish Your Book? Click Here! 
            </span>
            <span className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              Free Consultation
            </span>
          </a>
        </div>
      </div>

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
