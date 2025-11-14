import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Modal from '../../components/admin/Modal';
import { deliveryAPI } from '../../services/api';

const DeliveryZones = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    zoneType: 'pincode',
    pincodes: '',
    cities: '',
    states: '',
    deliveryCharge: 0,
    freeDeliveryThreshold: '',
    estimatedDays: { min: 3, max: 7 },
    codAvailable: true,
    priority: 999,
    isActive: true
  });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await deliveryAPI.getAllZones();
      setZones(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch delivery zones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.deliveryCharge) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const zoneData = {
        ...form,
        pincodes: form.pincodes ? form.pincodes.split(',').map(p => p.trim()).filter(Boolean) : [],
        cities: form.cities ? form.cities.split(',').map(c => c.trim()).filter(Boolean) : [],
        states: form.states ? form.states.split(',').map(s => s.trim()).filter(Boolean) : [],
        freeDeliveryThreshold: form.freeDeliveryThreshold || null,
      };

      if (editingZone) {
        await deliveryAPI.updateZone(editingZone._id, zoneData);
        toast.success('Delivery zone updated successfully');
      } else {
        await deliveryAPI.createZone(zoneData);
        toast.success('Delivery zone created successfully');
      }
      fetchZones();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save delivery zone');
    }
  };

  const handleEdit = (zone) => {
    setEditingZone(zone);
    setForm({
      name: zone.name,
      description: zone.description || '',
      zoneType: zone.zoneType,
      pincodes: zone.pincodes?.join(', ') || '',
      cities: zone.cities?.join(', ') || '',
      states: zone.states?.join(', ') || '',
      deliveryCharge: zone.deliveryCharge,
      freeDeliveryThreshold: zone.freeDeliveryThreshold || '',
      estimatedDays: zone.estimatedDays || { min: 3, max: 7 },
      codAvailable: zone.codAvailable,
      priority: zone.priority,
      isActive: zone.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivery zone?')) return;

    try {
      await deliveryAPI.deleteZone(id);
      fetchZones();
      toast.success('Delivery zone deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete delivery zone');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      zoneType: 'pincode',
      pincodes: '',
      cities: '',
      states: '',
      deliveryCharge: 0,
      freeDeliveryThreshold: '',
      estimatedDays: { min: 3, max: 7 },
      codAvailable: true,
      priority: 999,
      isActive: true
    });
    setEditingZone(null);
    setShowModal(false);
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Delivery Zones"
        subtitle="Manage delivery zones and shipping charges"
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
            Create Zone
          </button>
        }
      />

      {/* Zones Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ border: '2px solid #BDD7EB' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2" style={{ borderColor: '#BDD7EB' }}>
            <thead style={{ backgroundColor: '#E0EAF0' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Zone Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Delivery Charge</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Free Delivery At</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Estimated Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#1F2D38' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#BDD7EB' }}>
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center" style={{ color: '#94A1AB' }}>
                    Loading...
                  </td>
                </tr>
              ) : zones.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center" style={{ color: '#94A1AB' }}>
                    No delivery zones found
                  </td>
                </tr>
              ) : (
                zones.map((zone) => (
                  <tr key={zone._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold" style={{ color: '#1F2D38' }}>{zone.name}</div>
                      {zone.description && (
                        <div className="text-sm" style={{ color: '#94A1AB' }}>{zone.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}>
                        {zone.zoneType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#895F42' }}>
                      <span className="font-semibold">₹{zone.deliveryCharge}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#1F2D38' }}>
                      {zone.freeDeliveryThreshold ? `₹${zone.freeDeliveryThreshold}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#1F2D38' }}>
                      {zone.estimatedDays?.min || 3}-{zone.estimatedDays?.max || 7} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#1F2D38' }}>
                      {zone.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {zone.isActive ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(zone)}
                        className="mr-3 transition"
                        style={{ color: '#895F42' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(zone._id)}
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
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingZone ? 'Edit Delivery Zone' : 'Create Delivery Zone'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Zone Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#BDD7EB' }}
              placeholder="e.g., Mumbai City, Maharashtra"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#BDD7EB' }}
              rows="2"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Zone Type</label>
            <select
              value={form.zoneType}
              onChange={(e) => setForm({ ...form, zoneType: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#BDD7EB' }}
            >
              <option value="pincode">Pincode</option>
              <option value="city">City</option>
              <option value="state">State</option>
              <option value="country">Country</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>
              Pincodes (comma-separated)
            </label>
            <input
              type="text"
              value={form.pincodes}
              onChange={(e) => setForm({ ...form, pincodes: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#BDD7EB' }}
              placeholder="e.g., 400001, 400002-400050, 4000*"
            />
            <p className="text-xs mt-1" style={{ color: '#94A1AB' }}>
              Supports exact match (400001), ranges (400001-400050), and wildcards (4000*)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Cities (comma-separated)</label>
              <input
                type="text"
                value={form.cities}
                onChange={(e) => setForm({ ...form, cities: e.target.value })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="e.g., Mumbai, Pune"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>States (comma-separated)</label>
              <input
                type="text"
                value={form.states}
                onChange={(e) => setForm({ ...form, states: e.target.value })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#BDD7EB' }}
                placeholder="e.g., Maharashtra, Gujarat"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Delivery Charge (₹) *</label>
              <input
                type="number"
                value={form.deliveryCharge}
                onChange={(e) => setForm({ ...form, deliveryCharge: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#BDD7EB' }}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Free Delivery Threshold (₹)</label>
              <input
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value ? parseFloat(e.target.value) : '' })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#BDD7EB' }}
                min="0"
                placeholder="No free delivery"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Min Delivery Days</label>
              <input
                type="number"
                value={form.estimatedDays.min}
                onChange={(e) => setForm({ ...form, estimatedDays: { ...form.estimatedDays, min: parseInt(e.target.value) || 3 } })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#BDD7EB' }}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Max Delivery Days</label>
              <input
                type="number"
                value={form.estimatedDays.max}
                onChange={(e) => setForm({ ...form, estimatedDays: { ...form.estimatedDays, max: parseInt(e.target.value) || 7 } })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#BDD7EB' }}
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#1F2D38' }}>Priority (lower = higher priority)</label>
            <input
              type="number"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 999 })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#BDD7EB' }}
              min="1"
            />
            <p className="text-xs mt-1" style={{ color: '#94A1AB' }}>
              When multiple zones match, the one with lowest priority number wins
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.codAvailable}
                onChange={(e) => setForm({ ...form, codAvailable: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm" style={{ color: '#1F2D38' }}>COD Available</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm" style={{ color: '#1F2D38' }}>Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-md"
              style={{ backgroundColor: '#E0EAF0', color: '#1F2D38' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md"
              style={{ backgroundColor: '#895F42', color: 'white' }}
            >
              {editingZone ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default DeliveryZones;
