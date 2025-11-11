import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { adminAPI, uploadAPI } from '../../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributeSets, setAttributeSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    attributeSet: '',
    specifications: {},
    price: '',
    stock: '',
    sku: '',
    brand: '',
    featured: false,
    images: []
  });

  const [selectedAttributeSet, setSelectedAttributeSet] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes, attributeSetsRes] = await Promise.all([
        adminAPI.getProducts({ limit: 100 }),
        adminAPI.getCategories(),
        adminAPI.getAttributeSets()
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data);
      setAttributeSets(attributeSetsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert specifications object to proper format for backend
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, submitData);
      } else {
        await adminAPI.createProduct(submitData);
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    // Find the attribute set
    const attrSet = attributeSets.find(set => set._id === product.attributeSet?._id || set._id === product.attributeSet);
    setSelectedAttributeSet(attrSet || null);

    // Convert specifications Map to object
    const specs = {};
    if (product.specifications) {
      if (typeof product.specifications === 'object') {
        Object.entries(product.specifications).forEach(([key, value]) => {
          specs[key] = value;
        });
      }
    }

    setFormData({
      name: product.name,
      description: product.description,
      category: product.category?._id || product.category || '',
      subcategory: product.subcategory || '',
      attributeSet: product.attributeSet?._id || product.attributeSet || '',
      specifications: specs,
      price: product.price || '',
      stock: product.stock || '',
      sku: product.sku || '',
      brand: product.brand || '',
      featured: product.featured || false,
      images: product.images || []
    });
    setPrimaryImageIndex(0);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleAttributeSetChange = (setId) => {
    const attrSet = attributeSets.find(s => s._id === setId);
    setSelectedAttributeSet(attrSet || null);
    setFormData({
      ...formData,
      attributeSet: setId,
      specifications: {} // Reset specifications when changing attribute set
    });
  };

  const handleSpecificationChange = (attrCode, value) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [attrCode]: value
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      subcategory: '',
      attributeSet: '',
      specifications: {},
      price: '',
      stock: '',
      sku: '',
      brand: '',
      featured: false,
      images: []
    });
    setSelectedAttributeSet(null);
    setEditingProduct(null);
    setPrimaryImageIndex(0);
    setUploadingImages(false);
    setShowModal(false);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check if adding these files would exceed 5 images
    if (formData.images.length + files.length > 5) {
      alert('Maximum 5 images allowed per product');
      return;
    }

    setUploadingImages(true);
    try {
      const uploadedImages = [];

      for (const file of files) {
        const response = await uploadAPI.uploadImage(file);
        uploadedImages.push({
          url: response.data.file.url,
          public_id: response.data.file.key
        });
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedImages]
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index) => {
    const image = formData.images[index];

    if (window.confirm('Remove this image?')) {
      try {
        // Delete from S3
        await uploadAPI.deleteImage(image.public_id);

        // Remove from form data
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });

        // Adjust primary image index if needed
        if (primaryImageIndex >= newImages.length) {
          setPrimaryImageIndex(Math.max(0, newImages.length - 1));
        }
      } catch (error) {
        alert('Failed to remove image');
      }
    }
  };

  const handleSetPrimaryImage = (index) => {
    // Move the selected image to the first position
    const newImages = [...formData.images];
    const [primaryImage] = newImages.splice(index, 1);
    newImages.unshift(primaryImage);

    setFormData({ ...formData, images: newImages });
    setPrimaryImageIndex(0);
  };

  const renderSpecificationField = (attr) => {
    const attribute = attr.attribute;
    if (!attribute) return null;

    const value = formData.specifications[attribute.code] || '';
    const isRequired = attr.isRequired;

    switch (attribute.inputType) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder={attribute.helpText || ''}
            required={isRequired}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder={attribute.unit ? `in ${attribute.unit}` : ''}
            required={isRequired}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows="3"
            placeholder={attribute.helpText || ''}
            required={isRequired}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required={isRequired}
          >
            <option value="">Select {attribute.name}</option>
            {attribute.options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <select
            multiple
            value={Array.isArray(value) ? value : (value ? [value] : [])}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              handleSpecificationChange(attribute.code, selected);
            }}
            className="w-full px-3 py-2 border rounded-lg"
            required={isRequired}
          >
            {attribute.options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full h-10 px-3 py-2 border rounded-lg"
            required={isRequired}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value === 'true' || value === true}
              onChange={(e) => handleSpecificationChange(attribute.code, e.target.checked.toString())}
              className="w-4 h-4"
            />
            <span className="text-sm">Yes</span>
          </label>
        );

      case 'dimension':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="e.g., 120×80×75"
            required={isRequired}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleSpecificationChange(attribute.code, e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required={isRequired}
          />
        );
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat._id === formData.category);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold">Products Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm lg:text-base"
          >
            Add Product
          </button>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
          size="xlarge"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-semibold text-md mb-3 text-gray-700 border-b pb-2">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Brand</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SKU</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Product SKU"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {getSelectedCategory()?.subcategories?.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Subcategory</label>
                      <select
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select Subcategory</option>
                        {getSelectedCategory().subcategories.map((sub) => (
                          <option key={sub._id} value={sub.slug}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-1">Attribute Set (Product Type) *</label>
                    <select
                      value={formData.attributeSet}
                      onChange={(e) => handleAttributeSetChange(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select Product Type</option>
                      {attributeSets.map((set) => (
                        <option key={set._id} value={set._id}>
                          {set.name}
                        </option>
                      ))}
                    </select>
                    {selectedAttributeSet?.description && (
                      <p className="text-xs text-gray-500 mt-1">{selectedAttributeSet.description}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div>
                <h4 className="font-semibold text-md mb-3 text-gray-700 border-b pb-2">Product Images (Max 5)</h4>
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div>
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages || formData.images.length >= 5}
                        className="hidden"
                      />
                      {uploadingImages ? 'Uploading...' : formData.images.length >= 5 ? 'Maximum images reached' : '+ Add Images'}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG, GIF, WEBP (Max 5MB per image)
                    </p>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />

                          {/* Primary Badge */}
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(index)}
                                className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded"
                                title="Set as primary"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                              title="Remove image"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.images.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">No images uploaded yet</p>
                      <p className="text-sm text-gray-400 mt-1">First image will be used as primary thumbnail</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Specifications */}
              {selectedAttributeSet && selectedAttributeSet.attributes && selectedAttributeSet.attributes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-md mb-3 text-gray-700 border-b pb-2">
                    Specifications ({selectedAttributeSet.name})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAttributeSet.attributes.map((attr, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium mb-1">
                          {attr.attribute?.name}
                          {attr.isRequired && <span className="text-red-500 ml-1">*</span>}
                          {attr.attribute?.unit && <span className="text-gray-500 text-xs ml-1">({attr.attribute.unit})</span>}
                        </label>
                        {renderSpecificationField(attr)}
                        {attr.attribute?.helpText && (
                          <p className="text-xs text-gray-500 mt-1">{attr.attribute.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing & Inventory */}
              <div>
                <h4 className="font-semibold text-md mb-3 text-gray-700 border-b pb-2">Pricing & Inventory</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock Quantity *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">Featured Product</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
        </Modal>

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.category?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                            {product.attributeSet?.name || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No products found</div>
                )}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </div>
                    {product.featured && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium">{product.category?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <p className="font-medium text-xs">{product.attributeSet?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <p className="font-medium">₹{product.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Stock:</span>
                      <p className="font-medium">{product.stock} units</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">No products found</div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
