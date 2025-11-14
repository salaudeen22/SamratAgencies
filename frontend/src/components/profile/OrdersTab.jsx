import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import OrderCard from './OrderCard';
import OrderDetailModal from './OrderDetailModal';
import Pagination from './Pagination';

const OrdersTab = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when component mounts
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase();
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[statusLower] || 'bg-gray-100 text-gray-800';
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  // Pagination calculation
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: '#1F2D38' }}>Order History</h2>
        <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>View and track your orders</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 mx-auto" style={{ borderColor: '#895F42' }}></div>
          <p className="mt-4 text-sm sm:text-base" style={{ color: '#94A1AB' }}>Loading orders...</p>
        </div>
      ) : orders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={handleViewOrder}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={orders.length}
            itemsPerPage={ordersPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-base sm:text-lg mb-4" style={{ color: '#94A1AB' }}>No orders yet</p>
          <button
            onClick={() => navigate('/products')}
            className="font-semibold transition text-sm sm:text-base"
            style={{ color: '#895F42' }}
          >
            Start Shopping
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={showOrderDetail}
        onClose={() => setShowOrderDetail(false)}
        order={selectedOrder}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default OrdersTab;
