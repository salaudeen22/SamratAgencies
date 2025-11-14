import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { adminAPI } from '../../services/api';

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const itemsPerPage = 9;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    inputType: 'text',
    options: [],
    unit: '',
    isRequired: false,
    isVariant: false,
    order: 0,
    helpText: ''
  });

  const [optionInput, setOptionInput] = useState({ label: '', value: '' });

  const inputTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select (Dropdown)' },
    { value: 'multiselect', label: 'Multi-Select' },
    { value: 'color', label: 'Color Picker' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'dimension', label: 'Dimensions (L×W×H)' }
  ];

  useEffect(() => {
    fetchAttributes();
  }, []);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAttributes();
      setAttributes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attributes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAttribute) {
        await adminAPI.updateAttribute(editingAttribute._id, formData);
        toast.success('Attribute updated successfully');
      } else {
        await adminAPI.createAttribute(formData);
        toast.success('Attribute created successfully');
      }
      fetchAttributes();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attribute');
    }
  };

  const generateCode = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  };

  const handleNameChange = (name) => {
    setFormData({
      ...formData,
      name,
      code: editingAttribute ? formData.code : generateCode(name)
    });
  };

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      code: attribute.code,
      inputType: attribute.inputType,
      options: attribute.options || [],
      unit: attribute.unit || '',
      isRequired: attribute.isRequired,
      isVariant: attribute.isVariant,
      order: attribute.order || 0,
      helpText: attribute.helpText || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteAttribute(id);
      fetchAttributes();
      toast.success('Attribute deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete attribute');
    }
  };

  const addOption = () => {
    if (optionInput.label && optionInput.value) {
      setFormData({
        ...formData,
        options: [...formData.options, { ...optionInput }]
      });
      setOptionInput({ label: '', value: '' });
    }
  };

  const removeOption = (index) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      inputType: 'text',
      options: [],
      unit: '',
      isRequired: false,
      isVariant: false,
      order: 0,
      helpText: ''
    });
    setEditingAttribute(null);
    setShowModal(false);
    setOptionInput({ label: '', value: '' });
  };

  const needsOptions = ['select', 'multiselect'].includes(formData.inputType);

  // Filter and search attributes
  const filteredAttributes = attributes.filter(attr => {
    const matchesSearch = attr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attr.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || attr.inputType === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttributes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAttributes = filteredAttributes.slice(startIndex, endIndex);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Attributes</h2>
            <p className="text-sm text-gray-600 mt-1">Manage product attributes and specifications</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Attribute
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {inputTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
            <span>
              <strong className="text-gray-900">{filteredAttributes.length}</strong> {filteredAttributes.length === 1 ? 'attribute' : 'attributes'} found
            </span>
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingAttribute ? 'Edit Attribute' : 'Add New Attribute'}
          size="large"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Seating Capacity"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Code *
                    <span className="text-xs text-gray-500 ml-2">(auto-generated from name)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    placeholder="e.g., seating_capacity"
                    required
                    readOnly={!editingAttribute}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Input Type *</label>
                  <select
                    value={formData.inputType}
                    onChange={(e) => setFormData({ ...formData, inputType: e.target.value, options: [] })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  >
                    {inputTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit (optional)</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., cm, kg, inches"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Options for select/multiselect */}
              {needsOptions && (
                <div>
                  <label className="block text-sm font-medium mb-2">Options</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={optionInput.label}
                      onChange={(e) => setOptionInput({ ...optionInput, label: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="Label (e.g., Red)"
                    />
                    <input
                      type="text"
                      value={optionInput.value}
                      onChange={(e) => setOptionInput({ ...optionInput, value: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="Value (e.g., red)"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.options.map((option, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                        {option.label}
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Help Text</label>
                <textarea
                  value={formData.helpText}
                  onChange={(e) => setFormData({ ...formData, helpText: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="2"
                  placeholder="Helpful description for admins"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Required Field</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVariant}
                    onChange={(e) => setFormData({ ...formData, isVariant: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">Can Create Variants</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                  {editingAttribute ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
        </Modal>

        {/* Attributes List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading attributes...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {paginatedAttributes.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">
                  {searchTerm || filterType !== 'all' ? 'No attributes match your filters' : 'No attributes created yet'}
                </p>
                {(searchTerm || filterType !== 'all') ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                    }}
                    className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Create First Attribute
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginatedAttributes.map((attr) => (
                    <div key={attr._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{attr.name}</h3>
                          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{attr.code}</code>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${attr.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {attr.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium text-gray-800">{inputTypes.find(t => t.value === attr.inputType)?.label || attr.inputType}</span>
                        </div>
                        {attr.unit && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-600">Unit:</span>
                            <span className="text-gray-800">{attr.unit}</span>
                          </div>
                        )}
                        {attr.options && attr.options.length > 0 && (
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="text-gray-600">Options:</span>
                            <span className="text-gray-800">{attr.options.length} values</span>
                          </div>
                        )}
                        {attr.helpText && (
                          <p className="text-gray-500 text-xs italic mt-2 pl-6">{attr.helpText}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {attr.isRequired && (
                          <span className="text-xs px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                            Required
                          </span>
                        )}
                        {attr.isVariant && (
                          <span className="text-xs px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            Variant
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <button
                          onClick={() => handleEdit(attr)}
                          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attr._id)}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border rounded-lg p-4">
                    <div className="text-sm text-gray-600">
                      Showing <strong className="text-gray-900">{startIndex + 1}</strong> to <strong className="text-gray-900">{Math.min(endIndex, filteredAttributes.length)}</strong> of <strong className="text-gray-900">{filteredAttributes.length}</strong> attributes
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 rounded-lg border transition-colors ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1.5 rounded-lg border transition-colors min-w-10 ${
                                currentPage === page
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="text-gray-400">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 rounded-lg border transition-colors ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Attributes;
