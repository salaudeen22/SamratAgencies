import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Modal from '../../components/admin/Modal';
import { couponAPI, productAPI, categoryAPI } from '../../services/api';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    applicationType: 'cart',
    applicableProducts: [],
    applicableCategories: [],
    minPurchaseAmount: 0,
    minPurchaseQuantity: 0,
    maxDiscountAmount: null,
    freeShipping: false,
    usageLimit: null,
    usageLimitPerUser: 1,
    userRestriction: 'all',
    specificUsers: [],
    bulkPurchaseRules: [],
    startDate: '',
    endDate: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getAllCoupons({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });
      setCoupons(response.data.coupons);
      setTotalPages(response.data.pages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll({ limit: 1000 });
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.code || !form.description || !form.discountValue || !form.startDate || !form.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(form.startDate) >= new Date(form.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      const couponData = {
        ...form,
        maxDiscountAmount: form.maxDiscountAmount || undefined,
        usageLimit: form.usageLimit || undefined
      };

      if (editingCoupon) {
        await couponAPI.updateCoupon(editingCoupon._id, couponData);
        toast.success('Coupon updated successfully');
      } else {
        await couponAPI.createCoupon(couponData);
        toast.success('Coupon created successfully');
      }
      fetchCoupons();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      applicationType: coupon.applicationType,
      applicableProducts: coupon.applicableProducts?.map(p => p._id) || [],
      applicableCategories: coupon.applicableCategories?.map(c => c._id) || [],
      minPurchaseAmount: coupon.minPurchaseAmount,
      minPurchaseQuantity: coupon.minPurchaseQuantity,
      maxDiscountAmount: coupon.maxDiscountAmount || '',
      freeShipping: coupon.freeShipping,
      usageLimit: coupon.usageLimit || '',
      usageLimitPerUser: coupon.usageLimitPerUser,
      userRestriction: coupon.userRestriction,
      specificUsers: coupon.specificUsers || [],
      bulkPurchaseRules: coupon.bulkPurchaseRules || [],
      startDate: coupon.startDate?.split('T')[0],
      endDate: coupon.endDate?.split('T')[0],
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await couponAPI.deleteCoupon(id);
      fetchCoupons();
      toast.success('Coupon deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setForm({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      applicationType: 'cart',
      applicableProducts: [],
      applicableCategories: [],
      minPurchaseAmount: 0,
      minPurchaseQuantity: 0,
      maxDiscountAmount: null,
      freeShipping: false,
      usageLimit: null,
      usageLimitPerUser: 1,
      userRestriction: 'all',
      specificUsers: [],
      bulkPurchaseRules: [],
      startDate: '',
      endDate: '',
      isActive: true
    });
    setEditingCoupon(null);
    setShowModal(false);
  };

  const filteredCoupons = coupons;

  return (
    <AdminLayout>
      <PageHeader
        title="Coupons"
        subtitle="Manage discount coupons and promotional codes"
        action={
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: '#816047' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D7B790'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#816047'}
          >
            Create Coupon
          </button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-96 px-4 py-2 border-2 rounded-md focus:outline-none"
          style={{ borderColor: '#D7B790' }}
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ border: '2px solid #D7B790' }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2" style={{ borderColor: '#D7B790' }}>
            <thead style={{ backgroundColor: '#E6CDB1' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Valid Until</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#2F1A0F' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#D7B790' }}>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    No coupons found
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold" style={{ color: '#2F1A0F' }}>{coupon.code}</div>
                      <div className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>{coupon.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#816047' }}>
                      <span className="font-semibold">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: '#E6CDB1', color: '#2F1A0F' }}>
                        {coupon.applicationType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#2F1A0F' }}>
                      {coupon.usedCount} / {coupon.usageLimit || '∞'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {coupon.isActive && new Date(coupon.endDate) > new Date() ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="mr-3 transition"
                        style={{ color: '#816047' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: '2px solid #D7B790' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md disabled:opacity-50"
              style={{ backgroundColor: '#816047', color: 'white' }}
            >
              Previous
            </button>
            <span style={{ color: '#2F1A0F' }}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md disabled:opacity-50"
              style={{ backgroundColor: '#816047', color: 'white' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Coupon Code *</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none uppercase"
                style={{ borderColor: '#D7B790' }}
                required
                disabled={editingCoupon}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Discount Type *</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#D7B790' }}
              rows="2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>
                Discount Value * {form.discountType === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Max Discount (₹)</label>
              <input
                type="number"
                value={form.maxDiscountAmount}
                onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                min="0"
                placeholder="No limit"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Application Type</label>
            <select
              value={form.applicationType}
              onChange={(e) => setForm({ ...form, applicationType: e.target.value })}
              className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
              style={{ borderColor: '#D7B790' }}
            >
              <option value="cart">Cart Level</option>
              <option value="product">Product Level</option>
              <option value="category">Category Level</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Min Purchase Amount (₹)</label>
              <input
                type="number"
                value={form.minPurchaseAmount}
                onChange={(e) => setForm({ ...form, minPurchaseAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Min Purchase Quantity</label>
              <input
                type="number"
                value={form.minPurchaseQuantity}
                onChange={(e) => setForm({ ...form, minPurchaseQuantity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Total Usage Limit</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                min="0"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Usage Limit Per User</label>
              <input
                type="number"
                value={form.usageLimitPerUser}
                onChange={(e) => setForm({ ...form, usageLimitPerUser: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2F1A0F' }}>End Date *</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 border-2 rounded-md focus:outline-none"
                style={{ borderColor: '#D7B790' }}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.freeShipping}
                onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm" style={{ color: '#2F1A0F' }}>Free Shipping</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm" style={{ color: '#2F1A0F' }}>Active</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-md"
              style={{ backgroundColor: '#E6CDB1', color: '#2F1A0F' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md"
              style={{ backgroundColor: '#816047', color: 'white' }}
            >
              {editingCoupon ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Coupons;
