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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOrders({ limit: 100 });
      setOrders(response.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
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
        subtitle={`Manage and track all ${orders.length} orders`}
        action={
          showDetails && (
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
          )
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#895F42' }}></div>
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
              <div className="px-4 lg:px-6 py-3 lg:py-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-sm lg:text-base">All Orders ({orders.length})</h3>
              </div>
              <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100 ${
                      selectedOrder?._id === order._id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => viewDetails(order._id)}
                  >
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
                ))}
                {orders.length === 0 && (
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
                    <button
                      onClick={() => setShowDetails(false)}
                      className="hidden lg:block text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
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
                      <p className="text-sm">
                        Status:{' '}
                        <span
                          className={
                            selectedOrder.isPaid ? 'text-green-600' : 'text-yellow-600'
                          }
                        >
                          {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </p>
                    </div>

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
