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
          <h2 className="text-xl font-bold" style={{ color: '#1F2D38' }}>Profile Information</h2>
          <p className="text-sm mt-1" style={{ color: '#94A1AB' }}>Manage your personal details</p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="px-5 py-2.5 rounded-xl text-white transition-all text-sm font-medium hover:shadow-lg transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#895F42' }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {editMode ? (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#BDD7EB' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#BDD7EB' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#BDD7EB' }}
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Save Changes</Button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border rounded-md"
              style={{ borderColor: '#BDD7EB', color: '#1F2D38' }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
              Full Name
            </label>
            <p className="text-base sm:text-lg" style={{ color: '#1F2D38' }}>{user?.name}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
              Email
            </label>
            <p className="text-base sm:text-lg break-all" style={{ color: '#1F2D38' }}>{user?.email}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
              Phone Number
            </label>
            <p className="text-base sm:text-lg" style={{ color: '#1F2D38' }}>{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1" style={{ color: '#94A1AB' }}>
              Member Since
            </label>
            <p className="text-base sm:text-lg" style={{ color: '#1F2D38' }}>
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
