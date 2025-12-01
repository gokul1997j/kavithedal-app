import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Order, CartItem, OrderStatus } from '../types';
import { CATALOG, MOCK_ORDERS } from '../constants';

interface StoreContextType {
  books: Book[];
  orders: Order[];
  cart: CartItem[];
  isAdmin: boolean;
  
  // Actions
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  placeOrder: (customerDetails: any, paymentMethod: string) => void;
  
  // Admin Actions
  addBook: (book: Omit<Book, 'id' | 'sold'>) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(CATALOG);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Cart Actions
  const addToCart = (book: Book) => {
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        return prev.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(item => item.book.id !== bookId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customerDetails: any, paymentMethod: string) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      items: [...cart],
      totalAmount: cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0),
      status: 'Pending',
      paymentMethod,
      date: new Date().toISOString()
    };
    
    // Update stock and sold counts
    setBooks(prevBooks => prevBooks.map(book => {
      const cartItem = cart.find(item => item.book.id === book.id);
      if (cartItem) {
        return {
          ...book,
          stock: Math.max(0, book.stock - cartItem.quantity),
          sold: book.sold + cartItem.quantity
        };
      }
      return book;
    }));

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  // Auth Actions
  const loginAdmin = (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdmin(false);

  // Inventory Actions
  const addBook = (bookData: Omit<Book, 'id' | 'sold'>) => {
    const newBook: Book = {
      ...bookData,
      id: `b${Date.now()}`,
      sold: 0
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updates } : book));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  return (
    <StoreContext.Provider value={{
      books, orders, cart, isAdmin,
      loginAdmin, logoutAdmin,
      addToCart, removeFromCart, clearCart, placeOrder,
      addBook, updateBook, deleteBook, updateOrderStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};