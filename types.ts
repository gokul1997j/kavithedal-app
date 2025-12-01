export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  category: string;
  price: number;
  description: string;
  coverUrl: string;
  pages: number;
  language: 'Tamil' | 'English';
  isbn: string;
  stock: number;
  sold: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export type ViewMode = 'chat' | 'catalog';

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  date: string; // ISO date string
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  booksSold: number;
  lowStockCount: number;
}