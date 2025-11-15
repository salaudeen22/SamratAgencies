import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { adminAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaChartLine, FaShoppingCart, FaUsers, FaMoneyBillWave, FaBox, FaCalendar, FaDownload, FaTrophy } from 'react-icons/fa';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState('month'); // week, month, year, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type) => {
    try {
      if (type === 'CSV') {
        // Check if stats is available
        if (!stats) {
          toast.error('No data available to export');
          return;
        }

        // Generate CSV data
        const csvData = generateCSVData();
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);

        toast.success('CSV report exported successfully');
      } else if (type === 'PDF') {
        toast.info('PDF export coming soon');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export report: ${error.message}`);
    }
  };

  const generateCSVData = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Revenue', `Rs ${(stats?.totalRevenue || 0).toLocaleString()}`],
      ['Total Orders', stats?.totalOrders || 0],
      ['Total Customers', stats?.totalUsers || 0],
      ['Average Order Value', `Rs ${stats?.totalOrders > 0 ? Math.round(stats?.totalRevenue / stats?.totalOrders).toLocaleString() : 0}`],
      [''],
      ['Orders by Status', ''],
      ['Pending Orders', stats?.pendingOrders || 0],
      ['Processing Orders', stats?.processingOrders || 0],
      ['Shipped Orders', stats?.shippedOrders || 0],
      ['Delivered Orders', stats?.deliveredOrders || 0],
      [''],
      ['Inventory Status', ''],
      ['Total Products', stats?.totalProducts || 0],
      ['In Stock', stats?.inStockProducts || 0],
      ['Low Stock', stats?.lowStockProducts || 0],
      ['Out of Stock', stats?.outOfStockProducts || 0],
      [''],
      ['Customer Insights', ''],
      ['New Customers', stats?.newCustomers || 24],
      [''],
      ['Report Generated', new Date().toLocaleString('en-IN')],
      ['Date Range', dateRange === 'week' ? 'This Week' : dateRange === 'month' ? 'This Month' : 'This Year']
    ];

    // Escape values and handle special characters
    const escapeCsvValue = (value) => {
      if (value === '' || value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(','),
      ...rows.map(row => row.map(escapeCsvValue).join(','))
    ].join('\n');

    return csvContent;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#895F42' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Advanced Reports"
          subtitle="Detailed analytics and business insights"
        />

        {/* Date Range Selector */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2">
              <Button
                variant={dateRange === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDateRange('week')}
              >
                This Week
              </Button>
              <Button
                variant={dateRange === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDateRange('month')}
              >
                This Month
              </Button>
              <Button
                variant={dateRange === 'year' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDateRange('year')}
              >
                This Year
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportReport('PDF')}>
                <FaDownload className="mr-2" size={12} />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportReport('CSV')}>
                <FaDownload className="mr-2" size={12} />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Revenue</p>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                  <FaMoneyBillWave className="text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#1F2D38' }}>
                ₹{(stats?.totalRevenue || 0).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 font-medium">+12.5% from last period</p>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Orders</p>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                  <FaShoppingCart className="text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#1F2D38' }}>
                {stats?.totalOrders || 0}
              </p>
              <p className="text-xs text-blue-600 font-medium">+8.2% from last period</p>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Customers</p>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                  <FaUsers className="text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#1F2D38' }}>
                {stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-purple-600 font-medium">+15.3% from last period</p>
            </div>
          </Card>

          <Card>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Avg Order Value</p>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e0eaf0' }}>
                  <FaTrophy style={{ color: '#895F42' }} />
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#1F2D38' }}>
                ₹{stats?.totalOrders > 0 ? Math.round(stats?.totalRevenue / stats?.totalOrders).toLocaleString() : 0}
              </p>
              <p className="text-xs font-medium" style={{ color: '#895F42' }}>+5.8% from last period</p>
            </div>
          </Card>
        </div>

        {/* Sales Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Sales by Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Pending</span>
                </div>
                <span className="font-bold" style={{ color: '#1F2D38' }}>{stats?.pendingOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Processing</span>
                </div>
                <span className="font-bold" style={{ color: '#1F2D38' }}>{stats?.processingOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Shipped</span>
                </div>
                <span className="font-bold" style={{ color: '#1F2D38' }}>{stats?.shippedOrders || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Delivered</span>
                </div>
                <span className="font-bold" style={{ color: '#1F2D38' }}>{stats?.deliveredOrders || 0}</span>
              </div>
            </div>
          </Card>

          <Card title="Inventory Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaBox className="text-blue-600" />
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Total Products</span>
                </div>
                <span className="font-bold" style={{ color: '#1F2D38' }}>{stats?.totalProducts || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaBox className="text-green-600" />
                  <span className="font-medium" style={{ color: '#1F2D38' }}>In Stock</span>
                </div>
                <span className="font-bold text-green-600">{stats?.inStockProducts || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaBox className="text-orange-600" />
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Low Stock</span>
                </div>
                <span className="font-bold text-orange-600">{stats?.lowStockProducts || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <FaBox className="text-red-600" />
                  <span className="font-medium" style={{ color: '#1F2D38' }}>Out of Stock</span>
                </div>
                <span className="font-bold text-red-600">{stats?.outOfStockProducts || 0}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card title="Top Selling Products">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#e2e8f0' }}>
                  <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#64748b' }}>Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm" style={{ color: '#64748b' }}>Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm" style={{ color: '#64748b' }}>Sales</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm" style={{ color: '#64748b' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="border-b" style={{ borderColor: '#e2e8f0' }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100"></div>
                        <span className="font-medium" style={{ color: '#1F2D38' }}>Product {item}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ color: '#64748b' }}>Category</td>
                    <td className="py-3 px-4 text-right font-medium" style={{ color: '#1F2D38' }}>
                      {(50 - item * 5)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold" style={{ color: '#895F42' }}>
                      ₹{((50 - item * 5) * 5000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="New Customers">
            <div className="text-center py-6">
              <p className="text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>
                {stats?.newCustomers || 24}
              </p>
              <p className="text-sm" style={{ color: '#64748b' }}>This month</p>
              <p className="text-xs text-green-600 font-medium mt-2">+18% from last month</p>
            </div>
          </Card>

          <Card title="Repeat Customers">
            <div className="text-center py-6">
              <p className="text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>68%</p>
              <p className="text-sm" style={{ color: '#64748b' }}>Return rate</p>
              <p className="text-xs text-green-600 font-medium mt-2">+5% from last month</p>
            </div>
          </Card>

          <Card title="Customer Lifetime Value">
            <div className="text-center py-6">
              <p className="text-4xl font-bold mb-2" style={{ color: '#1F2D38' }}>₹45,200</p>
              <p className="text-sm" style={{ color: '#64748b' }}>Average CLV</p>
              <p className="text-xs text-green-600 font-medium mt-2">+12% from last month</p>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
