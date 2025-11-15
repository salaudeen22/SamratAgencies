import { useState, useEffect } from 'react';
import api from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    fetchSubscribers();
  }, [filter]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.isActive = filter === 'active';
      }
      const response = await api.get('/newsletter/subscribers', { params });
      const subs = response.data.subscribers || [];
      setSubscribers(subs);

      // Calculate stats
      const total = subs.length;
      const active = subs.filter(s => s.isActive).length;
      const inactive = total - active;
      setStats({ total, active, inactive });
    } catch (error) {
      console.error('Failed to fetch subscribers:', error);
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Status', 'Subscribed Date'].join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.isActive ? 'Active' : 'Inactive',
        new Date(sub.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported successfully');
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle="Manage email newsletter subscriptions"
        action={
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            Export CSV
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-500 mt-1">Total Subscribers</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-500 mt-1">Active</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{stats.inactive}</div>
            <div className="text-sm text-gray-500 mt-1">Unsubscribed</div>
          </div>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'active'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'inactive'
              ? 'bg-gray-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unsubscribed
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  subscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{subscriber.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          subscriber.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{subscriber.source || 'website'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(subscriber.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
};

export default Newsletter;
