import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Card from '../../components/admin/ui/Card';
import Button from '../../components/admin/ui/Button';
import { ticketAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaTicketAlt, FaClock, FaCheckCircle, FaUser, FaEnvelope, FaCalendar, FaExclamationCircle, FaPaperPlane, FaReply } from 'react-icons/fa';

const SupportSystem = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [filterStatus, filterPriority]);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const params = { page: 1, limit: 100 };
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterPriority !== 'all') {
        params.priority = filterPriority;
      }

      const response = await ticketAPI.getAllTickets(params);
      setTickets(response.data.tickets);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      // Fallback to mock data on error
      const mockTickets = [
        {
          _id: '1',
          ticketNumber: 'TKT-2025-001',
          subject: 'Order not delivered',
          status: 'open',
          priority: 'high',
          user: { name: 'Rajesh Kumar', email: 'rajesh@example.com' },
          createdAt: new Date('2025-01-14T10:30:00'),
          updatedAt: new Date('2025-01-14T10:30:00'),
          messages: [
            {
              _id: 'm1',
              sender: 'customer',
              message: 'I placed an order 5 days ago but haven\'t received it yet. Order ID: ORD123456',
              createdAt: new Date('2025-01-14T10:30:00')
            }
          ]
        },
        {
          _id: '2',
          ticketNumber: 'TKT-2025-002',
          subject: 'Product quality issue',
          status: 'in-progress',
          priority: 'medium',
          user: { name: 'Priya Sharma', email: 'priya@example.com' },
          createdAt: new Date('2025-01-13T14:20:00'),
          updatedAt: new Date('2025-01-14T09:15:00'),
          messages: [
            {
              _id: 'm2',
              sender: 'customer',
              message: 'The chair I received has a broken leg. I need a replacement.',
              createdAt: new Date('2025-01-13T14:20:00')
            },
            {
              _id: 'm3',
              sender: 'admin',
              message: 'We apologize for the inconvenience. We will arrange a replacement immediately.',
              createdAt: new Date('2025-01-14T09:15:00')
            }
          ]
        },
        {
          _id: '3',
          ticketNumber: 'TKT-2025-003',
          subject: 'Refund request',
          status: 'resolved',
          priority: 'low',
          user: { name: 'Amit Patel', email: 'amit@example.com' },
          createdAt: new Date('2025-01-12T11:00:00'),
          updatedAt: new Date('2025-01-13T16:45:00'),
          messages: [
            {
              _id: 'm4',
              sender: 'customer',
              message: 'I would like to request a refund for order ORD789012',
              createdAt: new Date('2025-01-12T11:00:00')
            },
            {
              _id: 'm5',
              sender: 'admin',
              message: 'Your refund has been processed and should reflect in 3-5 business days.',
              createdAt: new Date('2025-01-13T16:45:00')
            }
          ]
        },
        {
          _id: '4',
          ticketNumber: 'TKT-2025-004',
          subject: 'Payment issue',
          status: 'open',
          priority: 'urgent',
          user: { name: 'Sneha Reddy', email: 'sneha@example.com' },
          createdAt: new Date('2025-01-15T08:45:00'),
          updatedAt: new Date('2025-01-15T08:45:00'),
          messages: [
            {
              _id: 'm6',
              sender: 'customer',
              message: 'Payment was deducted but order shows as failed. Please help urgently!',
              createdAt: new Date('2025-01-15T08:45:00')
            }
          ]
        }
      ];

      let filtered = mockTickets;

      if (filterStatus !== 'all') {
        filtered = filtered.filter(t => t.status === filterStatus);
      }

      if (filterPriority !== 'all') {
        filtered = filtered.filter(t => t.priority === filterPriority);
      }

      setTickets(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await ticketAPI.updateStatus(ticketId, newStatus);

      setTickets(prev => prev.map(t =>
        t._id === ticketId ? { ...t, status: newStatus, updatedAt: new Date() } : t
      ));

      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(prev => ({ ...prev, status: newStatus, updatedAt: new Date() }));
      }

      toast.success(`Ticket marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();

    if (!replyText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);

    try {
      await ticketAPI.addMessage(selectedTicket._id, replyText);

      const newMessage = {
        _id: Date.now().toString(),
        sender: 'admin',
        message: replyText,
        createdAt: new Date()
      };

      // Update local state
      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMessage],
        status: 'in-progress',
        updatedAt: new Date()
      };

      setSelectedTicket(updatedTicket);
      setTickets(prev => prev.map(t => t._id === selectedTicket._id ? updatedTicket : t));
      setReplyText('');

      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return { bg: '#fef3c7', text: '#92400e' };
      case 'in-progress': return { bg: '#dbeafe', text: '#1e40af' };
      case 'resolved': return { bg: '#dcfce7', text: '#166534' };
      case 'closed': return { bg: '#f3f4f6', text: '#4b5563' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return { bg: '#fee2e2', text: '#991b1b' };
      case 'high': return { bg: '#fed7aa', text: '#9a3412' };
      case 'medium': return { bg: '#fef3c7', text: '#92400e' };
      case 'low': return { bg: '#e0f2fe', text: '#075985' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const ticketDate = new Date(date);
    const diffMins = Math.floor((now - ticketDate) / 60000);
    const diffHours = Math.floor((now - ticketDate) / 3600000);
    const diffDays = Math.floor((now - ticketDate) / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return ticketDate.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: ticketDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#e2e8f0', borderTopColor: '#895F42' }}></div>
            <p className="text-lg font-medium" style={{ color: '#64748b' }}>Loading tickets...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Support Tickets"
          subtitle="Manage customer support requests and inquiries"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Tickets</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#1F2D38' }}>{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                <FaTicketAlt className="text-xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Open</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{stats.open}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100">
                <FaExclamationCircle className="text-xl text-orange-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>In Progress</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                <FaClock className="text-xl text-blue-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>Resolved</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.resolved}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                <FaCheckCircle className="text-xl text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'open' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('open')}
              >
                Open
              </Button>
              <Button
                variant={filterStatus === 'in-progress' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('in-progress')}
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === 'resolved' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('resolved')}
              >
                Resolved
              </Button>
            </div>

            <div className="flex gap-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42]"
                style={{ borderColor: '#e2e8f0' }}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tickets List & Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1 space-y-3">
            {tickets.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <FaTicketAlt className="text-4xl mx-auto mb-3" style={{ color: '#cbd5e1' }} />
                  <p className="text-sm" style={{ color: '#64748b' }}>No tickets found</p>
                </div>
              </Card>
            ) : (
              tickets.map((ticket) => {
                const statusColor = getStatusColor(ticket.status);
                const priorityColor = getPriorityColor(ticket.priority);
                const isSelected = selectedTicket?._id === ticket._id;

                return (
                  <Card
                    key={ticket._id}
                    className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-[#895F42]' : ''}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-semibold mb-1" style={{ color: '#895F42' }}>
                            {ticket.ticketNumber}
                          </p>
                          <h3 className="text-sm font-semibold line-clamp-1" style={{ color: '#1F2D38' }}>
                            {ticket.subject}
                          </h3>
                        </div>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold shrink-0"
                          style={{ backgroundColor: priorityColor.bg, color: priorityColor.text }}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                        <FaUser size={10} />
                        <span className="truncate">{ticket.user.name}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#e2e8f0' }}>
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                        >
                          {ticket.status}
                        </span>
                        <span className="text-xs" style={{ color: '#64748b' }}>
                          {formatDate(ticket.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Ticket Detail */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <Card title="Ticket Details">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="pb-4 border-b" style={{ borderColor: '#e2e8f0' }}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: '#895F42' }}>
                          {selectedTicket.ticketNumber}
                        </p>
                        <h2 className="text-xl font-bold" style={{ color: '#1F2D38' }}>
                          {selectedTicket.subject}
                        </h2>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={getPriorityColor(selectedTicket.priority)}
                        >
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>

                    {/* Customer Contact Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="text-sm font-semibold mb-3" style={{ color: '#1F2D38' }}>Customer Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-blue-600" />
                          <div>
                            <p className="text-xs" style={{ color: '#64748b' }}>Name</p>
                            <p className="text-sm font-medium" style={{ color: '#1F2D38' }}>{selectedTicket.user?.name || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-blue-600" />
                          <div>
                            <p className="text-xs" style={{ color: '#64748b' }}>Email</p>
                            <a href={`mailto:${selectedTicket.user?.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                              {selectedTicket.user?.email || 'N/A'}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Management */}
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-xs font-medium mb-2" style={{ color: '#64748b' }}>Ticket Status</p>
                          <select
                            value={selectedTicket.status}
                            onChange={(e) => handleUpdateStatus(selectedTicket._id, e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42] font-medium"
                            style={{ borderColor: '#e2e8f0', color: '#1F2D38' }}
                          >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                          <FaCalendar size={12} />
                          <span>Created: {formatDate(selectedTicket.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                          <FaClock size={12} />
                          <span>Updated: {formatDate(selectedTicket.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {selectedTicket.messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                          msg.sender === 'admin' ? 'bg-[#895F42]' : 'bg-blue-600'
                        }`}>
                          {msg.sender === 'admin' ? 'A' : selectedTicket.user.name.charAt(0)}
                        </div>
                        <div className={`flex-1 ${msg.sender === 'admin' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                          <div className={`px-4 py-3 rounded-lg max-w-md ${
                            msg.sender === 'admin'
                              ? 'bg-[#895F42] text-white'
                              : 'bg-gray-100'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                          </div>
                          <span className="text-xs" style={{ color: '#64748b' }}>
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Form - Always show for admins */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply to customer..."
                        rows="4"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895F42] resize-none"
                        style={{ borderColor: '#e2e8f0' }}
                        disabled={sending}
                      />
                      <div className="flex items-center justify-end">
                        <Button type="submit" variant="primary" disabled={sending || !replyText.trim()}>
                          <FaPaperPlane className="mr-2" size={12} />
                          {sending ? 'Sending...' : 'Send Reply'}
                        </Button>
                      </div>
                    </div>
                  </form>

                  {/* Status Info */}
                  {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <FaCheckCircle className="text-green-600 text-xl" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">Ticket {selectedTicket.status}</p>
                        <p className="text-xs text-green-700">This ticket has been marked as {selectedTicket.status}. You can still reply if needed.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-20">
                  <FaReply className="text-5xl mx-auto mb-4" style={{ color: '#cbd5e1' }} />
                  <p className="text-lg font-medium" style={{ color: '#64748b' }}>Select a ticket to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SupportSystem;
