import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import SEO from '../components/SEO';
import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import StatsSection from '../components/home/StatsSection';
import BrandLogosSection from '../components/home/BrandLogosSection';
import PromotionalCards from '../components/home/PromotionalCards';
import TestimonialsSection from '../components/home/TestimonialsSection';
import RecentlyViewedSection from '../components/home/RecentlyViewedSection';
import BannerSection from '../components/home/BannerSection';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productOffset, setProductOffset] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const allProductsResponse = await productAPI.getAll();
        const allProducts = allProductsResponse.data;

        if (allProducts.length === 0) {
          setLoading(false);
          return;
        }

        // Shuffle products to get random selection
        const shuffled = [...allProducts].sort(() => Math.random() - 0.5);

        // Take different slices for different sections
        const offset = productOffset % Math.max(1, allProducts.length - 16);
        setFeaturedProducts(shuffled.slice(offset, offset + 8));
        setNewArrivals(shuffled.slice(offset + 8, offset + 12));
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productOffset]);

  // Rotate products every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProductOffset(prev => prev + 4);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <SEO
        title="Samrat Agencies - Furniture Made for Real Life | Bangalore"
        description="South India's most trusted furniture destination since 1996. Explore 1000+ designs: Premium sofas (₹12K+), storage beds (₹8K+), dining tables, wardrobes, mattresses & more. Serving Bangalore, Chennai, Hyderabad, Kochi. Better prices than IKEA & Royaloak. Free delivery | EMI available | 5⭐ rated."
        keywords="affordable furniture bangalore, quality furniture, home furniture, modern furniture, samrat agencies, sofas, beds, dining tables, furniture store, sofa set bangalore, bed bangalore, mattress bangalore, dining table bangalore, wardrobe bangalore, furniture on emi, better than ikea, royaloak alternative, furniture hongasandra, furniture begur road"
        url="/"
        type="website"
      />
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <HeroSection />
        <BannerSection position="section1" />
        <CategoriesSection />
        <BannerSection position="section2" />
        <FeaturedProductsSection
          featuredProducts={featuredProducts}
          newArrivals={newArrivals}
          loading={loading}
        />
        <BannerSection position="section3" />
        <RecentlyViewedSection />
        <BannerSection position="section4" />
        <StatsSection />
        <BrandLogosSection />
        <PromotionalCards />
        <BannerSection position="section5" />
        <TestimonialsSection />
        <BannerSection position="section6" />
      </div>
    </>
  );
};

export default Home;
