import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUser, HiShoppingBag, HiMapPin, HiArrowRightOnRectangle, HiReceiptRefund } from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import ProfileTab from '../components/profile/ProfileTab';
import AddressesTab from '../components/profile/AddressesTab';
import OrdersTab from '../components/profile/OrdersTab';
import ReturnsTab from '../components/profile/ReturnsTab';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiUser },
    { id: 'orders', label: 'Orders', icon: HiShoppingBag },
    { id: 'returns', label: 'Returns', icon: HiReceiptRefund },
    { id: 'addresses', label: 'Addresses', icon: HiMapPin }
  ];

  return (
    <div className="min-h-screen py-6 sm:py-8" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-32 sm:h-40" style={{ background: 'linear-gradient(135deg, #816047 0%, #6d4a35 100%)' }}>
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #816047 0%, #6d4a35 100%)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <HiArrowRightOnRectangle className="w-4 h-4" />
              Logout
            </button>
          </div>
          <div className="pt-16 pb-6 px-6 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: '#2F1A0F' }}>{user?.name}</h1>
            <p className="text-sm sm:text-base mb-4" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>{user?.email}</p>

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b overflow-x-auto" style={{ borderColor: '#E6CDB1' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-b-2 -mb-px'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={activeTab === tab.id ? {
                      borderColor: '#816047',
                      color: '#816047'
                    } : {
                      color: '#2F1A0F'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'returns' && <ReturnsTab />}
          {activeTab === 'addresses' && <AddressesTab />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
