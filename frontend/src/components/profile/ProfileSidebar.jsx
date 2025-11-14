const ProfileSidebar = ({ user, activeTab, onTabChange, onLogout }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with gradient */}
      <div className="p-6 text-center relative" style={{ background: 'linear-gradient(135deg, #895F42 0%, #6d4a35 100%)' }}>
        <div className="w-20 h-20 rounded-full mx-auto mb-3 ring-4 ring-white/30 flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #BDD7EB 0%, #9ec4db 100%)' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-lg font-bold text-white mb-1">{user?.name}</h2>
        <p className="text-sm text-white/80 truncate px-4">{user?.email}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onTabChange('profile')}
          className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
            activeTab === 'profile'
              ? 'text-white shadow-lg transform scale-105'
              : 'hover:bg-gray-50 hover:translate-x-1'
          }`}
          style={activeTab === 'profile' ? { backgroundColor: '#895F42' } : { color: '#1F2D38' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">Profile</span>
        </button>
        <button
          onClick={() => onTabChange('addresses')}
          className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
            activeTab === 'addresses'
              ? 'text-white shadow-lg transform scale-105'
              : 'hover:bg-gray-50 hover:translate-x-1'
          }`}
          style={activeTab === 'addresses' ? { backgroundColor: '#895F42' } : { color: '#1F2D38' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Addresses</span>
        </button>
        <button
          onClick={() => onTabChange('orders')}
          className={`w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
            activeTab === 'orders'
              ? 'text-white shadow-lg transform scale-105'
              : 'hover:bg-gray-50 hover:translate-x-1'
          }`}
          style={activeTab === 'orders' ? { backgroundColor: '#895F42' } : { color: '#1F2D38' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-medium">My Orders</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 hover:translate-x-1 text-sm sm:text-base mt-4 border-t pt-4"
          style={{ borderColor: '#E0EAF0' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
