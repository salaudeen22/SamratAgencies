import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import { adminAPI } from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    searchQuery: '',
    startDate: '',
    endDate: ''
  });
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filters.status) params.status = filters.status;

      const response = await adminAPI.getOrders(params);
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.user?.name?.toLowerCase().includes(query) ||
        order.user?.email?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query)
      );
    }

    // Payment status filter
    if (filters.paymentStatus) {
      const isPaid = filters.paymentStatus === 'paid';
      filtered = filtered.filter(order => order.isPaid === isPaid);
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(order =>
        new Date(order.createdAt) <= new Date(filters.endDate + 'T23:59:59')
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      paymentStatus: '',
      searchQuery: '',
      startDate: '',
      endDate: ''
    });
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedOrders.length === 0) {
      toast.error('No orders selected');
      return;
    }

    try {
      await Promise.all(
        selectedOrders.map(orderId =>
          adminAPI.updateOrderStatus(orderId, { status })
        )
      );
      toast.success(`Updated ${selectedOrders.length} orders to ${status}`);
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update orders');
    }
  };

  const toggleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order._id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Status', 'Payment', 'Total', 'Date'];
    const rows = filteredOrders.map(order => [
      order._id,
      order.user?.name || 'Unknown',
      order.user?.email || '',
      order.status,
      order.isPaid ? 'Paid' : 'Pending',
      order.totalPrice,
      new Date(order.createdAt).toLocaleDateString('en-IN')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully');
  };

  const downloadInvoice = (order) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - ${order._id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #816047; padding-bottom: 20px; }
          .company-name { font-size: 28px; font-weight: bold; color: #816047; margin-bottom: 5px; }
          .invoice-title { font-size: 20px; color: #333; margin-top: 10px; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-block { flex: 1; }
          .info-block h3 { font-size: 14px; color: #666; margin-bottom: 8px; }
          .info-block p { margin: 4px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total-section { text-align: right; margin-top: 20px; }
          .total-row { display: flex; justify-content: flex-end; margin: 8px 0; }
          .total-label { width: 150px; font-weight: bold; }
          .total-value { width: 120px; text-align: right; }
          .grand-total { font-size: 18px; color: #816047; border-top: 2px solid #816047; padding-top: 10px; margin-top: 10px; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">Samrat Agencies</div>
          <div class="invoice-title">INVOICE</div>
          <p style="margin: 5px 0; font-size: 13px;">Order ID: ${order._id}</p>
          <p style="margin: 5px 0; font-size: 13px;">Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
        </div>

        <div class="info-section">
          <div class="info-block">
            <h3>BILL TO:</h3>
            <p><strong>${order.user?.name || 'N/A'}</strong></p>
            <p>${order.user?.email || ''}</p>
            <p>${order.user?.phone || ''}</p>
          </div>
          <div class="info-block">
            <h3>SHIP TO:</h3>
            <p>${order.shippingAddress?.name || order.user?.name || 'N/A'}</p>
            <p>${order.shippingAddress?.address || order.shippingAddress?.street || ''}</p>
            <p>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''}</p>
            <p>${order.shippingAddress?.pincode || order.shippingAddress?.zipCode || ''}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price?.toLocaleString()}</td>
                <td>₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div class="total-value">₹${order.itemsPrice?.toLocaleString() || '0'}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Shipping:</div>
            <div class="total-value">₹${order.shippingPrice?.toLocaleString() || '0'}</div>
          </div>
          <div class="total-row">
            <div class="total-label">Tax:</div>
            <div class="total-value">₹${order.taxPrice?.toLocaleString() || '0'}</div>
          </div>
          <div class="total-row grand-total">
            <div class="total-label">Grand Total:</div>
            <div class="total-value">₹${order.totalPrice?.toLocaleString() || '0'}</div>
          </div>
        </div>

        <div class="footer">
          <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase()}</p>
          <p><strong>Payment Status:</strong> ${order.isPaid ? 'PAID' : 'PENDING'}</p>
          <p style="margin-top: 20px;">Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order._id}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Invoice downloaded');
  };

  const viewDetails = async (orderId) => {
    try {
      const response = await adminAPI.getOrderById(orderId);
      setSelectedOrder(response.data);
      setShowDetails(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch order details');
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const statusData = { status };
      if (status === 'Delivered') {
        statusData.isDelivered = true;
      }
      await adminAPI.updateOrderStatus(orderId, statusData);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        viewDetails(orderId);
      }
      toast.success(`Order status updated to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const togglePaymentStatus = async (orderId) => {
    try {
      await adminAPI.togglePaymentStatus(orderId);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        viewDetails(orderId);
      }
      toast.success('Payment status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const cancelOrder = async (orderId) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;

    try {
      await adminAPI.cancelOrder(orderId, { cancellationReason: reason });
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        viewDetails(orderId);
      }
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Orders Management"
        subtitle={`Manage and track all ${filteredOrders.length} orders`}
        action={
          <div className="flex gap-2">
            {showDetails && (
              <button
                onClick={() => setShowDetails(false)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#64748b' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to List
              </button>
            )}
            <button
              onClick={exportToCSV}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#816047' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d4a35'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#816047'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search by customer, email, order ID..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">From Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">To Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm font-medium text-blue-900">
              {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleBulkStatusUpdate(status)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Mark as {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#816047' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-red-600 mb-2">Error loading orders</p>
          <p className="text-sm" style={{ color: '#64748b' }}>{error}</p>
        </div>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Orders List */}
            <div className={`bg-white rounded-lg shadow overflow-hidden ${showDetails ? 'hidden lg:block' : ''}`}>
              <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <h3 className="font-semibold text-sm lg:text-base">All Orders ({filteredOrders.length})</h3>
                </div>
              </div>
              <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                {filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                      selectedOrder?._id === order._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectOrder(order._id);
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => viewDetails(order._id)}>
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{order.user?.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600 truncate">{order.user?.email}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded flex-shrink-0 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm gap-2">
                          <span className="text-gray-600">{order.items?.length || 0} items</span>
                          <span className="font-semibold">₹{order.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No orders found</div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className={`bg-white rounded-lg shadow ${showDetails ? 'block' : 'hidden lg:block'}`}>
              {showDetails && selectedOrder ? (
                <div className="lg:relative">
                  <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b flex justify-between items-center sticky top-0 z-10">
                    <h3 className="font-semibold text-sm lg:text-base">Order Details</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadInvoice(selectedOrder)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                      </button>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="hidden lg:block text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6 max-h-[calc(100vh-200px)] lg:max-h-[600px] overflow-y-auto">
                    {/* Customer Info */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Customer</h4>
                      <p className="text-sm">{selectedOrder.user?.name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.user?.phone}</p>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p className="text-sm">{selectedOrder.shippingAddress?.street}</p>
                      <p className="text-sm">
                        {selectedOrder.shippingAddress?.city},{' '}
                        {selectedOrder.shippingAddress?.state}
                      </p>
                      <p className="text-sm">{selectedOrder.shippingAddress?.zipCode}</p>
                      <p className="text-sm">{selectedOrder.shippingAddress?.country}</p>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Items</h4>
                      <div className="space-y-2">
                        {selectedOrder.items?.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-2 border-b"
                          >
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Items Price:</span>
                          <span>₹{selectedOrder.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>₹{selectedOrder.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>₹{selectedOrder.taxPrice}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-base pt-2 border-t">
                          <span>Total:</span>
                          <span>₹{selectedOrder.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Payment</h4>
                      <p className="text-sm">Method: {selectedOrder.paymentMethod}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm">
                          Status:{' '}
                          <span
                            className={
                              selectedOrder.isPaid ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'
                            }
                          >
                            {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </p>
                        <button
                          onClick={() => togglePaymentStatus(selectedOrder._id)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                        >
                          Mark as {selectedOrder.isPaid ? 'Unpaid' : 'Paid'}
                        </button>
                      </div>
                      {selectedOrder.paidAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Paid on: {new Date(selectedOrder.paidAt).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>

                    {/* Status History */}
                    {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Status History</h4>
                        <div className="space-y-2">
                          {selectedOrder.statusHistory.map((history, index) => (
                            <div key={index} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                              <div className="flex justify-between items-start">
                                <span className={`font-medium ${getStatusColor(history.status)} px-2 py-0.5 rounded text-xs`}>
                                  {history.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(history.timestamp).toLocaleString('en-IN')}
                                </span>
                              </div>
                              {history.note && (
                                <p className="text-xs text-gray-600 mt-1">{history.note}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cancellation Info */}
                    {selectedOrder.status === 'Cancelled' && selectedOrder.cancellationReason && (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="font-semibold text-red-800 mb-1 text-sm">Cancellation Details</h4>
                        <p className="text-sm text-red-700">Reason: {selectedOrder.cancellationReason}</p>
                        {selectedOrder.cancelledAt && (
                          <p className="text-xs text-red-600 mt-1">
                            Cancelled on: {new Date(selectedOrder.cancelledAt).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Status Update */}
                    <div>
                      <h4 className="font-semibold mb-3 text-sm lg:text-base">Update Status</h4>
                      <div className="grid grid-cols-2 lg:flex gap-2 lg:gap-3">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateStatus(selectedOrder._id, status)}
                            className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                              selectedOrder.status === status
                                ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-300'
                                : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      {/* Cancel Order Button */}
                      {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                        <button
                          onClick={() => cancelOrder(selectedOrder._id)}
                          className="mt-3 w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select an order to view details
                </div>
              )}
            </div>
          </div>
        )}
    </AdminLayout>
  );
};

export default Orders;
