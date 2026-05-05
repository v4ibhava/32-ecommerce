import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CreditCard, Truck, ShieldCheck, ChevronLeft } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Continue Shopping
        </Link>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Checkout</h1>
          
          <div className="space-y-8">
            {/* Shipping Address */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                <input type="text" placeholder="Address Line 1" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                  <input type="text" placeholder="Pincode" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="p-6 border-2 border-blue-600 bg-blue-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-blue-600 bg-white"></div>
                  <span className="font-bold text-blue-900">Cash on Delivery</span>
                </div>
                <Truck className="text-blue-600" />
              </div>
            </section>

            {/* Order Summary Placeholder */}
            <div className="pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  Secure Transaction
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                  <p className="text-3xl font-black text-gray-900">₹[Total]</p>
                </div>
              </div>
              
              <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98]">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
