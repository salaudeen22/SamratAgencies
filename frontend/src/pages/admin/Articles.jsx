import { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Samrat Agencies',
    category: 'News',
    tags: [],
    isPublished: false,
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleAPI.getAllAdmin();
      setArticles(response.data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await articleAPI.update(editingArticle._id, formData);
        toast.success('Article updated successfully');
      } else {
        await articleAPI.create(formData);
        toast.success('Article created successfully');
      }
      fetchArticles();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save article');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      author: article.author || 'Samrat Agencies',
      category: article.category || 'News',
      tags: article.tags || [],
      isPublished: article.isPublished || false,
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await articleAPI.delete(id);
      toast.success('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const togglePublish = async (id) => {
    try {
      await articleAPI.togglePublish(id);
      toast.success('Publish status updated');
      fetchArticles();
    } catch (error) {
      toast.error('Failed to update publish status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'Samrat Agencies',
      category: 'News',
      tags: [],
      isPublished: false,
      metaTitle: '',
      metaDescription: '',
    });
    setEditingArticle(null);
    setShowModal(false);
  };

  const categories = ['Design Tips', 'Home Decor', 'Product Guide', 'Trends', 'Maintenance', 'News'];

  return (
    <AdminLayout>
      <PageHeader
        title="Articles"
        subtitle="Manage blog posts and articles"
        action={
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            New Article
          </button>
        }
      />

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No articles found. Create your first article!
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">{article.excerpt}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{article.category}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          article.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{article.views || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm space-x-2">
                        <button
                          onClick={() => togglePublish(article._id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {article.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleEdit(article)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingArticle ? 'Edit Article' : 'New Article'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt *</label>
            <textarea
              required
              maxLength={300}
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Title (SEO)</label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Meta Description (SEO)</label>
            <textarea
              rows={2}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              {editingArticle ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Articles;
