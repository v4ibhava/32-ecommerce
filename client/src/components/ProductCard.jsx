import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-xs font-semibold text-blue-600 border border-blue-100">
              {product.category || 'ESP32'}
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
            <span className="block text-[10px] text-gray-400 font-medium tracking-wider uppercase">In Stock: {product.stock}</span>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-900 text-white hover:bg-blue-600 transition-all hover:scale-110 active:scale-95 shadow-lg shadow-gray-200">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
