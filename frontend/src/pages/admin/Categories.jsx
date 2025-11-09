import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { adminAPI } from '../../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    isActive: true,
    order: 0
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await adminAPI.updateCategory(editingCategory._id, categoryForm);
      } else {
        await adminAPI.createCategory(categoryForm);
      }
      fetchCategories();
      resetCategoryForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubcategory) {
        await adminAPI.updateSubcategory(selectedCategory._id, editingSubcategory._id, subcategoryForm);
      } else {
        await adminAPI.addSubcategory(selectedCategory._id, subcategoryForm);
      }
      fetchCategories();
      resetSubcategoryForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save subcategory');
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
      order: category.order || 0
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      try {
        await adminAPI.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleEditSubcategory = (category, subcategory) => {
    setSelectedCategory(category);
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || '',
      isActive: subcategory.isActive
    });
    setShowSubcategoryModal(true);
  };

  const handleDeleteSubcategory = async (categoryId, subId) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await adminAPI.deleteSubcategory(categoryId, subId);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete subcategory');
      }
    }
  };

  const handleAddSubcategory = (category) => {
    setSelectedCategory(category);
    setShowSubcategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', isActive: true, order: 0 });
    setEditingCategory(null);
    setShowCategoryModal(false);
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({ name: '', description: '', isActive: true });
    setEditingSubcategory(null);
    setSelectedCategory(null);
    setShowSubcategoryModal(false);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold">Categories Management</h2>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm lg:text-base"
          >
            Add Category
          </button>
        </div>

        {/* Category Modal */}
        <Modal
          isOpen={showCategoryModal}
          onClose={resetCategoryForm}
          title={editingCategory ? 'Edit Category' : 'Add New Category'}
          size="medium"
        >
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetCategoryForm} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Subcategory Modal */}
        <Modal
          isOpen={showSubcategoryModal}
          onClose={resetSubcategoryForm}
          title={`${editingSubcategory ? 'Edit' : 'Add'} Subcategory${selectedCategory ? ' for ' + selectedCategory.name : ''}`}
          size="medium"
        >
          <form onSubmit={handleSubcategorySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subcategoryForm.isActive}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
                {editingSubcategory ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={resetSubcategoryForm} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </Modal>

        {/* Categories List */}
        {loading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 lg:p-6 border-b bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                      <div className="flex gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Order: {category.order}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                          {category.subcategories?.length || 0} Subcategories
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAddSubcategory(category)}
                        className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded"
                      >
                        Add Sub
                      </button>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700">Subcategories:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.subcategories.map((sub) => (
                        <div key={sub._id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{sub.name}</p>
                              {sub.description && (
                                <p className="text-xs text-gray-600 mt-1">{sub.description}</p>
                              )}
                              <span className={`text-xs px-2 py-0.5 rounded mt-2 inline-block ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {sub.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => handleEditSubcategory(category, sub)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteSubcategory(category._id, sub._id)}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500">No categories found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Categories;
