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

  const [formData, setFormData] = useState({
    name: '',
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

  const handleEdit = (set) => {
    setEditingSet(set);
    setFormData({
      name: set.name,
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

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold">Attribute Sets</h2>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm lg:text-base"
          >
            Add Attribute Set
          </button>
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={resetForm}
          title={editingSet ? 'Edit Attribute Set' : 'Add New Attribute Set'}
          size="large"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Sofa Specifications"
                  required
                />
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
          <div className="text-center py-8">Loading attribute sets...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {attributeSets.map((set) => (
              <div key={set._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{set.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${set.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {set.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {set.description && (
                  <p className="text-gray-600 text-sm mb-3">{set.description}</p>
                )}

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Attributes ({set.attributes?.length || 0}):
                  </p>
                  {set.attributes && set.attributes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {set.attributes.map((attr, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-1 rounded ${
                            attr.isRequired
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {attr.attribute?.name || 'Unknown'}
                          {attr.isRequired && ' *'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs italic">No attributes</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(set)}
                    className="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(set._id)}
                    className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {attributeSets.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">No attribute sets found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AttributeSets;
