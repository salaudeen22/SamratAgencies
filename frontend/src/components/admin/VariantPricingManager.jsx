import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * VariantPricingManager Component
 * Manages variant pricing with price modifiers per attribute option
 * Supports nested variants (parent-child relationships)
 * Example: Size (parent) → Dimensions (child)
 * Admin sets base price + individual price modifiers for each option
 */

const VariantPricingManager = ({
  selectedAttributeSet,
  variantPricing = [],
  onVariantPricingChange,
  onUploadImage
}) => {
  const [enabledAttributes, setEnabledAttributes] = useState([]);
  const [pricingConfig, setPricingConfig] = useState([]);
  const [expandedParentOptions, setExpandedParentOptions] = useState({}); // Track which parent options are expanded

  // Initialize from existing variantPricing
  useEffect(() => {
    if (variantPricing && variantPricing.length > 0) {
      setPricingConfig(variantPricing);
      const enabled = variantPricing.map(v => v.attributeCode);
      setEnabledAttributes(enabled);
    } else {
      setPricingConfig([]);
      setEnabledAttributes([]);
    }
  }, []);

  // Get variant attributes from AttributeSet
  const getVariantAttributes = () => {
    if (!selectedAttributeSet || !selectedAttributeSet.attributes) return [];

    return selectedAttributeSet.attributes
      .filter(attrItem => attrItem.attribute && attrItem.attribute.isVariant)
      .map(attrItem => attrItem.attribute);
  };

  const variantAttributes = getVariantAttributes();

  // Toggle attribute enable/disable
  const handleAttributeToggle = (attribute) => {
    const attrCode = attribute.code;

    if (enabledAttributes.includes(attrCode)) {
      // Disable - remove from config
      setEnabledAttributes(enabledAttributes.filter(code => code !== attrCode));
      const newConfig = pricingConfig.filter(item => item.attributeCode !== attrCode);
      setPricingConfig(newConfig);
      onVariantPricingChange(newConfig);
    } else {
      // Enable - add to config with empty options (user will select which ones they want)
      setEnabledAttributes([...enabledAttributes, attrCode]);

      const newItem = {
        attributeCode: attrCode,
        attributeName: attribute.name,
        options: [] // Start with empty, user will add options they need
      };

      const newConfig = [...pricingConfig, newItem];
      setPricingConfig(newConfig);
      onVariantPricingChange(newConfig);
    }
  };

  // Add specific option to an attribute
  const handleAddOption = (attrCode, optionToAdd, parentOptionValue = null) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        // Check if option already exists
        const exists = item.options.some(opt => opt.value === optionToAdd.value);
        if (exists) return item;

        return {
          ...item,
          options: [...item.options, {
            value: optionToAdd.value,
            label: optionToAdd.label,
            priceModifier: 0,
            image: null,
            subOptions: null // Initialize for potential nested options
          }]
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Toggle nested options for a parent option
  const handleToggleNestedOptions = (attrCode, optionValue) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt => {
            if (opt.value === optionValue) {
              if (opt.subOptions) {
                // Remove nested options
                const { subOptions, ...rest } = opt;
                return rest;
              } else {
                // Add nested options structure
                return {
                  ...opt,
                  subOptions: {
                    attributeCode: '',
                    attributeName: '',
                    options: []
                  }
                };
              }
            }
            return opt;
          })
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Select nested attribute from available attributes
  const handleSelectNestedAttribute = (attrCode, optionValue, selectedAttribute) => {
    if (!selectedAttribute) return;

    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt => {
            if (opt.value === optionValue && opt.subOptions) {
              // Initialize with empty options - admin will select which ones to enable
              return {
                ...opt,
                subOptions: {
                  attributeCode: selectedAttribute.code,
                  attributeName: selectedAttribute.name,
                  availableOptions: selectedAttribute.options, // All available options
                  options: [] // Selected options (admin will check to enable)
                }
              };
            }
            return opt;
          })
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Toggle nested option (enable/disable via checkbox)
  const handleToggleNestedOption = (attrCode, parentOptionValue, nestedOptionValue) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt => {
            if (opt.value === parentOptionValue && opt.subOptions) {
              const exists = opt.subOptions.options.some(nOpt => nOpt.value === nestedOptionValue);

              if (exists) {
                // Remove option
                return {
                  ...opt,
                  subOptions: {
                    ...opt.subOptions,
                    options: opt.subOptions.options.filter(nOpt => nOpt.value !== nestedOptionValue)
                  }
                };
              } else {
                // Add option with price modifier 0
                const optionToAdd = opt.subOptions.availableOptions.find(
                  availOpt => availOpt.value === nestedOptionValue
                );
                return {
                  ...opt,
                  subOptions: {
                    ...opt.subOptions,
                    options: [...opt.subOptions.options, {
                      value: optionToAdd.value,
                      label: optionToAdd.label,
                      priceModifier: 0
                    }]
                  }
                };
              }
            }
            return opt;
          })
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Remove nested option
  const handleRemoveNestedOption = (attrCode, parentOptionValue, nestedOptionValue) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt => {
            if (opt.value === parentOptionValue && opt.subOptions) {
              return {
                ...opt,
                subOptions: {
                  ...opt.subOptions,
                  options: opt.subOptions.options.filter(nOpt => nOpt.value !== nestedOptionValue)
                }
              };
            }
            return opt;
          })
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Update price modifier for nested option
  const handleNestedPriceModifierChange = (attrCode, parentOptionValue, nestedOptionValue, modifier) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt => {
            if (opt.value === parentOptionValue && opt.subOptions) {
              return {
                ...opt,
                subOptions: {
                  ...opt.subOptions,
                  options: opt.subOptions.options.map(nOpt =>
                    nOpt.value === nestedOptionValue
                      ? { ...nOpt, priceModifier: parseFloat(modifier) || 0 }
                      : nOpt
                  )
                }
              };
            }
            return opt;
          })
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Remove specific option from an attribute
  const handleRemoveOption = (attrCode, optionValue) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.filter(opt => opt.value !== optionValue)
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Update price modifier for a specific option
  const handlePriceModifierChange = (attrCode, optionValue, modifier) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt =>
            opt.value === optionValue
              ? { ...opt, priceModifier: parseFloat(modifier) || 0 }
              : opt
          )
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  // Handle image upload for option
  const handleImageUpload = async (attrCode, optionValue, file) => {
    if (onUploadImage) {
      try {
        const imageData = await onUploadImage(file);

        const newConfig = pricingConfig.map(item => {
          if (item.attributeCode === attrCode) {
            return {
              ...item,
              options: item.options.map(opt =>
                opt.value === optionValue
                  ? { ...opt, image: imageData }
                  : opt
              )
            };
          }
          return item;
        });

        setPricingConfig(newConfig);
        onVariantPricingChange(newConfig);
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  // Remove image
  const handleRemoveImage = (attrCode, optionValue) => {
    const newConfig = pricingConfig.map(item => {
      if (item.attributeCode === attrCode) {
        return {
          ...item,
          options: item.options.map(opt =>
            opt.value === optionValue
              ? { ...opt, image: null }
              : opt
          )
        };
      }
      return item;
    });

    setPricingConfig(newConfig);
    onVariantPricingChange(newConfig);
  };

  if (variantAttributes.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <p className="text-sm text-gray-600">
          No variant attributes available in this Attribute Set. To enable variants, add attributes with "Can Create Variants" enabled in the Attributes page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Variant Attributes Selection */}
      <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-md mb-3 text-gray-800">Enable Variant Attributes</h4>
        <p className="text-sm text-gray-600 mb-4">
          Select which attributes will have price modifiers. Customers will select these options and see the updated price.
        </p>

        <div className="flex flex-wrap gap-3">
          {variantAttributes.map((attribute) => (
            <button
              key={attribute.code}
              type="button"
              onClick={() => handleAttributeToggle(attribute)}
              className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                enabledAttributes.includes(attribute.code)
                  ? 'border-blue-500 bg-blue-100 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
              }`}
            >
              {enabledAttributes.includes(attribute.code) && '✓ '}
              {attribute.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Modifier Configuration for Each Enabled Attribute */}
      {pricingConfig.map((item) => {
        const attribute = variantAttributes.find(attr => attr.code === item.attributeCode);
        if (!attribute) return null;

        // Get available options that haven't been added yet
        const availableOptions = (attribute.options || []).filter(
          attrOpt => !item.options.some(itemOpt => itemOpt.value === attrOpt.value)
        );

        return (
          <div key={item.attributeCode} className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b-2 border-gray-200 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-md text-gray-800">{item.attributeName}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Add the specific {item.attributeName.toLowerCase()} options you want for this product and set their price modifiers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAttributeToggle(attribute)}
                className="text-xs px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded"
              >
                Remove
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Add Option Dropdown */}
              {availableOptions.length > 0 && (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add {item.attributeName} Option
                    </label>
                    <select
                      onChange={(e) => {
                        const selected = attribute.options.find(opt => opt.value === e.target.value);
                        if (selected) {
                          handleAddOption(item.attributeCode, selected);
                          e.target.value = ''; // Reset dropdown
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      defaultValue=""
                    >
                      <option value="" disabled>Select {item.attributeName} to add...</option>
                      {availableOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Selected Options with Price Modifiers */}
              {item.options.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {item.options.map((option, idx) => (
                    <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                      {/* Parent Option */}
                      <div className="p-4 bg-gray-50 hover:border-blue-300 transition">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          {/* Option Label with Remove Button */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Option
                            </label>
                            <div className="px-3 py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-between">
                              <span className="font-semibold text-gray-800">{option.label}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(item.attributeCode, option.value)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                                title="Remove this option"
                              >
                                × Remove
                              </button>
                            </div>
                          </div>

                          {/* Price Modifier */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Price Modifier {!option.subOptions && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={option.priceModifier || 0}
                                onChange={(e) => handlePriceModifierChange(
                                  item.attributeCode,
                                  option.value,
                                  e.target.value
                                )}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0"
                                step="1"
                                disabled={option.subOptions && option.subOptions.options.length > 0}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {option.subOptions ? 'Set in nested options below' : (
                                <>
                                  {option.priceModifier > 0 && `+₹${option.priceModifier} additional`}
                                  {option.priceModifier < 0 && `₹${Math.abs(option.priceModifier)} discount`}
                                  {option.priceModifier === 0 && 'No change to base price'}
                                </>
                              )}
                            </p>
                          </div>

                          {/* Option Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Image (Optional)
                            </label>
                            {option.image ? (
                              <div className="relative group">
                                <img
                                  src={option.image.url}
                                  alt={option.label}
                                  className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(item.attributeCode, option.value)}
                                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <label className="cursor-pointer block">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files[0]) {
                                      handleImageUpload(item.attributeCode, option.value, e.target.files[0]);
                                    }
                                  }}
                                  className="hidden"
                                />
                                <div className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition">
                                  <span className="text-xs text-gray-500">+ Upload</span>
                                </div>
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Toggle Nested Options Button */}
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <button
                            type="button"
                            onClick={() => handleToggleNestedOptions(item.attributeCode, option.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                              option.subOptions
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                          >
                            {option.subOptions ? '− Remove Nested Options' : '+ Add Nested Options (e.g., Dimensions)'}
                          </button>
                          {!option.subOptions && (
                            <p className="text-xs text-gray-500 mt-2">
                              Use nested options when this choice requires additional selection (e.g., Size → Dimensions)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nested Options Section */}
                      {option.subOptions && (
                        <div className="bg-purple-50 p-4 border-t-2 border-purple-200">
                          <div className="flex items-center gap-2 mb-4">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 className="text-sm font-bold text-purple-800">
                              Nested Options for "{option.label}"
                            </h4>
                          </div>

                          {/* Select Nested Attribute from AttributeSet */}
                          {!option.subOptions.attributeCode ? (
                            <div className="mb-4">
                              <label className="block text-xs font-medium text-purple-700 mb-2">
                                Select Nested Attribute (from current Attribute Set) *
                              </label>
                              <select
                                onChange={(e) => {
                                  const selectedAttr = variantAttributes.find(attr => attr.code === e.target.value);
                                  if (selectedAttr) {
                                    handleSelectNestedAttribute(item.attributeCode, option.value, selectedAttr);
                                  }
                                }}
                                className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                                defaultValue=""
                              >
                                <option value="" disabled>Choose an attribute for nested options...</option>
                                {variantAttributes
                                  .filter(attr => attr.code !== item.attributeCode && attr.options && attr.options.length > 0)
                                  .map(attr => (
                                    <option key={attr.code} value={attr.code}>
                                      {attr.name} ({attr.options.length} options)
                                    </option>
                                  ))
                                }
                              </select>
                              <p className="text-xs text-purple-600 mt-2">
                                💡 Select another variant attribute from your attribute set. Its options will be used as nested choices.
                              </p>
                            </div>
                          ) : (
                            <div className="mb-4 p-3 bg-purple-100 rounded-lg border border-purple-300">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-purple-900">
                                    Nested Attribute: {option.subOptions.attributeName}
                                  </p>
                                  <p className="text-xs text-purple-700">
                                    Code: {option.subOptions.attributeCode} • {option.subOptions.options.length} options loaded
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleNestedOptions(item.attributeCode, option.value)}
                                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                >
                                  Change Attribute
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Nested Options - Checkboxes + Price Modifiers */}
                          {option.subOptions.availableOptions && option.subOptions.availableOptions.length > 0 ? (
                            <div className="space-y-3">
                              <p className="text-xs text-purple-700 mb-2 font-medium">
                                ✅ Select which {option.subOptions.attributeName} options to enable for "{option.label}" and set their prices:
                              </p>

                              {option.subOptions.availableOptions.map((availOpt, aIdx) => {
                                const isEnabled = option.subOptions.options.some(opt => opt.value === availOpt.value);
                                const enabledOption = option.subOptions.options.find(opt => opt.value === availOpt.value);

                                return (
                                  <div
                                    key={aIdx}
                                    className={`p-3 rounded-lg border-2 transition ${
                                      isEnabled
                                        ? 'bg-purple-50 border-purple-400'
                                        : 'bg-gray-50 border-gray-200 opacity-60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-4">
                                      {/* Checkbox to enable/disable */}
                                      <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                                        <input
                                          type="checkbox"
                                          checked={isEnabled}
                                          onChange={() => handleToggleNestedOption(
                                            item.attributeCode,
                                            option.value,
                                            availOpt.value
                                          )}
                                          className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                        />
                                        <div>
                                          <span className="font-semibold text-sm text-gray-800">{availOpt.label}</span>
                                          <span className="text-xs text-gray-500 ml-1">({availOpt.value})</span>
                                        </div>
                                      </label>

                                      {/* Price input - only show if enabled */}
                                      {isEnabled && (
                                        <div className="flex items-center gap-2 ml-auto">
                                          <label className="text-xs text-gray-600 font-medium whitespace-nowrap">
                                            Price:
                                          </label>
                                          <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                                              ₹
                                            </span>
                                            <input
                                              type="number"
                                              value={enabledOption?.priceModifier || 0}
                                              onChange={(e) => handleNestedPriceModifierChange(
                                                item.attributeCode,
                                                option.value,
                                                availOpt.value,
                                                e.target.value
                                              )}
                                              className="w-32 pl-8 pr-3 py-2 border border-purple-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                              step="100"
                                              placeholder="0"
                                            />
                                          </div>
                                          {enabledOption?.priceModifier !== 0 && (
                                            <span
                                              className={`text-xs font-semibold whitespace-nowrap ${
                                                enabledOption.priceModifier > 0 ? 'text-green-600' : 'text-red-600'
                                              }`}
                                            >
                                              {enabledOption.priceModifier > 0
                                                ? `+₹${enabledOption.priceModifier}`
                                                : `-₹${Math.abs(enabledOption.priceModifier)}`}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Summary */}
                              <div className="mt-3 p-2 bg-purple-100 rounded border border-purple-300">
                                <p className="text-xs text-purple-800">
                                  <strong>{option.subOptions.options.length}</strong> out of{' '}
                                  <strong>{option.subOptions.availableOptions.length}</strong> {option.subOptions.attributeName} options enabled
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-purple-600 text-sm">
                              Select a nested attribute to load options
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm">
                    No {item.attributeName.toLowerCase()} options added yet. Select from the dropdown above to add.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      {enabledAttributes.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h4 className="font-semibold text-sm text-green-800 mb-2">Variant Configuration Summary</h4>
          <p className="text-sm text-green-700">
            <strong>{enabledAttributes.length}</strong> variant attribute{enabledAttributes.length !== 1 ? 's' : ''} enabled with price modifiers.
            Customers will see the final price calculated as: <strong>Base Price + Selected Modifiers</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default VariantPricingManager;
