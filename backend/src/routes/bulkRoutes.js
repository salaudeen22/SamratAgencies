const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const { createObjectCsvStringifier } = require('csv-writer');
const { Readable } = require('stream');
const { auth, adminAuth } = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Configure multer for CSV uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// ============ IMPORT OPERATIONS ============

// @route   POST /api/bulk/import/products
// @desc    Import products from CSV
// @access  Private/Admin
router.post('/import/products', auth, adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = {
      total: 0,
      success: 0,
      failed: 0,
      errors: []
    };

    const products = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (data) => {
        results.total++;
        products.push(data);
      })
      .on('end', async () => {
        for (let i = 0; i < products.length; i++) {
          const row = products[i];
          const rowNum = i + 2; // +2 for header and 0-index

          try {
            // Validate required fields
            if (!row.name || !row.sku) {
              results.failed++;
              results.errors.push({
                row: rowNum,
                error: 'Missing required fields: name or SKU'
              });
              continue;
            }

            // Check if product exists by SKU
            let product = await Product.findOne({ sku: row.sku });

            const productData = {
              name: row.name,
              sku: row.sku,
              description: row.description || '',
              price: parseFloat(row.price) || 0,
              stock: parseInt(row.stock) || 0,
              category: row.category || null,
              images: row.images ? row.images.split(';').map(url => url.trim()) : [],
              availabilityType: row.availabilityType || 'immediate',
              isActive: row.isActive !== 'false'
            };

            if (product) {
              // Update existing product
              Object.assign(product, productData);
              await product.save();
            } else {
              // Create new product
              product = new Product(productData);
              await product.save();
            }

            results.success++;
          } catch (error) {
            results.failed++;
            results.errors.push({
              row: rowNum,
              error: error.message
            });
          }
        }

        res.json({
          message: 'Import completed',
          results
        });
      })
      .on('error', (error) => {
        res.status(500).json({ message: 'Failed to parse CSV', error: error.message });
      });
  } catch (error) {
    console.error('Import products error:', error);
    res.status(500).json({ message: 'Failed to import products', error: error.message });
  }
});

// @route   POST /api/bulk/import/users
// @desc    Import users from CSV
// @access  Private/Admin
router.post('/import/users', auth, adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = {
      total: 0,
      success: 0,
      failed: 0,
      errors: []
    };

    const users = [];
    const stream = Readable.from(req.file.buffer);

    stream
      .pipe(csv())
      .on('data', (data) => {
        results.total++;
        users.push(data);
      })
      .on('end', async () => {
        for (let i = 0; i < users.length; i++) {
          const row = users[i];
          const rowNum = i + 2;

          try {
            if (!row.email || !row.name) {
              results.failed++;
              results.errors.push({
                row: rowNum,
                error: 'Missing required fields: email or name'
              });
              continue;
            }

            // Check if user exists
            const existingUser = await User.findOne({ email: row.email });
            if (existingUser) {
              results.failed++;
              results.errors.push({
                row: rowNum,
                error: 'User with this email already exists'
              });
              continue;
            }

            const user = new User({
              name: row.name,
              email: row.email,
              phone: row.phone || '',
              password: row.password || 'ChangeMe@123', // Default password
              isAdmin: row.role === 'admin'
            });

            await user.save();
            results.success++;
          } catch (error) {
            results.failed++;
            results.errors.push({
              row: rowNum,
              error: error.message
            });
          }
        }

        res.json({
          message: 'Import completed',
          results
        });
      })
      .on('error', (error) => {
        res.status(500).json({ message: 'Failed to parse CSV', error: error.message });
      });
  } catch (error) {
    console.error('Import users error:', error);
    res.status(500).json({ message: 'Failed to import users', error: error.message });
  }
});

// ============ EXPORT OPERATIONS ============

// @route   GET /api/bulk/export/products
// @desc    Export products to CSV
// @access  Private/Admin
router.get('/export/products', auth, adminAuth, async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .lean();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'sku', title: 'SKU' },
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'category', title: 'Category' },
        { id: 'price', title: 'Price' },
        { id: 'stock', title: 'Stock' },
        { id: 'availabilityType', title: 'AvailabilityType' },
        { id: 'images', title: 'Images' },
        { id: 'isActive', title: 'IsActive' }
      ]
    });

    const records = products.map(product => ({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      category: product.category?._id || '',
      price: product.price,
      stock: product.stock || 0,
      availabilityType: product.availabilityType,
      images: product.images.join(';'),
      isActive: product.isActive
    }));

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({ message: 'Failed to export products', error: error.message });
  }
});

// @route   GET /api/bulk/export/users
// @desc    Export users to CSV
// @access  Private/Admin
router.get('/export/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'email', title: 'Email' },
        { id: 'name', title: 'Name' },
        { id: 'phone', title: 'Phone' },
        { id: 'role', title: 'Role' },
        { id: 'createdAt', title: 'CreatedAt' }
      ]
    });

    const records = users.map(user => ({
      email: user.email,
      name: user.name,
      phone: user.phone || '',
      role: user.isAdmin ? 'admin' : 'customer',
      createdAt: new Date(user.createdAt).toISOString().split('T')[0]
    }));

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ message: 'Failed to export users', error: error.message });
  }
});

// @route   GET /api/bulk/export/orders
// @desc    Export orders to CSV
// @access  Private/Admin
router.get('/export/orders', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'email name')
      .lean();

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'orderId', title: 'OrderID' },
        { id: 'customerEmail', title: 'CustomerEmail' },
        { id: 'customerName', title: 'CustomerName' },
        { id: 'totalPrice', title: 'Total' },
        { id: 'status', title: 'Status' },
        { id: 'paymentMethod', title: 'PaymentMethod' },
        { id: 'isPaid', title: 'IsPaid' },
        { id: 'isDelivered', title: 'IsDelivered' },
        { id: 'createdAt', title: 'Date' }
      ]
    });

    const records = orders.map(order => ({
      orderId: order._id.toString(),
      customerEmail: order.user?.email || 'N/A',
      customerName: order.user?.name || 'N/A',
      totalPrice: order.totalPrice,
      status: order.status,
      paymentMethod: order.paymentMethod,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
      createdAt: new Date(order.createdAt).toISOString().split('T')[0]
    }));

    const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=orders_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({ message: 'Failed to export orders', error: error.message });
  }
});

// ============ TEMPLATES ============

// @route   GET /api/bulk/template/:type
// @desc    Download CSV template
// @access  Private/Admin
router.get('/template/:type', auth, adminAuth, (req, res) => {
  const { type } = req.params;

  let csvStringifier;

  switch (type) {
    case 'products':
      csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'sku', title: 'SKU' },
          { id: 'name', title: 'Name' },
          { id: 'description', title: 'Description' },
          { id: 'category', title: 'Category' },
          { id: 'price', title: 'Price' },
          { id: 'stock', title: 'Stock' },
          { id: 'availabilityType', title: 'AvailabilityType' },
          { id: 'images', title: 'Images' },
          { id: 'isActive', title: 'IsActive' }
        ]
      });
      break;

    case 'users':
      csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'email', title: 'Email' },
          { id: 'name', title: 'Name' },
          { id: 'phone', title: 'Phone' },
          { id: 'role', title: 'Role' },
          { id: 'password', title: 'Password' }
        ]
      });
      break;

    case 'orders':
      csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'orderId', title: 'OrderID' },
          { id: 'customerEmail', title: 'CustomerEmail' },
          { id: 'total', title: 'Total' },
          { id: 'status', title: 'Status' },
          { id: 'date', title: 'Date' }
        ]
      });
      break;

    default:
      return res.status(400).json({ message: 'Invalid template type' });
  }

  const csv = csvStringifier.getHeaderString();

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_template.csv`);
  res.send(csv);
});

module.exports = router;
