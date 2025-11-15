import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Modal from '../../components/admin/Modal';
import { bannerAPI, uploadAPI } from '../../services/api';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: { url: '', public_id: '' },
    link: '',
    buttonText: 'Shop Now',
    position: 'hero',
    isActive: true,
    order: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await bannerAPI.getAllAdmin();
      setBanners(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadImage(file);
      console.log('Upload response:', response.data);

      // The response structure is { message, file: { url, public_id } }
      const imageData = response.data.file || response.data;

      setForm({ ...form, image: { url: imageData.url, public_id: imageData.public_id } });
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image.url) {
      toast.error('Please upload an image');
      return;
    }

    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const bannerData = {
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined
      };

      if (editingBanner) {
        await bannerAPI.update(editingBanner._id, bannerData);
        toast.success('Banner updated successfully');
      } else {
        await bannerAPI.create(bannerData);
        toast.success('Banner created successfully');
      }
      fetchBanners();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      link: banner.link || '',
      buttonText: banner.buttonText || 'Shop Now',
      position: banner.position,
      isActive: banner.isActive,
      order: banner.order,
      startDate: banner.startDate?.split('T')[0] || '',
      endDate: banner.endDate?.split('T')[0] || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await bannerAPI.delete(id);
      fetchBanners();
      toast.success('Banner deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete banner');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      image: { url: '', public_id: '' },
      link: '',
      buttonText: 'Shop Now',
      position: 'hero',
      isActive: true,
      order: 0,
      startDate: '',
      endDate: ''
    });
    setEditingBanner(null);
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Banners"
        subtitle="Manage homepage promotional banners"
        action={
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: '#895F42' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F8065'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
          >
            Create Banner
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#895F42' }}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No banners found. Create your first banner!</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={banner.image.url}
                      alt={banner.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2D38' }}>
                          {banner.title}
                        </h3>
                        {banner.description && (
                          <p className="text-gray-600 mb-3">{banner.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {banner.position}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Order: {banner.order}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {banner.link && (
                            <p className="mb-1">Link: {banner.link}</p>
                          )}
                          {banner.buttonText && (
                            <p className="mb-1">Button: {banner.buttonText}</p>
                          )}
                          {banner.startDate && (
                            <p className="mb-1">Start: {new Date(banner.startDate).toLocaleDateString()}</p>
                          )}
                          {banner.endDate && (
                            <p className="mb-1">End: {new Date(banner.endDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={resetForm} title={editingBanner ? 'Edit Banner' : 'Create Banner'} size="large">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#895F42' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#895F42' }}
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Banner Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={uploading}
            />
            {uploading && (
              <div className="flex items-center gap-2 mt-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: '#895F42' }}></div>
                <p className="text-sm text-gray-600">Uploading image to S3...</p>
              </div>
            )}
            {form.image.url && (
              <div className="mt-3">
                <p className="text-sm text-green-600 mb-2">✓ Image uploaded successfully</p>
                <img src={form.image.url} alt="Preview" className="h-32 object-cover rounded border" />
              </div>
            )}
            {!form.image.url && !uploading && (
              <p className="text-xs text-gray-500 mt-1">Please upload an image before submitting</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Link URL
            </label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              placeholder="/products or external URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Button Text
            </label>
            <input
              type="text"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Position
            </label>
            <select
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            >
              <option value="hero">Hero</option>
              <option value="promotional">Promotional</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Display Order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              min="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium" style={{ color: '#1F2D38' }}>
              Active
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#895F42' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F8065'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#895F42'}
              disabled={uploading}
            >
              {editingBanner ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Banners;
