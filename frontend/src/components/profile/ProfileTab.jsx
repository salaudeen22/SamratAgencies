import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { userAPI } from '../../services/api';
import Button from '../Button';
import { MdEmail } from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileTab = ({ user }) => {
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);

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

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification-email`, {
        email: user?.email
      });

      if (response.data.success) {
        toast.success('Verification email sent! Please check your inbox.');
        setShowVerificationModal(false);
      }
    } catch (err) {
      if (err.response?.data?.alreadyVerified) {
        toast.success('Email already verified!');
        setShowVerificationModal(false);
        window.location.reload(); // Refresh to update UI
      } else {
        const errorMsg = err.response?.data?.message || 'Failed to resend email';
        toast.error(errorMsg);
      }
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      {/* Email Not Verified Banner */}
      {!user?.isEmailVerified && (
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#fff3cd', border: '2px solid #f59e0b' }}>
          <div className="flex items-start gap-3">
            <MdEmail className="w-6 h-6 flex-shrink-0" style={{ color: '#92400e' }} />
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1" style={{ color: '#92400e' }}>
                Email Not Verified
              </h3>
              <p className="text-xs mb-3" style={{ color: '#78350f' }}>
                Please verify your email address to secure your account and receive important notifications.
              </p>
              <button
                onClick={() => setShowVerificationModal(true)}
                className="text-xs font-semibold px-3 py-2 rounded-lg transition-all hover:shadow-md"
                style={{ backgroundColor: '#92400e', color: '#fff' }}
              >
                Verify Email Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#fff3cd' }}>
                <MdEmail className="w-8 h-8" style={{ color: '#92400e' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2F1A0F' }}>
                Verify Your Email
              </h3>
              <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                We'll send a verification link to:
              </p>
              <p className="text-base font-semibold mt-2" style={{ color: '#816047' }}>
                {user?.email}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <MdEmail className="w-4 h-4" style={{ color: '#1e40af' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>Check your inbox</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Look for an email from Samrat Agencies
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <span className="text-sm font-bold" style={{ color: '#1e40af' }}>1</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>Click the verification link</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    The link expires in 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dbeafe' }}>
                  <span className="text-sm font-bold" style={{ color: '#1e40af' }}>2</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>You're all set!</p>
                  <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                    Your account will be verified
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendVerification}
                disabled={resendingEmail}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                style={{ backgroundColor: '#816047' }}
              >
                {resendingEmail ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </span>
                ) : (
                  'Send Verification Email'
                )}
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
                disabled={resendingEmail}
                className="w-full py-3 px-4 rounded-xl font-semibold transition-all border-2 disabled:opacity-50"
                style={{ borderColor: '#D7B790', color: '#816047' }}
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-center mt-4" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      )}

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
