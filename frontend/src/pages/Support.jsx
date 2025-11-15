import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FaTicketAlt, FaClock, FaCheckCircle, FaPaperPlane, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Create ticket form state
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium',
    relatedOrder: ''
  });

  // Reply state
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (activeTab === 'my-tickets') {
      fetchMyTickets();
    }
  }, [user, navigate, activeTab]);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getMyTickets({ page: 1, limit: 50 });
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await ticketAPI.create(formData);
      toast.success('Support ticket created successfully! We will get back to you soon.');

      // Reset form
      setFormData({
        subject: '',
        message: '',
        priority: 'medium',
        relatedOrder: ''
      });

      // Switch to tickets tab
      setActiveTab('my-tickets');
      fetchMyTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      const response = await ticketAPI.getById(ticket._id);
      setSelectedTicket(response.data);
    } catch (error) {
      toast.error('Failed to load ticket details');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);

    try {
      await ticketAPI.addMessage(selectedTicket._id, replyMessage);

      const newMessage = {
        _id: Date.now().toString(),
        sender: 'customer',
        message: replyMessage,
        createdAt: new Date()
      };

      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        updatedAt: new Date()
      };

      setSelectedTicket(updatedTicket);

      // Update ticket in the list
      setTickets(prev => prev.map(t =>
        t._id === selectedTicket._id ? updatedTicket : t
      ));

      setReplyMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaExclamationCircle className="text-orange-500" />;
      case 'in-progress':
        return <FaClock className="text-blue-500" />;
      case 'resolved':
        return <FaCheckCircle className="text-green-500" />;
      case 'closed':
        return <FaTimesCircle className="text-gray-500" />;
      default:
        return <FaTicketAlt className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9', paddingTop: '80px' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2D38' }}>
            Customer Support
          </h1>
          <p style={{ color: '#64748b' }}>
            Need help? Create a support ticket or view your existing requests
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#e2e8f0' }}>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'create'
                ? 'border-b-2 text-[#895F42]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'create' ? { borderColor: '#895F42' } : {}}
          >
            Create Ticket
          </button>
          <button
            onClick={() => setActiveTab('my-tickets')}
            className={`pb-3 px-4 font-medium transition-colors ${
              activeTab === 'my-tickets'
                ? 'border-b-2 text-[#895F42]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={activeTab === 'my-tickets' ? { borderColor: '#895F42' } : {}}
          >
            My Tickets ({tickets.length})
          </button>
        </div>

        {/* Create Ticket Form */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8" style={{ borderColor: '#e2e8f0', border: '1px solid' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42]"
                  style={{ borderColor: '#e2e8f0' }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42]"
                  style={{ borderColor: '#e2e8f0' }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  Related Order ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.relatedOrder}
                  onChange={(e) => setFormData({ ...formData, relatedOrder: e.target.value })}
                  placeholder="Enter order ID if this is order-related"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42]"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2D38' }}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your issue in detail..."
                  rows="6"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42] resize-none"
                  style={{ borderColor: '#e2e8f0' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#895F42' }}
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        )}

        {/* My Tickets */}
        {activeTab === 'my-tickets' && (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#895F42] rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FaTicketAlt className="text-6xl mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1F2D38' }}>
                  No tickets yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't created any support tickets
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-2 text-white rounded-lg"
                  style={{ backgroundColor: '#895F42' }}
                >
                  Create Your First Ticket
                </button>
              </div>
            ) : selectedTicket ? (
              // Ticket Detail View
              <div className="bg-white rounded-lg shadow-sm p-6">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="mb-4 text-[#895F42] hover:underline"
                >
                  ← Back to tickets
                </button>

                {/* Ticket Header */}
                <div className="mb-6 pb-4 border-b" style={{ borderColor: '#e2e8f0' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {selectedTicket.ticketNumber}
                      </p>
                      <h2 className="text-2xl font-bold" style={{ color: '#1F2D38' }}>
                        {selectedTicket.subject}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Created {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>

                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                        style={{ backgroundColor: msg.sender === 'admin' ? '#895F42' : '#3b82f6' }}
                      >
                        {msg.sender === 'admin' ? 'A' : user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`flex-1 ${msg.sender === 'admin' ? 'text-right' : ''}`}>
                        <div
                          className={`inline-block px-4 py-3 rounded-lg ${
                            msg.sender === 'admin'
                              ? 'bg-[#895F42] text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Form - Always show */}
                <form onSubmit={handleSendReply} className="border-t pt-4" style={{ borderColor: '#e2e8f0' }}>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows="4"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42] resize-none"
                    style={{ borderColor: '#e2e8f0' }}
                    disabled={sending}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={sending || !replyMessage.trim()}
                      className="px-6 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: '#895F42' }}
                    >
                      <FaPaperPlane size={14} />
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </form>

                {/* Status Info */}
                {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mt-4">
                    <FaCheckCircle className="text-green-600 text-xl" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">
                        Ticket {selectedTicket.status}
                      </p>
                      <p className="text-xs text-green-700">
                        This ticket has been marked as {selectedTicket.status}. You can still reply if needed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Tickets List
              tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  onClick={() => handleViewTicket(ticket)}
                  className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ borderColor: '#e2e8f0', border: '1px solid' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(ticket.status)}
                        <p className="text-sm font-medium text-gray-600">
                          {ticket.ticketNumber}
                        </p>
                      </div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2D38' }}>
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
