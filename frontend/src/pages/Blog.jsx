import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import SEO from '../components/SEO';
import logo from '../assets/logo.svg';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Design Tips', 'Home Decor', 'Product Guide', 'Trends', 'Maintenance', 'News', 'Customer Stories'];

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12
      };
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await articleAPI.getAll(params);
      setArticles(response.data.articles);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Blog - Design Tips & Home Decor Ideas | Samrat Agencies"
        description="Discover the latest furniture trends, design tips, and home decor ideas. Expert advice to help you create your perfect living space."
        keywords="furniture blog, home decor tips, design ideas, interior design, furniture trends"
        url="/blog"
      />

      <div className="min-h-screen py-16 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2F1A0F' }}>
              Our Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Inspiration, tips, and trends to help you create the home of your dreams
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === ''
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
              style={selectedCategory === '' ? { backgroundColor: '#816047' } : {}}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:shadow-md'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#816047' } : {}}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#816047' }}></div>
              <p className="mt-6 text-lg text-gray-600">Loading articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No articles found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {articles.map((article) => (
                  <Link
                    key={article._id}
                    to={`/blog/${article.slug || article._id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col"
                  >
                    {article.featuredImage?.url ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.featuredImage.url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-[#816047] to-[#2F1A0F] flex items-center justify-center">
                        <div className="text-center px-6">
                          <svg className="w-16 h-16 mx-auto mb-2 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#f0f9ff', color: '#816047' }}
                        >
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {article.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-[#816047] transition-colors" style={{ color: '#2F1A0F' }}>
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-[#816047] font-medium group-hover:underline">Read More →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
