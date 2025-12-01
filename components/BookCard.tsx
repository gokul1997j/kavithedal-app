import React from 'react';
import { Book } from '../types';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { useStore } from '../services/store';

interface BookCardProps {
  book: Book;
  onSelect?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  const { addToCart } = useStore();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-stone-100 flex flex-col h-full group">
      <div className="relative h-64 overflow-hidden bg-stone-200 group">
        <img 
          src={book.coverUrl} 
          alt={book.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-stone-700 shadow-sm z-10">
          {book.language}
        </div>
        {book.stock < 5 && book.stock > 0 && (
           <div className="absolute bottom-2 left-2 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
             Only {book.stock} left!
           </div>
        )}
        {book.stock === 0 && (
           <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
             <span className="bg-stone-800 text-white px-4 py-2 font-bold rounded-lg shadow-lg transform -rotate-12">OUT OF STOCK</span>
           </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight mb-1">{book.title}</h3>
            <p className="text-sm text-stone-500 mb-2 italic">by {book.author}</p>
            <div className="flex flex-wrap gap-2 mb-2">
                <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">{book.category}</span>
            </div>
            <p className="text-stone-600 text-sm line-clamp-3 mb-4">{book.description}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          <span className="text-lg font-bold text-stone-900">₹{book.price}</span>
          <div className="flex space-x-2">
             <button 
                onClick={() => onSelect && onSelect(book)}
                title="Ask about this book"
                className="p-2 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
             >
                <BookOpen size={18} />
             </button>
             <button 
                onClick={() => addToCart(book)}
                disabled={book.stock === 0}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  book.stock === 0 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
             >
                <ShoppingCart size={16} />
                <span>Add</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;