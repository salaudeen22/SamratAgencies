import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FiMail } from 'react-icons/fi';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      await api.post('/newsletter/subscribe', { email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#816047] to-[#CDAA82] py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <FiMail className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Stay in the Loop
        </h3>
        <p className="text-white/90 mb-8 text-lg">
          Get exclusive deals, design tips, and new arrival alerts delivered to your inbox
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-white text-[#816047] font-semibold rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          <p className="text-white/70 text-sm mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;
