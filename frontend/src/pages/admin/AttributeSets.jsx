import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { adminAPI } from '../../services/api';

const AttributeSets = () => {
  const [attributeSets, setAttributeSets] = useState([]);
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    attributes: []
  });

  const [selectedAttributeId, setSelectedAttributeId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [setsResponse, attrsResponse] = await Promise.all([
        adminAPI.getAttributeSets(),
        adminAPI.getAttributes()
      ]);
      setAttributeSets(setsResponse.data);
      setAvailableAttributes(attrsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSet) {
        await adminAPI.updateAttributeSet(editingSet._id, formData);
      } else {
        await adminAPI.createAttributeSet(formData);
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save attribute set');
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
      code: editingSet ? formData.code : generateCode(name)
    });
  };

  const handleEdit = (set) => {
    setEditingSet(set);
    setFormData({
      name: set.name,
      code: set.code,
      description: set.description || '',
      attributes: set.attributes.map(attr => ({
        attribute: attr.attribute._id || attr.attribute,
        isRequired: attr.isRequired || false,
        order: attr.order || 0
      }))
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This attribute set may be used in products.')) {
      try {
        await adminAPI.deleteAttributeSet(id);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete attribute set');
      }
    }
  };

  const addAttributeToSet = () => {
    if (!selectedAttributeId) return;

    // Check if already added
    if (formData.attributes.some(attr => attr.attribute === selectedAttributeId)) {
      alert('This attribute is already in the set');
      return;
    }

    setFormData({
      ...formData,
      attributes: [
        ...formData.attributes,
        {
          attribute: selectedAttributeId,
          isRequired: false,
          order: formData.attributes.length
        }
      ]
    });
    setSelectedAttributeId('');
  };

  const removeAttributeFromSet = (index) => {
    setFormData({
      ...formData,
      attributes: formData.attributes.filter((_, i) => i !== index)
    });
  };

  const updateAttributeInSet = (index, field, value) => {
    const updated = [...formData.attributes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, attributes: updated });
  };

  const moveAttribute = (index, direction) => {
    const newAttributes = [...formData.attributes];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newAttributes.length) return;

    [newAttributes[index], newAttributes[targetIndex]] = [newAttributes[targetIndex], newAttributes[index]];

    // Update order values
    newAttributes.forEach((attr, i) => {
      attr.order = i;
    });

    setFormData({ ...formData, attributes: newAttributes });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      attributes: []
    });
    setEditingSet(null);
    setShowModal(false);
    setSelectedAttributeId('');
  };

  const getAttributeName = (attrId) => {
    const attr = availableAttributes.find(a => a._id === attrId);
    return attr ? attr.name : 'Unknown';
  };

  // Filter and search attribute sets
  const filteredSets = attributeSets.filter(set => {
    return set.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           set.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           set.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination
  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSets = filteredSets.slice(startIndex, endIndex);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Attribute Sets</h2>
            <p className="text-sm text-gray-600 mt-1">Group attributes for different product types</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm lg:text-base"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Attribute Set
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search attribute sets by name, code, or description..."
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

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
            <span>
              <strong className="text-gray-900">{filteredSets.length}</strong> {filteredSets.length === 1 ? 'set' : 'sets'} found
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingSet ? 'Edit Attribute Set' : 'Add New Attribute Set'}
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
                    placeholder="e.g., Sofa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Code *
                    <span className="text-xs text-gray-500 ml-2">(auto-generated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    placeholder="e.g., sofa"
                    required
                    readOnly={!editingSet}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows="2"
                  placeholder="Describe what products use this attribute set"
                />
              </div>

              {/* Add Attributes */}
              <div>
                <label className="block text-sm font-medium mb-2">Attributes in This Set</label>
                <div className="flex gap-2 mb-3">
                  <select
                    value={selectedAttributeId}
                    onChange={(e) => setSelectedAttributeId(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select an attribute...</option>
                    {availableAttributes.map((attr) => (
                      <option key={attr._id} value={attr._id}>
                        {attr.name} ({attr.inputType})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={addAttributeToSet}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Attributes */}
                {formData.attributes.length > 0 ? (
                  <div className="space-y-2">
                    {formData.attributes.map((attr, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => moveAttribute(index, 'up')}
                            disabled={index === 0}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveAttribute(index, 'down')}
                            disabled={index === formData.attributes.length - 1}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex-1">
                          <span className="font-medium">{getAttributeName(attr.attribute)}</span>
                        </div>

                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={attr.isRequired}
                            onChange={(e) => updateAttributeInSet(index, 'isRequired', e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="hidden sm:inline">Required</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => removeAttributeFromSet(index)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No attributes added yet. Add some attributes to this set.</p>
                )}
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                  {editingSet ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
        </Modal>

        {/* Attribute Sets List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading attribute sets...</p>
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
            {paginatedSets.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">
                  {searchTerm ? 'No attribute sets match your search' : 'No attribute sets created yet'}
                </p>
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => setShowModal(true)}
                    className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Create First Attribute Set
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {paginatedSets.map((set) => (
                    <div key={set._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{set.name}</h3>
                          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{set.code}</code>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${set.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {set.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </div>

                      {set.description && (
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{set.description}</p>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                            </svg>
                            Attributes ({set.attributes?.length || 0})
                          </p>
                        </div>
                        {set.attributes && set.attributes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {set.attributes.map((attr, idx) => (
                              <span
                                key={idx}
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                  attr.isRequired
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                                }`}
                              >
                                {attr.attribute?.name || 'Unknown'}
                                {attr.isRequired && ' *'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm italic">No attributes added</p>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <button
                          onClick={() => handleEdit(set)}
                          className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(set._id)}
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
                      Showing <strong className="text-gray-900">{startIndex + 1}</strong> to <strong className="text-gray-900">{Math.min(endIndex, filteredSets.length)}</strong> of <strong className="text-gray-900">{filteredSets.length}</strong> sets
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

export default AttributeSets;
