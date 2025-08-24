
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, Category, Division } from './types';
import { getProducts, simulatePriceUpdate } from './services/productService';
import { CATEGORIES, DIVISIONS } from './constants';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryTabs from './components/CategoryTabs';
import ProductList from './components/ProductList';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<Division>(DIVISIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialProducts = await getProducts();
      setProducts(initialProducts);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setProducts(prevProducts => simulatePriceUpdate(prevProducts, selectedDivision));
      setLastUpdated(new Date());
    }, 20000); // Simulate update every 20 seconds for demo

    return () => clearInterval(updateInterval);
  }, [selectedDivision]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
      .filter(product =>
        product.name_bn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name_en.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, selectedCategory, searchTerm]);

  const handleDivisionChange = useCallback((division: Division) => {
    setSelectedDivision(division);
    setProducts(prevProducts => simulatePriceUpdate(prevProducts, division));
    setLastUpdated(new Date());
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <Header
          selectedDivision={selectedDivision}
          onDivisionChange={handleDivisionChange}
          lastUpdated={lastUpdated}
        />
        <div className="container mx-auto px-4 pb-4">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <CategoryTabs
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <main className="container mx-auto p-4">
        <ProductList products={filteredProducts} />
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>বাংলাদেশ বাজার মূল্য ট্র্যাকার</p>
        <p>&copy; {new Date().getFullYear()}. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
