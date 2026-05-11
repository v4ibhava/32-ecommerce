import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import SearchBox from '../components/SearchBox';
import Pagination from '../components/Pagination';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const { data } = await axios.get(`${apiUrl}/api/products?keyword=${keyword}&pageNumber=${page}`);
      setProducts(data.products);
      setPages(data.pages);
      setPage(data.page);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, page]);

  const handleSearch = (query) => {
    setKeyword(query);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            High-Performance <br/>
            <span className="text-blue-600">ESP32 Modules</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            The world's most versatile IoT chips for your next big project. 
            From development kits to production-ready modules.
          </p>
          <SearchBox onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium italic">Scanning for silicon...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-xl text-gray-500">No chips found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            <Pagination 
              pages={pages} 
              page={page} 
              onPageChange={(p) => setPage(p)} 
            />
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-6 text-gray-500 font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <p className="text-gray-500">© 2026 ESP32 Shop. Built with precision for the IoT community.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
