import { HiShoppingBag, HiChevronRight } from 'react-icons/hi2';

const OrderCard = ({ order, onClick, getStatusColor }) => {
  return (
    <div
      className="border-2 rounded-2xl p-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group"
      style={{ borderColor: '#E0EAF0' }}
      onClick={() => onClick(order)}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: '#E0EAF0' }}>
              <HiShoppingBag className="w-4 h-4" style={{ color: '#895F42' }} />
            </div>
            <p className="text-sm font-mono font-semibold" style={{ color: '#1F2D38' }}>
              #{order._id.slice(-8)}
            </p>
          </div>
          <p className="text-xs" style={{ color: '#94A1AB' }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="space-y-1.5 mb-3 py-2 border-y" style={{ borderColor: '#f3f4f6' }}>
        {order.items?.slice(0, 1).map((item, index) => (
          <p key={index} className="text-sm truncate font-medium" style={{ color: '#1F2D38' }}>
            {item.name || item.product?.name || 'Product'} × {item.quantity}
          </p>
        ))}
        {order.items?.length > 1 && (
          <p className="text-xs" style={{ color: '#94A1AB' }}>
            +{order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#94A1AB' }}>Total Amount</span>
        <span className="text-lg font-bold" style={{ color: '#895F42' }}>
          ₹{(order.totalPrice || order.totalAmount || 0).toLocaleString()}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t flex items-center justify-center gap-2 text-sm font-medium group-hover:gap-3 transition-all" style={{ borderColor: '#f3f4f6', color: '#895F42' }}>
        <span>View Details</span>
        <HiChevronRight className="w-4 h-4" />
      </div>
    </div>
  );
};

export default OrderCard;
