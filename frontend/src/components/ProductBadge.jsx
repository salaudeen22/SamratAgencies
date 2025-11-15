import PropTypes from 'prop-types';

const ProductBadge = ({ product }) => {
  const badges = [];

  // Check for New Arrival badge
  if (product.isNewArrival) {
    badges.push({
      text: 'NEW',
      bgColor: '#10b981', // green
      textColor: '#ffffff'
    });
  }

  // Check for Sale badge
  if (product.onSale || product.discount > 0) {
    badges.push({
      text: 'SALE',
      bgColor: '#ef4444', // red
      textColor: '#ffffff'
    });
  }

  // Check for discount percentage
  if (product.discount > 0) {
    badges.push({
      text: `-${product.discount}%`,
      bgColor: '#f59e0b', // amber
      textColor: '#ffffff'
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {badges.map((badge, index) => (
        <span
          key={index}
          className="px-2 py-1 text-xs font-bold rounded shadow-md"
          style={{
            backgroundColor: badge.bgColor,
            color: badge.textColor
          }}
        >
          {badge.text}
        </span>
      ))}
    </div>
  );
};

ProductBadge.propTypes = {
  product: PropTypes.shape({
    isNewArrival: PropTypes.bool,
    onSale: PropTypes.bool,
    discount: PropTypes.number
  }).isRequired
};

export default ProductBadge;
