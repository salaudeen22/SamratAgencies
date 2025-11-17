import { HiMapPin, HiPhone, HiStar, HiPencil, HiTrash } from 'react-icons/hi2';

const AddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div
      className="relative rounded-2xl p-5 hover:shadow-xl transition-all duration-300 border-2 group"
      style={{
        borderColor: address.isDefault ? '#816047' : '#E6CDB1',
        background: address.isDefault
          ? 'linear-gradient(135deg, rgba(137, 95, 66, 0.05) 0%, rgba(137, 95, 66, 0.02) 100%)'
          : 'white'
      }}
    >
      {address.isDefault && (
        <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1.5 animate-pulse" style={{ background: 'linear-gradient(135deg, #816047 0%, #6d4a35 100%)' }}>
          <HiStar className="w-3.5 h-3.5" />
          Default
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, #D7B790 0%, #9ec4db 100%)' }}>
          <HiMapPin className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg mb-1.5" style={{ color: '#2F1A0F' }}>{address.name}</p>
          <p className="text-sm flex items-center gap-1.5" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>
            <HiPhone className="w-4 h-4" />
            {address.phone}
          </p>
        </div>
      </div>
      <div className="pl-11 space-y-1">
        <p className="text-sm" style={{ color: '#2F1A0F' }}>
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </p>
        <p className="text-sm font-medium" style={{ color: '#2F1A0F' }}>
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="text-xs" style={{ color: 'rgba(129, 96, 71, 0.6)' }}>{address.country}</p>
      </div>
      <div className="mt-4 pt-4 flex gap-2 border-t" style={{ borderColor: '#E6CDB1' }}>
        <button
          onClick={() => onEdit(address)}
          className="flex-1 flex items-center justify-center gap-2 text-sm px-3 py-2 border-2 rounded-lg transition-all hover:shadow-md font-medium"
          style={{ borderColor: '#816047', color: '#816047' }}
        >
          <HiPencil className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(address._id)}
          className="flex items-center justify-center gap-2 text-sm px-3 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all hover:shadow-md font-medium"
        >
          <HiTrash className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
