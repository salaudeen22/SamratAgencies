import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import EmptyState from '../../components/admin/ui/EmptyState';
import { adminAPI } from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers({ limit: 100 });
      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId, currentStatus) => {
    try {
      await adminAPI.updateUserAdmin(userId, !currentStatus);
      fetchUsers();
      toast.success(`Admin privileges ${currentStatus ? 'removed' : 'granted'} successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Users Management"
        subtitle={`Manage all ${users.length} registered users`}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#895F42' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading users...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-lg font-semibold text-red-600 mb-2">Error loading users</p>
          <p className="text-sm" style={{ color: '#64748b' }}>{error}</p>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          title="No users found"
          description="There are no registered users in the system yet."
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#f8fafc' }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Auth Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y" style={{ borderColor: '#e2e8f0' }}>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#895F42' }}>
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="font-semibold" style={{ color: '#1e293b' }}>{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: '#64748b' }}>{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: '#64748b' }}>{user.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            user.authProvider === 'google'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.authProvider || 'local'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#64748b' }}>
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAdmin(user._id, user.isAdmin)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            user.isAdmin
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'text-white hover:shadow-md'
                          }`}
                          style={!user.isAdmin ? { backgroundColor: '#895F42' } : {}}
                          onMouseEnter={(e) => {
                            if (!user.isAdmin) {
                              e.currentTarget.style.backgroundColor = '#6d4a33';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!user.isAdmin) {
                              e.currentTarget.style.backgroundColor = '#895F42';
                            }
                          }}
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm p-4 border" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0" style={{ backgroundColor: '#895F42' }}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate" style={{ color: '#1e293b' }}>{user.name}</h3>
                      <p className="text-sm truncate" style={{ color: '#64748b' }}>{user.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 ${
                      user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span style={{ color: '#64748b' }}>Phone:</span>
                    <p className="font-medium" style={{ color: '#1e293b' }}>{user.phone || '-'}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Provider:</span>
                    <p className="font-medium capitalize" style={{ color: '#1e293b' }}>{user.authProvider || 'local'}</p>
                  </div>
                  <div className="col-span-2">
                    <span style={{ color: '#64748b' }}>Joined:</span>
                    <p className="font-medium" style={{ color: '#1e293b' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleAdmin(user._id, user.isAdmin)}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    user.isAdmin
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'text-white hover:shadow-md'
                  }`}
                  style={!user.isAdmin ? { backgroundColor: '#895F42' } : {}}
                  onMouseEnter={(e) => {
                    if (!user.isAdmin) {
                      e.currentTarget.style.backgroundColor = '#6d4a33';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!user.isAdmin) {
                      e.currentTarget.style.backgroundColor = '#895F42';
                    }
                  }}
                >
                  {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Users;
