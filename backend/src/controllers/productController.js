const Product = require('../models/Product');
const Category = require('../models/Category');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, bucketConfig } = require('../config/s3');

// Helper function to get all child category IDs recursively
async function getAllChildCategoryIds(categoryId) {
  const childCategories = await Category.find({ parent: categoryId });
  let allIds = [categoryId];

  for (const child of childCategories) {
    const childIds = await getAllChildCategoryIds(child._id);
    allIds = allIds.concat(childIds);
  }

  return allIds;
}

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = {};

    if (category) {
      console.log('Category parameter received:', category);

      let categoryId;

      // Check if category is a valid ObjectId
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);

      if (isObjectId) {
        categoryId = category;
        console.log('Using category ID:', category);
      } else {
        // Find category by slug or name
        const categoryDoc = await Category.findOne({
          $or: [
            { slug: category },
            { name: { $regex: new RegExp(`^${category}$`, 'i') } }
          ]
        });

        console.log('Category lookup result:', categoryDoc);

        if (categoryDoc) {
          categoryId = categoryDoc._id;
          console.log('Using category ID from lookup:', categoryDoc._id);
        } else {
          console.log('No category found for:', category);
        }
      }

      // Get all child categories recursively
      if (categoryId) {
        const allCategoryIds = await getAllChildCategoryIds(categoryId);
        console.log('Including category IDs (parent + children):', allCategoryIds);
        query.category = { $in: allCategoryIds };
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    if (sort === 'price-desc') sortOption.price = -1;
    if (sort === 'name-asc') sortOption.name = 1;
    if (sort === 'name-desc') sortOption.name = -1;
    if (sort === 'newest') sortOption.createdAt = -1;
    if (sort === 'rating') sortOption.rating = -1;

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('attributeSet', 'name')
      .sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product (by ID or slug)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it's a MongoDB ObjectId or a slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const query = isObjectId ? { _id: id } : { slug: id };

    const product = await Product.findOne(query)
      .populate('category', 'name slug description')
      .populate({
        path: 'attributeSet',
        populate: {
          path: 'attributes.attribute'
        }
      });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category', 'name slug')
      .populate('attributeSet', 'name')
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add images to product (Admin only)
exports.addProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body; // Array of {url, key}

    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add new images to the product
    const newImages = images.map(img => ({
      url: img.url,
      public_id: img.key // Using key as public_id for consistency
    }));

    product.images.push(...newImages);
    await product.save();

    res.json({
      message: 'Images added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove image from product (Admin only)
exports.removeProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageKey } = req.body;

    if (!imageKey) {
      return res.status(400).json({ message: 'Image key is required' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find and remove the image from product
    const imageIndex = product.images.findIndex(img => img.public_id === imageKey);

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found in product' });
    }

    product.images.splice(imageIndex, 1);
    await product.save();

    // Delete from S3
    try {
      const deleteParams = {
        Bucket: bucketConfig.bucketName,
        Key: imageKey,
      };
      const command = new DeleteObjectCommand(deleteParams);
      await s3Client.send(command);
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error);
      // Continue even if S3 deletion fails
    }

    res.json({
      message: 'Image removed successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
