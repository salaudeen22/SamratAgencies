import { useState, useEffect } from 'react';

/**
 * VariantSelector Component
 * Displays dropdown selectors for variant attributes
 * Calculates final price based on base price + selected modifiers
 */
const VariantSelector = ({ product, onPriceChange, onVariantChange }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [finalPrice, setFinalPrice] = useState(product.price);
  const [selectedImage, setSelectedImage] = useState(null);

  // Initialize with first option of each attribute
  useEffect(() => {
    if (product.variantPricing && product.variantPricing.length > 0) {
      const initialOptions = {};

      product.variantPricing.forEach(variant => {
        if (variant.options && variant.options.length > 0) {
          initialOptions[variant.attributeCode] = variant.options[0].value;
        }
      });

      setSelectedOptions(initialOptions);
      calculatePrice(initialOptions);
    }
  }, [product]);

  // Calculate final price based on selected options
  const calculatePrice = (options) => {
    let totalModifier = 0;
    let imageToShow = null;

    product.variantPricing.forEach(variant => {
      const selectedValue = options[variant.attributeCode];
      const selectedOption = variant.options.find(opt => opt.value === selectedValue);

      if (selectedOption) {
        totalModifier += selectedOption.priceModifier || 0;

        // Use the last variant's image if available
        if (selectedOption.image && selectedOption.image.url) {
          imageToShow = selectedOption.image.url;
        }
      }
    });

    const newPrice = (product.price || 0) + totalModifier;
    setFinalPrice(newPrice);
    setSelectedImage(imageToShow);

    // Notify parent components
    if (onPriceChange) {
      onPriceChange(newPrice);
    }

    if (onVariantChange) {
      onVariantChange(options, newPrice);
    }
  };

  // Handle option change
  const handleOptionChange = (attributeCode, value) => {
    const newOptions = {
      ...selectedOptions,
      [attributeCode]: value
    };

    setSelectedOptions(newOptions);
    calculatePrice(newOptions);
  };

  // Get price modifier text
  const getPriceModifierText = (modifier) => {
    if (!modifier || modifier === 0) return '';
    return modifier > 0 ? ` (+₹${modifier})` : ` (-₹${Math.abs(modifier)})`;
  };

  if (!product.variantPricing || product.variantPricing.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Variant Selectors */}
      {product.variantPricing.map((variant) => (
        <div key={variant.attributeCode}>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
            Select {variant.attributeName}
          </label>
          <select
            value={selectedOptions[variant.attributeCode] || ''}
            onChange={(e) => handleOptionChange(variant.attributeCode, e.target.value)}
            className="w-full px-4 py-3 rounded-lg transition-all"
            style={{
              border: '2px solid #D7B790',
              color: '#2F1A0F',
              backgroundColor: 'white'
            }}
          >
            {variant.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}{getPriceModifierText(option.priceModifier)}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Price Breakdown */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6CDB1', border: '2px solid #816047' }}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: '#2F1A0F' }}>Base Price:</span>
            <span className="font-semibold" style={{ color: '#2F1A0F' }}>
              ₹{product.price?.toLocaleString()}
            </span>
          </div>

          {product.variantPricing.map((variant) => {
            const selectedValue = selectedOptions[variant.attributeCode];
            const selectedOption = variant.options.find(opt => opt.value === selectedValue);
            const modifier = selectedOption?.priceModifier || 0;

            if (modifier === 0) return null;

            return (
              <div key={variant.attributeCode} className="flex justify-between text-sm">
                <span style={{ color: '#2F1A0F' }}>
                  {variant.attributeName} ({selectedOption?.label}):
                </span>
                <span className="font-semibold" style={{ color: modifier > 0 ? '#10B981' : '#EF4444' }}>
                  {modifier > 0 ? '+' : ''}₹{modifier.toLocaleString()}
                </span>
              </div>
            );
          })}

          <div className="pt-2 mt-2 border-t-2" style={{ borderColor: '#816047' }}>
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-bold" style={{ color: '#2F1A0F' }}>Final Price:</span>
              <span className="text-3xl font-bold" style={{ color: '#816047' }}>
                ₹{finalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Variant Image */}
      {selectedImage && (
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2" style={{ color: '#2F1A0F' }}>
            Selected Variant
          </label>
          <img
            src={selectedImage}
            alt="Selected variant"
            className="w-full max-w-xs rounded-lg border-2"
            style={{ borderColor: '#816047' }}
          />
        </div>
      )}
    </div>
  );
};

export default VariantSelector;
