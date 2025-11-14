const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to compare variant selections
const variantsMatch = (variants1, variants2) => {
  if (!variants1 && !variants2) return true;
  if (!variants1 || !variants2) return false;

  const obj1 = variants1 instanceof Map ? Object.fromEntries(variants1) : variants1;
  const obj2 = variants2 instanceof Map ? Object.fromEntries(variants2) : variants2;

  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key, index) => {
    return key === keys2[index] && obj1[key] === obj2[key];
  });
};

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedVariants, calculatedPrice } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ message: 'Product is not available' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    // Find item with same product AND same variant selections
    const itemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      variantsMatch(item.selectedVariants, selectedVariants)
    );

    // Use calculatedPrice if provided (for variants), otherwise use product.price
    const finalPrice = calculatedPrice || product.price;

    if (itemIndex > -1) {
      // Item with same product and variants exists - increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // New item - add to cart
      cart.items.push({
        product: productId,
        quantity,
        price: finalPrice,
        selectedVariants: selectedVariants || {}
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, selectedVariants } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find item with same product AND same variant selections
    const itemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      variantsMatch(item.selectedVariants, selectedVariants)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { selectedVariants } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out item with matching product AND variant selections
    cart.items = cart.items.filter(item =>
      !(item.product.toString() === productId &&
        variantsMatch(item.selectedVariants, selectedVariants))
    );

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
