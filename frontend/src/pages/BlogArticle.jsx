import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';
import SEO from '../components/SEO';
import { FiCalendar, FiClock, FiArrowLeft } from 'react-icons/fi';

const BlogArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleAPI.getBySlug(slug);
      setArticle(response.data);
    } catch (err) {
      console.error('Failed to fetch article:', err);
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#895F42' }}></div>
          <p className="mt-6 text-lg text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1F2D38' }}>Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#895F42' }}
          >
            <FiArrowLeft />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={article.metaTitle || `${article.title} | Samrat Agencies Blog`}
        description={article.metaDescription || article.excerpt}
        keywords={article.metaKeywords?.join(', ')}
        url={`/blog/${article.slug}`}
        image={article.featuredImage?.url}
      />

      <div className="min-h-screen py-12 px-4" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:underline"
            style={{ color: '#895F42' }}
          >
            <FiArrowLeft />
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {article.featuredImage?.url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.featuredImage.url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 md:p-12">
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#f0f9ff', color: '#895F42' }}
                >
                  {article.category}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {new Date(article.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    {article.readTime} min read
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1F2D38' }}>
                {article.title}
              </h1>

              {/* Author */}
              <p className="text-gray-600 mb-8">
                By <span className="font-medium">{article.author}</span>
              </p>

              {/* Excerpt */}
              <p className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b">
                {article.excerpt}
              </p>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none"
                style={{
                  color: '#334155',
                  lineHeight: '1.8'
                }}
              >
                {article.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-gray-500">
                  Share this article with your friends and family!
                </p>
              </div>
            </div>
          </article>

          {/* Back to Blog Button */}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors"
              style={{ backgroundColor: '#895F42' }}
            >
              <FiArrowLeft />
              View More Articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogArticle;
