import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { contactMessagesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaPhone, FaUser, FaClock, FaReply, FaInbox } from 'react-icons/fa';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [filterStatus, currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 10 };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const response = await contactMessagesAPI.getAll(params);
      setMessages(response.data.messages);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await contactMessagesAPI.markAsRead(messageId);
      toast.success('Message marked as read');
      fetchMessages();
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(prev => ({ ...prev, isRead: true, readAt: new Date() }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactMessagesAPI.delete(messageId);
      toast.success('Message deleted successfully');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await handleMarkAsRead(message._id);
    }
  };

  const getUnreadCount = () => {
    return messages.filter(m => !m.isRead).length;
  };

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return messageDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#816047' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading messages...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Contact Messages"
          subtitle={`Manage customer inquiries and support requests`}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Messages</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#2F1A0F' }}>{total}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e0eaf0' }}>
                <FaInbox className="text-xl" style={{ color: '#816047' }} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Unread</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{messages.filter(m => !m.isRead).length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100">
                <FaEnvelope className="text-xl text-orange-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Read</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{messages.filter(m => m.isRead).length}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <FaEnvelopeOpen className="text-xl text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Messages List */}
          <div className="col-span-12 lg:col-span-5">
            <Card>
              {/* Filters */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setFilterStatus('all');
                      setCurrentPage(1);
                    }}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterStatus === 'unread' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setFilterStatus('unread');
                      setCurrentPage(1);
                    }}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filterStatus === 'read' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setFilterStatus('read');
                      setCurrentPage(1);
                    }}
                  >
                    Read
                  </Button>
                </div>
                <span className="text-sm font-medium" style={{ color: '#64748b' }}>
                  {messages.length} messages
                </span>
              </div>

              {/* Messages */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-16">
                    <FaInbox className="text-5xl mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                    <p className="text-lg font-medium mb-1" style={{ color: '#64748b' }}>No messages found</p>
                    <p className="text-sm" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                      {filterStatus === 'unread' ? 'All caught up!' : 'Messages will appear here'}
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      onClick={() => handleViewMessage(message)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedMessage?._id === message._id
                          ? 'border-[#816047] bg-[#fafaf9] shadow-md'
                          : 'hover:bg-gray-50 hover:border-gray-300'
                      }`}
                      style={{
                        borderColor: selectedMessage?._id === message._id ? '#816047' : '#e2e8f0',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar/Icon */}
                        <div
                          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            message.isRead ? 'bg-gray-100' : 'bg-orange-100'
                          }`}
                        >
                          {message.isRead ? (
                            <FaEnvelopeOpen className="text-gray-500" size={16} />
                          ) : (
                            <FaEnvelope style={{ color: '#816047' }} size={16} />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className="grow min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4
                              className={`font-semibold truncate ${
                                message.isRead ? 'text-gray-700' : 'text-gray-900'
                              }`}
                            >
                              {message.name}
                            </h4>
                            <span className="text-xs shrink-0" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                              {formatDate(message.createdAt)}
                            </span>
                          </div>

                          <p
                            className={`text-sm mb-1 font-medium truncate ${
                              message.isRead ? 'text-gray-600' : 'text-gray-900'
                            }`}
                          >
                            {message.subject}
                          </p>

                          <p className="text-sm truncate" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
                            {message.message}
                          </p>

                          {/* Email badge */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100" style={{ color: '#64748b' }}>
                              {message.email}
                            </span>
                            {!message.isRead && (
                              <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="px-4 text-sm font-medium" style={{ color: '#64748b' }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Message Detail */}
          <div className="col-span-12 lg:col-span-7">
            {selectedMessage ? (
              <Card>
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-start justify-between pb-6 border-b" style={{ borderColor: '#e2e8f0' }}>
                    <div className="grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold" style={{ color: '#2F1A0F' }}>
                          {selectedMessage.subject}
                        </h2>
                        {selectedMessage.isRead ? (
                          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                            Read
                          </span>
                        ) : (
                          <span className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                            Unread
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#64748b' }}>
                        <div className="flex items-center gap-2">
                          <FaClock size={12} />
                          <span>{new Date(selectedMessage.createdAt).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        {selectedMessage.isRead && selectedMessage.readAt && (
                          <div className="flex items-center gap-2">
                            <FaEnvelopeOpen size={12} />
                            <span>Read {formatDate(selectedMessage.readAt)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(selectedMessage._id)}
                    >
                      <FaTrash className="mr-2" size={12} />
                      Delete
                    </Button>
                  </div>

                  {/* Sender Info Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#816047' }}>
                          <FaUser className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-medium" style={{ color: '#64748b' }}>From</p>
                          <p className="font-bold" style={{ color: '#2F1A0F' }}>{selectedMessage.name}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>Email Address</p>
                          <a
                            href={`mailto:${selectedMessage.email}`}
                            className="text-sm hover:underline flex items-center gap-2"
                            style={{ color: '#816047' }}
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                        {selectedMessage.phone && (
                          <div>
                            <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>Phone Number</p>
                            <a
                              href={`tel:${selectedMessage.phone}`}
                              className="text-sm hover:underline flex items-center gap-2"
                              style={{ color: '#816047' }}
                            >
                              <FaPhone size={12} />
                              {selectedMessage.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: '#fafaf9', border: '1px solid #e2e8f0' }}>
                      <p className="text-sm font-bold mb-3" style={{ color: '#2F1A0F' }}>Quick Actions</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                          style={{ backgroundColor: '#816047', color: 'white' }}
                        >
                          <FaReply />
                          <span>Reply via Email</span>
                        </button>
                        {selectedMessage.phone && (
                          <button
                            onClick={() => window.location.href = `tel:${selectedMessage.phone}`}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
                            style={{ borderColor: '#e2e8f0', color: '#2F1A0F' }}
                          >
                            <FaPhone />
                            <span>Call Customer</span>
                          </button>
                        )}
                        {!selectedMessage.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(selectedMessage._id)}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border transition-all hover:bg-gray-50"
                            style={{ borderColor: '#e2e8f0', color: '#2F1A0F' }}
                          >
                            <FaEnvelopeOpen />
                            <span>Mark as Read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: '#2F1A0F' }}>
                      <span>Message</span>
                    </h3>
                    <div
                      className="p-6 rounded-lg whitespace-pre-wrap leading-relaxed"
                      style={{ backgroundColor: '#f8fafc', color: '#2F1A0F', border: '1px solid #e2e8f0' }}
                    >
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#e0eaf0' }}>
                    <FaInbox className="text-4xl" style={{ color: '#816047' }} />
                  </div>
                  <p className="text-xl font-medium mb-2" style={{ color: '#2F1A0F' }}>
                    Select a message
                  </p>
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    Choose a message from the list to view its details
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactMessages;
