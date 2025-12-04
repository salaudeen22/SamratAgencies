import { useState, useEffect } from 'react';
import { articleAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import RichTextEditor from '../../components/admin/RichTextEditor';
import TagsInput from '../../components/admin/TagsInput';
import ImageUpload from '../../components/admin/ImageUpload';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    contentType: 'html',
    author: 'Samrat Agencies',
    category: 'News',
    featuredImage: null,
    images: [],
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
      console.log('Submitting article with data:', formData);
      console.log('Gallery images being submitted:', formData.images);

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
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save article');
    }
  };

  const handleEdit = async (article) => {
    try {
      // Fetch full article with content
      const response = await articleAPI.getBySlug(article.slug || article._id);
      const fullArticle = response.data;

      setEditingArticle(fullArticle);
      setFormData({
        title: fullArticle.title || '',
        excerpt: fullArticle.excerpt || '',
        content: fullArticle.content || '',
        contentType: fullArticle.contentType || 'html',
        author: fullArticle.author || 'Samrat Agencies',
        category: fullArticle.category || 'News',
        featuredImage: fullArticle.featuredImage || null,
        images: fullArticle.images || [],
        tags: fullArticle.tags || [],
        isPublished: fullArticle.isPublished || false,
        metaTitle: fullArticle.metaTitle || '',
        metaDescription: fullArticle.metaDescription || '',
      });
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('Failed to load article');
    }
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
      contentType: 'html',
      author: 'Samrat Agencies',
      category: 'News',
      featuredImage: null,
      images: [],
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              required
              maxLength={300}
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the article..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image</label>
            <ImageUpload
              value={formData.featuredImage}
              onChange={(image) => setFormData({ ...formData, featuredImage: image })}
              label="Upload Featured Image"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gallery Images (Optional)</label>
            <ImageUpload
              value={formData.images}
              onChange={(images) => {
                console.log('Gallery images updated:', images);
                setFormData(prev => ({ ...prev, images: images }));
              }}
              multiple
              label="Add Gallery Images"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your article content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagsInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="Add tags (e.g., furniture, design, tips)..."
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold mb-4 text-gray-700">SEO Settings</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty to use article title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave empty to use excerpt"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Publish immediately</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              {editingArticle ? 'Update Article' : 'Create Article'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
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
