import { useState } from 'react';
import toast from 'react-hot-toast';
import { userAPI } from '../../services/api';
import Button from '../Button';

const ProfileTab = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#2F1A0F' }}>Profile Information</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>Manage your personal details</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#816047' }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D7B790' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D7B790' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2F1A0F' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#D7B790' }}
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Save Changes</Button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border rounded-md"
              style={{ borderColor: '#D7B790', color: '#2F1A0F' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Full Name
            </label>
            <p className="text-base sm:text-lg" style={{ color: '#2F1A0F' }}>{user?.name}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Email
            </label>
            <p className="text-base sm:text-lg break-all" style={{ color: '#2F1A0F' }}>{user?.email}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Phone Number
            </label>
            <p className="text-base sm:text-lg" style={{ color: '#2F1A0F' }}>{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Member Since
            </label>
            <p className="text-base sm:text-lg" style={{ color: '#2F1A0F' }}>
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
