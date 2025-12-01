import React, { useState } from 'react';
import { useStore } from '../services/store';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, 
  TrendingUp, AlertTriangle, Plus, Edit2, Trash2, X, Check, Search
} from 'lucide-react';
import { Book, OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const { 
    books, orders, logoutAdmin, 
    addBook, updateBook, deleteBook, updateOrderStatus 
  } = useStore();
  const [activeView, setActiveView] = useState<'dashboard' | 'inventory' | 'orders'>('dashboard');

  // Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const booksSold = orders.reduce((sum, order) => sum + order.items.reduce((s, i) => s + i.quantity, 0), 0);
  const lowStockBooks = books.filter(b => b.stock < 5);

  return (
    <div className="flex h-screen bg-stone-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-stone-900 text-stone-300 flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <h2 className="text-white font-serif font-bold text-xl">Admin Panel</h2>
          <p className="text-xs text-stone-500 mt-1">Kavithedal Publication</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'dashboard' ? 'bg-orange-600 text-white' : 'hover:bg-stone-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveView('inventory')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'inventory' ? 'bg-orange-600 text-white' : 'hover:bg-stone-800'}`}
          >
            <Package size={20} />
            <span>Inventory</span>
          </button>
          <button 
            onClick={() => setActiveView('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === 'orders' ? 'bg-orange-600 text-white' : 'hover:bg-stone-800'}`}
          >
            <ShoppingCart size={20} />
            <span>Orders</span>
          </button>
        </nav>

        <div className="p-4 border-t border-stone-800">
          <button onClick={logoutAdmin} className="flex items-center space-x-3 text-stone-400 hover:text-white transition-colors">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-stone-800 capitalize">{activeView} Overview</h1>
            <div className="text-sm text-stone-500">
                Today: {new Date().toLocaleDateString()}
            </div>
          </div>

          {activeView === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-stone-500">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-stone-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <TrendingUp size={20} />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-stone-500">Total Orders</p>
                      <h3 className="text-2xl font-bold text-stone-900 mt-1">{totalOrders}</h3>
                    </div>
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <ShoppingCart size={20} />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-stone-500">Books Sold</p>
                      <h3 className="text-2xl font-bold text-stone-900 mt-1">{booksSold}</h3>
                    </div>
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <Package size={20} />
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-stone-500">Low Stock Items</p>
                      <h3 className="text-2xl font-bold text-stone-900 mt-1">{lowStockBooks.length}</h3>
                    </div>
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Stock Alert Section */}
              {lowStockBooks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-stone-100 bg-red-50 flex items-center">
                    <AlertTriangle size={18} className="text-red-600 mr-2" />
                    <h3 className="font-bold text-red-900">Low Stock Alerts</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {lowStockBooks.map(book => (
                        <div key={book.id} className="px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center">
                                <img src={book.coverUrl} className="w-10 h-14 object-cover rounded shadow-sm mr-4" alt="cover"/>
                                <div>
                                    <p className="font-medium text-stone-900">{book.title}</p>
                                    <p className="text-xs text-stone-500">ISBN: {book.isbn}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                    {book.stock} Remaining
                                </span>
                            </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === 'inventory' && (
            <InventoryManager books={books} onAdd={addBook} onUpdate={updateBook} onDelete={deleteBook} />
          )}

          {activeView === 'orders' && (
             <OrderManager orders={orders} onUpdateStatus={updateOrderStatus} />
          )}

        </div>
      </div>
    </div>
  );
};

// Sub-components for Inventory
const InventoryManager = ({ books, onAdd, onUpdate, onDelete }: any) => {
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form state for add/edit
    const initialFormState = {
        title: '', author: '', price: 0, stock: 0, category: 'Fiction', 
        isbn: '', language: 'Tamil', description: '', coverUrl: 'https://picsum.photos/300/450?random=99'
    };
    const [formData, setFormData] = useState<any>(initialFormState);

    const handleEditClick = (book: Book) => {
        setIsEditing(book.id);
        setFormData(book);
        setIsAdding(false);
    };

    const handleSave = () => {
        if (isAdding) {
            onAdd(formData);
        } else if (isEditing) {
            onUpdate(isEditing, formData);
        }
        setIsEditing(null);
        setIsAdding(false);
        setFormData(initialFormState);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={16} />
                    <input type="text" placeholder="Search inventory..." className="pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <button 
                    onClick={() => { setIsAdding(true); setFormData(initialFormState); }}
                    className="flex items-center space-x-2 bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-800"
                >
                    <Plus size={16} />
                    <span>Add Book</span>
                </button>
            </div>

            {/* Modal for Add/Edit */}
            {(isAdding || isEditing) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{isAdding ? 'Add New Book' : 'Edit Book'}</h3>
                            <button onClick={() => { setIsAdding(false); setIsEditing(null); }}><X size={20} /></button>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                                <input type="text" className="w-full border rounded-lg p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Author</label>
                                <input type="text" className="w-full border rounded-lg p-2" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">ISBN</label>
                                <input type="text" className="w-full border rounded-lg p-2" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹)</label>
                                <input type="number" className="w-full border rounded-lg p-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
                                <input type="number" className="w-full border rounded-lg p-2" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                                <select className="w-full border rounded-lg p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Fiction</option>
                                    <option>Non-Fiction</option>
                                    <option>Poetry</option>
                                    <option>History</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Language</label>
                                <select className="w-full border rounded-lg p-2" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                                    <option>Tamil</option>
                                    <option>English</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea className="w-full border rounded-lg p-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end space-x-3">
                             <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-stone-600 hover:text-stone-900">Cancel</button>
                             <button onClick={handleSave} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Save Book</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-600">
                    <thead className="bg-stone-50 text-stone-900 font-medium border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4">Book</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {books.map((book: Book) => (
                            <tr key={book.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img src={book.coverUrl} className="w-8 h-12 object-cover rounded mr-3" alt="" />
                                        <div>
                                            <div className="font-medium text-stone-900">{book.title}</div>
                                            <div className="text-xs">{book.isbn}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{book.category}</td>
                                <td className="px-6 py-4">₹{book.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${book.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {book.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleEditClick(book)} className="text-stone-400 hover:text-blue-600"><Edit2 size={16} /></button>
                                    <button onClick={() => onDelete(book.id)} className="text-stone-400 hover:text-red-600"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const OrderManager = ({ orders, onUpdateStatus }: any) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-stone-600">
                    <thead className="bg-stone-50 text-stone-900 font-medium border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Items</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {orders.map((order: any) => (
                            <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-stone-500">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-stone-900">{order.customerName}</div>
                                    <div className="text-xs">{order.date.split('T')[0]}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {order.items.length} items
                                    <div className="text-xs text-stone-400 truncate max-w-[150px]">
                                        {order.items.map((i: any) => i.book.title).join(', ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-stone-900">₹{order.totalAmount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                                          'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                                        className="text-xs border border-stone-300 rounded p-1 focus:border-orange-500 outline-none"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;