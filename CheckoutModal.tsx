import React, { useState } from 'react';
import { useStore } from '../services/store';
import { X, CreditCard, ShoppingBag, Truck, ShieldCheck, Loader } from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const { cart, removeFromCart, placeOrder, clearCart } = useStore();
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: '', zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const totalAmount = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);

  const handleNext = () => {
    if (step === 'cart') setStep('details');
    else if (step === 'details') {
        if (!formData.name || !formData.address) return; // Simple validation
        setStep('payment');
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        placeOrder(formData, paymentMethod);
        setIsLoading(false);
        setStep('success');
    }, 2000);
  };

  if (step === 'success') {
      return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Payment Successful!</h2>
                <p className="text-stone-600 mb-6">Your order has been placed successfully. You will receive a confirmation email shortly.</p>
                <div className="bg-stone-50 rounded-lg p-4 mb-6 text-sm text-stone-500">
                    <p>Transaction ID: tx_{Date.now()}</p>
                    <p>Amount Paid: ₹{totalAmount}</p>
                </div>
                <button 
                    onClick={onClose}
                    className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <div className="flex items-center space-x-2">
                <ShoppingBag size={20} className="text-orange-600" />
                <h2 className="font-serif font-bold text-lg text-stone-800">
                    {step === 'cart' ? 'Your Cart' : step === 'details' ? 'Shipping Details' : 'Secure Payment'}
                </h2>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-900"><X size={24} /></button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
            {step === 'cart' && (
                <>
                    {cart.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-stone-500">Your cart is empty.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.book.id} className="flex justify-between items-center border-b border-stone-100 pb-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.book.coverUrl} alt="" className="w-12 h-16 object-cover rounded shadow-sm" />
                                        <div>
                                            <h4 className="font-bold text-stone-900">{item.book.title}</h4>
                                            <p className="text-sm text-stone-500">₹{item.book.price} x {item.quantity}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.book.id)} className="text-red-400 hover:text-red-600">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {step === 'details' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" className="col-span-2 border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input type="email" placeholder="Email Address" className="col-span-2 border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input type="text" placeholder="Street Address" className="col-span-2 border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        <input type="text" placeholder="City" className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        <input type="text" placeholder="ZIP Code" className="border p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                    </div>
                </div>
            )}

            {step === 'payment' && (
                <div className="space-y-6">
                    <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 mb-6">
                        <p className="text-sm text-stone-500">Amount to Pay</p>
                        <p className="text-3xl font-bold text-stone-900">₹{totalAmount}</p>
                    </div>

                    <div>
                        <p className="font-bold text-stone-800 mb-3">Select Payment Method</p>
                        <div className="space-y-3">
                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-stone-200'}`}>
                                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-3 text-orange-600 focus:ring-orange-500" />
                                <div className="flex-1">
                                    <span className="font-bold text-stone-800">UPI</span>
                                    <p className="text-xs text-stone-500">Google Pay, PhonePe, Paytm</p>
                                </div>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4" />
                            </label>

                            <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-stone-200'}`}>
                                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-3 text-orange-600 focus:ring-orange-500" />
                                <div className="flex-1">
                                    <span className="font-bold text-stone-800">Card</span>
                                    <p className="text-xs text-stone-500">Visa, Mastercard, Rupay</p>
                                </div>
                                <CreditCard size={20} className="text-stone-400" />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
            <div className="text-sm font-bold text-stone-900">
                Total: ₹{totalAmount}
            </div>
            
            {step === 'cart' && (
                <button 
                    onClick={handleNext}
                    disabled={cart.length === 0}
                    className="bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
                >
                    Proceed to Checkout
                </button>
            )}
            {step === 'details' && (
                <button 
                    onClick={handleNext}
                    className="bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
                >
                    Continue to Payment
                </button>
            )}
            {step === 'payment' && (
                <button 
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center"
                >
                    {isLoading ? <Loader className="animate-spin mr-2" size={20} /> : null}
                    {isLoading ? 'Processing...' : `Pay ₹${totalAmount}`}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;