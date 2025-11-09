import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Modal from '../../components/admin/Modal';
import { adminAPI } from '../../services/api';

const Attributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
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
      } else {
        await adminAPI.createAttribute(formData);
      }
      fetchAttributes();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save attribute');
    }
  };

  const handleEdit = (attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
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
    if (window.confirm('Are you sure? This attribute may be used in attribute sets.')) {
      try {
        await adminAPI.deleteAttribute(id);
        fetchAttributes();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete attribute');
      }
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

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 lg:mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold">Attributes</h2>
          <button
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm lg:text-base"
          >
            Add Attribute
          </button>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="e.g., Seating Capacity"
                    required
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
          <div className="text-center py-8">Loading attributes...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.map((attr) => (
              <div key={attr._id} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{attr.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${attr.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {attr.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 text-sm mb-3">
                  <p><span className="text-gray-600">Type:</span> <span className="font-medium">{attr.inputType}</span></p>
                  {attr.unit && <p><span className="text-gray-600">Unit:</span> {attr.unit}</p>}
                  {attr.helpText && <p className="text-gray-600 text-xs italic">{attr.helpText}</p>}
                  <div className="flex gap-2">
                    {attr.isRequired && (
                      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 rounded">Required</span>
                    )}
                    {attr.isVariant && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">Variant</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(attr)}
                    className="flex-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(attr._id)}
                    className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {attributes.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">No attributes found</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Attributes;
