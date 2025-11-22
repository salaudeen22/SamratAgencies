import { useState, useEffect } from 'react';

/**
 * VariantSelector Component
 * Displays dropdown selectors for variant attributes
 * Supports nested/cascading variants (e.g., Size → Dimensions)
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
          // Select first parent option
          const firstOption = variant.options[0];
          initialOptions[variant.attributeCode] = firstOption.value;

          // If first option has nested options, select first nested option
          if (firstOption.subOptions && firstOption.subOptions.options && firstOption.subOptions.options.length > 0) {
            initialOptions[firstOption.subOptions.attributeCode] = firstOption.subOptions.options[0].value;
          }
        }
      });

      setSelectedOptions(initialOptions);
      calculatePrice(initialOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Calculate final price based on selected options (including nested)
  const calculatePrice = (options) => {
    let totalModifier = 0;
    let imageToShow = null;

    product.variantPricing.forEach(variant => {
      const selectedValue = options[variant.attributeCode];
      const selectedOption = variant.options.find(opt => opt.value === selectedValue);

      if (selectedOption) {
        // Check if this option has nested options
        if (selectedOption.subOptions && selectedOption.subOptions.options) {
          // Find the selected nested option
          const selectedNestedValue = options[selectedOption.subOptions.attributeCode];
          const selectedNestedOption = selectedOption.subOptions.options.find(
            nOpt => nOpt.value === selectedNestedValue
          );

          if (selectedNestedOption) {
            // Use nested option's price modifier
            totalModifier += selectedNestedOption.priceModifier || 0;
          }
        } else {
          // No nested options, use parent's price modifier
          totalModifier += selectedOption.priceModifier || 0;
        }

        // Use the parent option's image if available
        if (selectedOption.image && selectedOption.image.url) {
          imageToShow = selectedOption.image.url;
        }
      }
    });

    // Calculate base price with variant modifiers
    let newPrice = (product.price || 0) + totalModifier;

    // Apply product discount to the final price
    if (product.discount > 0) {
      if (product.discountType === 'percentage') {
        newPrice = newPrice - (newPrice * product.discount / 100);
      } else if (product.discountType === 'fixed') {
        newPrice = Math.max(0, newPrice - product.discount);
      }
    }

    setFinalPrice(Math.round(newPrice));
    setSelectedImage(imageToShow);

    // Notify parent components
    if (onPriceChange) {
      onPriceChange(newPrice);
    }

    if (onVariantChange) {
      onVariantChange(options, newPrice);
    }
  };

  // Handle parent option change
  const handleOptionChange = (attributeCode, value) => {
    const newOptions = { ...selectedOptions };
    newOptions[attributeCode] = value;

    // Find the selected parent option
    const variant = product.variantPricing.find(v => v.attributeCode === attributeCode);
    if (variant) {
      const selectedOption = variant.options.find(opt => opt.value === value);

      // If the new selection has nested options, select the first nested option by default
      if (selectedOption && selectedOption.subOptions && selectedOption.subOptions.options.length > 0) {
        newOptions[selectedOption.subOptions.attributeCode] = selectedOption.subOptions.options[0].value;
      } else {
        // Remove any previously selected nested option for this parent
        const oldSelectedValue = selectedOptions[attributeCode];
        const oldSelectedOption = variant.options.find(opt => opt.value === oldSelectedValue);
        if (oldSelectedOption && oldSelectedOption.subOptions) {
          delete newOptions[oldSelectedOption.subOptions.attributeCode];
        }
      }
    }

    setSelectedOptions(newOptions);
    calculatePrice(newOptions);
  };

  // Handle nested option change
  const handleNestedOptionChange = (nestedAttributeCode, value) => {
    const newOptions = {
      ...selectedOptions,
      [nestedAttributeCode]: value
    };

    setSelectedOptions(newOptions);
    calculatePrice(newOptions);
  };

  // Get price modifier text
  const getPriceModifierText = (modifier) => {
    if (!modifier || modifier === 0) return '';
    return modifier > 0 ? ` (+₹${modifier})` : ` (-₹${Math.abs(modifier)})`;
  };

  // Get the current nested options based on parent selection
  const getCurrentNestedOptions = (variant) => {
    const selectedValue = selectedOptions[variant.attributeCode];
    const selectedOption = variant.options.find(opt => opt.value === selectedValue);
    return selectedOption?.subOptions || null;
  };

  if (!product.variantPricing || product.variantPricing.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Variant Selectors */}
      {product.variantPricing.map((variant) => {
        const nestedOptions = getCurrentNestedOptions(variant);

        return (
          <div key={variant.attributeCode} className="space-y-3">
            {/* Parent Variant Selector */}
            <div>
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
                {variant.options.map((option) => {
                  // For parent options with nested options, don't show price modifier
                  const showModifier = !option.subOptions || option.subOptions.options.length === 0;
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                      {showModifier && getPriceModifierText(option.priceModifier)}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Nested Variant Selector (Cascading) */}
            {nestedOptions && nestedOptions.options && nestedOptions.options.length > 0 && (
              <div className="ml-4 pl-4 border-l-4 border-purple-300">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#6B21A8' }}>
                  Select {nestedOptions.attributeName}
                </label>
                <select
                  value={selectedOptions[nestedOptions.attributeCode] || ''}
                  onChange={(e) => handleNestedOptionChange(nestedOptions.attributeCode, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-all"
                  style={{
                    border: '2px solid #C084FC',
                    color: '#6B21A8',
                    backgroundColor: 'white'
                  }}
                >
                  {nestedOptions.options.map((nestedOption) => (
                    <option key={nestedOption.value} value={nestedOption.value}>
                      {nestedOption.label}{getPriceModifierText(nestedOption.priceModifier)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      })}

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

            if (!selectedOption) return null;

            // Check if this option has nested options
            if (selectedOption.subOptions && selectedOption.subOptions.options.length > 0) {
              const selectedNestedValue = selectedOptions[selectedOption.subOptions.attributeCode];
              const selectedNestedOption = selectedOption.subOptions.options.find(
                nOpt => nOpt.value === selectedNestedValue
              );

              const modifier = selectedNestedOption?.priceModifier || 0;

              if (modifier === 0) return null;

              return (
                <div key={`${variant.attributeCode}-nested`} className="flex justify-between text-sm">
                  <span style={{ color: '#2F1A0F' }}>
                    {selectedOption.label} - {selectedNestedOption?.label}:
                  </span>
                  <span className="font-semibold" style={{ color: modifier > 0 ? '#10B981' : '#EF4444' }}>
                    {modifier > 0 ? '+' : ''}₹{modifier.toLocaleString()}
                  </span>
                </div>
              );
            } else {
              // No nested options, show parent modifier
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
            }
          })}

          {/* Show discount if applicable */}
          {product.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span style={{ color: '#2F1A0F' }}>
                Discount ({product.discountType === 'percentage' ? `${product.discount}%` : `₹${product.discount}`}):
              </span>
              <span className="font-semibold text-green-600">
                -{product.discountType === 'percentage'
                  ? `₹${Math.round(((product.price + calculateTotalModifier()) * product.discount / 100)).toLocaleString()}`
                  : `₹${product.discount.toLocaleString()}`}
              </span>
            </div>
          )}

          <div className="pt-2 mt-2 border-t-2" style={{ borderColor: '#816047' }}>
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-bold" style={{ color: '#2F1A0F' }}>Final Price:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: '#816047' }}>
                  ₹{finalPrice?.toLocaleString()}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm font-semibold text-green-600">
                    ({product.discountType === 'percentage' ? `${product.discount}% OFF` : `₹${product.discount} OFF`})
                  </span>
                )}
              </div>
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

  // Helper function to calculate total modifier for discount calculation
  function calculateTotalModifier() {
    let totalModifier = 0;

    product.variantPricing.forEach(variant => {
      const selectedValue = selectedOptions[variant.attributeCode];
      const selectedOption = variant.options.find(opt => opt.value === selectedValue);

      if (selectedOption) {
        if (selectedOption.subOptions && selectedOption.subOptions.options) {
          const selectedNestedValue = selectedOptions[selectedOption.subOptions.attributeCode];
          const selectedNestedOption = selectedOption.subOptions.options.find(
            nOpt => nOpt.value === selectedNestedValue
          );
          if (selectedNestedOption) {
            totalModifier += selectedNestedOption.priceModifier || 0;
          }
        } else {
          totalModifier += selectedOption.priceModifier || 0;
        }
      }
    });

    return totalModifier;
  }
};

export default VariantSelector;
