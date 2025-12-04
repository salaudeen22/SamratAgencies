import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleAPI } from '../services/api';
import SEO from '../components/SEO';
import { FiCalendar, FiClock, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import DOMPurify from 'dompurify';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
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
      console.log('Article fetched:', response.data);
      console.log('Gallery images:', response.data.images);
      setArticle(response.data);

      // Fetch related articles (same category, exclude current)
      if (response.data.category) {
        const relatedResponse = await articleAPI.getAll({
          category: response.data.category,
          limit: 3
        });
        setRelatedArticles(
          relatedResponse.data.articles.filter(a => a._id !== response.data._id).slice(0, 3)
        );
      }
    } catch (err) {
      console.error('Failed to fetch article:', err);
      if (err.response?.status === 404) {
        // Navigate to 404 page if article not found
        navigate('/404', { replace: true });
      }
      setError('Article not found');
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `https://samratagencies.in/blog/${slug}`;
  const shareTitle = article?.title || 'Check out this article';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
  };

  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" style={{ borderColor: '#816047' }}></div>
          <p className="mt-6 text-lg text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2F1A0F' }}>Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#816047' }}
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
            style={{ color: '#816047' }}
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
                  style={{ backgroundColor: '#f0f9ff', color: '#816047' }}
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#2F1A0F' }}>
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
                className="prose prose-lg max-w-none article-content"
                style={{
                  color: '#334155',
                  lineHeight: '1.8'
                }}
                dangerouslySetInnerHTML={createMarkup(article.content)}
              />

              {/* Gallery Images */}
              {article.images && article.images.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#2F1A0F' }}>Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {article.images.filter(img => img && (img.url || (typeof img === 'string'))).map((image, index) => {
                      const imageUrl = typeof image === 'string' ? image : image.url;
                      return (
                        <div key={index} className="rounded-lg overflow-hidden shadow-md">
                          <img
                            src={imageUrl}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.error('Failed to load gallery image:', imageUrl);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-1" style={{ color: '#2F1A0F' }}>
                      <FiShare2 className="inline w-4 h-4 mr-2" />
                      Share this article
                    </h3>
                    <p className="text-sm text-gray-500">
                      Help others discover this content
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={shareLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-blue-100 transition-colors"
                      style={{ color: '#1877F2' }}
                      title="Share on Facebook"
                    >
                      <FaFacebook className="w-5 h-5" />
                    </a>
                    <a
                      href={shareLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-blue-100 transition-colors"
                      style={{ color: '#1DA1F2' }}
                      title="Share on Twitter"
                    >
                      <FaTwitter className="w-5 h-5" />
                    </a>
                    <a
                      href={shareLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-blue-100 transition-colors"
                      style={{ color: '#0A66C2' }}
                      title="Share on LinkedIn"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full hover:bg-green-100 transition-colors"
                      style={{ color: '#25D366' }}
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#2F1A0F' }}>
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle._id}
                    to={`/blog/${relatedArticle.slug || relatedArticle._id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                  >
                    {relatedArticle.featuredImage?.url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedArticle.featuredImage.url}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#f0f9ff', color: '#816047' }}
                      >
                        {relatedArticle.category}
                      </span>
                      <h3 className="text-lg font-bold mt-3 mb-2 group-hover:text-[#816047] transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Button */}
          <div className="mt-12 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#816047' }}
            >
              <FiArrowLeft />
              View More Articles
            </Link>
          </div>
        </div>
      </div>

      {/* Styles for article content */}
      <style>{`
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          color: #2F1A0F;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .article-content h1 { font-size: 2.25rem; }
        .article-content h2 { font-size: 1.875rem; }
        .article-content h3 { font-size: 1.5rem; }
        .article-content h4 { font-size: 1.25rem; }

        .article-content p {
          margin-bottom: 1rem;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .article-content a {
          color: #816047;
          text-decoration: underline;
        }

        .article-content a:hover {
          opacity: 0.8;
        }

        .article-content ul,
        .article-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content blockquote {
          border-left: 4px solid #816047;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #64748b;
        }

        .article-content code {
          background-color: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Courier New', monospace;
        }

        .article-content pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .article-content pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .article-content table th,
        .article-content table td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
        }

        .article-content table th {
          background-color: #f8fafc;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default BlogArticle;
