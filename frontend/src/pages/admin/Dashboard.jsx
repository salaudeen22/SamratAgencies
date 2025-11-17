import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import StatCard from '../../components/admin/ui/StatCard';
import Card from '../../components/admin/ui/Card';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#816047' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading statistics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600 mb-2">Error loading dashboard</p>
            <p className="text-sm" style={{ color: '#64748b' }}>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Format growth percentage with color
  const formatGrowth = (value) => {
    const num = parseFloat(value);
    if (num > 0) return { text: `+${num}%`, color: '#10b981' };
    if (num < 0) return { text: `${num}%`, color: '#ef4444' };
    return { text: '0%', color: '#64748b' };
  };

  const growth = formatGrowth(stats?.revenueGrowth || 0);

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
      subValue: growth.text,
      subColor: growth.color,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#f59e0b'
    },
    {
      label: 'Gross Profit',
      value: `₹${(stats?.grossProfit || 0).toLocaleString()}`,
      subValue: `${stats?.grossProfitMargin || 0}% margin`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: '#059669'
    },
    {
      label: "Today's Sales",
      value: `₹${(stats?.todayRevenue || 0).toLocaleString()}`,
      subValue: `${stats?.todayOrders || 0} orders`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: '#10b981'
    },
    {
      label: 'Avg Order Value',
      value: `₹${(stats?.avgOrderValue || 0).toLocaleString()}`,
      subValue: 'Per order',
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: '#3b82f6'
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      subValue: `${stats?.deliveredOrders || 0} delivered`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: '#8b5cf6'
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      subValue: `${stats?.lowStockProducts || 0} low stock`,
      subColor: stats?.lowStockProducts > 0 ? '#f97316' : '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: '#ec4899'
    },
    {
      label: 'Total Customers',
      value: stats?.totalUsers || 0,
      subValue: `${stats?.repeatCustomerRate || 0}% repeat`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: '#14b8a6'
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      subValue: 'Needs attention',
      subColor: '#f97316',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#f97316'
    },
    {
      label: 'Return Rate',
      value: `${stats?.returnRate || 0}%`,
      subValue: `${stats?.totalReturns || 0} returns`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      color: '#ef4444'
    },
    {
      label: 'Cart Abandonment',
      value: `${stats?.cartAbandonmentRate || 0}%`,
      subValue: `${stats?.totalCarts || 0} carts created`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: '#f59e0b'
    },
    {
      label: 'Cancellation Rate',
      value: `${stats?.cancellationRate || 0}%`,
      subValue: `${stats?.cancelledOrders || 0} cancelled`,
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#dc2626'
    },
    {
      label: 'Avg Delivery Time',
      value: `${stats?.avgDeliveryTime || 0} days`,
      subValue: 'For delivered orders',
      subColor: '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      color: '#06b6d4'
    },
    {
      label: 'Active Tickets',
      value: stats?.activeSupportTickets || 0,
      subValue: 'Support tickets',
      subColor: stats?.activeSupportTickets > 0 ? '#f97316' : '#64748b',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: '#6366f1'
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your store today."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subValue={stat.subValue}
            subColor={stat.subColor}
          />
        ))}
      </div>

      {/* Payment & Geography Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Payment Methods */}
        <Card title="Payment Methods" subtitle="Revenue breakdown">
          {stats?.paymentMethodStats && stats.paymentMethodStats.length > 0 ? (
            <div className="space-y-3">
              {stats.paymentMethodStats.map((method, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                  <div>
                    <p className="font-semibold text-sm uppercase" style={{ color: '#1e293b' }}>
                      {method._id === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </p>
                    <p className="text-xs" style={{ color: '#64748b' }}>{method.count} orders</p>
                  </div>
                  <p className="font-bold" style={{ color: '#816047' }}>₹{method.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No payment data</p>
          )}
        </Card>

        {/* Top Cities */}
        <Card title="Top Cities" subtitle="Sales by location">
          {stats?.salesByCity && stats.salesByCity.length > 0 ? (
            <div className="space-y-2">
              {stats.salesByCity.slice(0, 5).map((city, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0', color: '#64748b' }}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#1e293b' }}>{city._id || 'Unknown'}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>{city.orders} orders</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: '#816047' }}>₹{city.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No location data</p>
          )}
        </Card>

        {/* Category Performance */}
        <Card title="Top Categories" subtitle="Best performing">
          {stats?.categoryPerformance && stats.categoryPerformance.length > 0 ? (
            <div className="space-y-2">
              {stats.categoryPerformance.slice(0, 5).map((category, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0', color: '#64748b' }}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm truncate" style={{ color: '#1e293b' }}>{category.name}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>{category.totalSold} units</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: '#816047' }}>₹{category.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No category data</p>
          )}
        </Card>

        {/* Top States */}
        <Card title="Top States" subtitle="Sales by state">
          {stats?.salesByState && stats.salesByState.length > 0 ? (
            <div className="space-y-2">
              {stats.salesByState.slice(0, 5).map((state, index) => (
                <div key={index} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e2e8f0', color: '#64748b' }}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#1e293b' }}>{state._id || 'Unknown'}</p>
                      <p className="text-xs" style={{ color: '#64748b' }}>{state.orders} orders</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: '#816047' }}>₹{state.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No state data</p>
          )}
        </Card>
      </div>

      {/* Coupon Usage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <Card title="Coupon Performance" subtitle="Top used coupons">
          {stats?.couponUsage && stats.couponUsage.length > 0 ? (
            <div className="space-y-3">
              {stats.couponUsage.map((coupon, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors" style={{ border: '1px solid #f1f5f9' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: '#1e293b' }}>{coupon.code}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-sm" style={{ color: '#816047' }}>{coupon.usedCount} uses</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>₹{coupon.totalSaved?.toLocaleString() || 0} saved</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No coupon usage data</p>
          )}
        </Card>

        <Card title="Coupon Statistics" subtitle="Overall performance">
          <div className="space-y-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#64748b' }}>Total Coupon Usage</p>
              <p className="text-2xl font-bold" style={{ color: '#1e293b' }}>{stats?.totalCouponUsage?.totalUsed || 0}</p>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>coupons applied</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#fef3c7' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#78350f' }}>Total Savings</p>
              <p className="text-2xl font-bold" style={{ color: '#78350f' }}>₹{(stats?.totalCouponUsage?.totalSavings || 0).toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: '#78350f' }}>customer savings</p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#e0e7ff' }}>
              <p className="text-sm font-medium mb-1" style={{ color: '#3730a3' }}>Orders with Coupons</p>
              <p className="text-2xl font-bold" style={{ color: '#3730a3' }}>{stats?.ordersWithCoupons || 0}%</p>
              <p className="text-xs mt-1" style={{ color: '#3730a3' }}>of total orders</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <Card title="Recent Orders" subtitle={`${stats?.recentOrders?.length || 0} recent orders`}>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-50 transition-colors" style={{ border: '1px solid #f1f5f9' }}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold mb-1 truncate" style={{ color: '#1e293b' }}>{order.user?.name || 'Unknown'}</p>
                    <p className="text-sm truncate" style={{ color: '#64748b' }}>{order.user?.email}</p>
                    <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-bold mb-1" style={{ color: '#816047' }}>₹{order.totalPrice?.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No recent orders</p>
          )}
        </Card>

        {/* Top Products */}
        <Card title="Top Selling Products" subtitle={`${stats?.topProducts?.length || 0} best sellers`}>
          {stats?.topProducts && stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors" style={{ border: '1px solid #f1f5f9' }}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#816047' }}>
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate" style={{ color: '#1e293b' }}>
                        {item.name || 'Unknown Product'}
                      </p>
                      <p className="text-sm" style={{ color: '#64748b' }}>{item.totalSold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="font-bold" style={{ color: '#816047' }}>₹{item.revenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: '#94a3b8' }}>No sales data available</p>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
