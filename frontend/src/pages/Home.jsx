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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productAPI.getAll({ limit: 8 });
        setFeaturedProducts(response.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <SEO
        title="Samrat Agencies - Furniture Made for Real Life | Bangalore"
        description="Beautiful furniture designed for the way you live. Thoughtfully crafted, honestly priced. From first apartment to forever home—trusted since 1991. Shop sofas, beds, dining tables & more."
        keywords="affordable furniture bangalore, quality furniture, home furniture, modern furniture, samrat agencies, sofas, beds, dining tables, furniture store"
        url="/"
        type="website"
      />
      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        <HeroSection />
        <BannerSection position="section1" />
        <CategoriesSection />
        <BannerSection position="section2" />
        <FeaturedProductsSection products={featuredProducts} loading={loading} />
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
