const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const sharp = require('sharp');
const { Upload } = require('@aws-sdk/lib-storage');
const { addWatermark, addInvisibleWatermark } = require('../utils/imageWatermark');

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed!'), false);
  }
};

// Check if AWS S3 is configured
const isS3Configured = () => {
  return (
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_S3_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID !== 'your_aws_access_key_id' &&
    process.env.AWS_S3_BUCKET_NAME !== 'your_bucket_name'
  );
};

// Configure multer storage - use memory storage for processing
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (before compression)
  }
});

// Middleware for single image upload
const uploadSingle = upload.single('image');

// Middleware for multiple images upload (max 10)
const uploadMultiple = upload.array('images', 10);

// Convert image to WebP and upload to S3
const convertAndUploadToS3 = async (fileBuffer, originalname, mimetype) => {
  const { s3Client, bucketConfig } = require('../config/s3');

  // Skip SVG files - upload them as-is
  if (mimetype === 'image/svg+xml') {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `products/${uniqueSuffix}.svg`;

    const uploadParams = {
      Bucket: bucketConfig.bucketName,
      Key: filename,
      Body: fileBuffer,
      ContentType: mimetype,
      ACL: bucketConfig.acl,
    };

    const parallelUpload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await parallelUpload.done();

    return {
      location: result.Location || `https://${bucketConfig.bucketName}.s3.${bucketConfig.region}.amazonaws.com/${filename}`,
      key: filename,
      size: fileBuffer.length,
      mimetype: 'image/svg+xml',
    };
  }

  // Convert to WebP with compression
  let webpBuffer = await sharp(fileBuffer)
    .webp({
      quality: 85, // Good balance between quality and size
      effort: 6,   // Higher effort = better compression (0-6)
    })
    .toBuffer();

  // Add invisible watermark (copyright metadata)
  webpBuffer = await addInvisibleWatermark(webpBuffer, {
    copyright: '© Samrat Agencies. All Rights Reserved.',
    artist: 'Samrat Agencies',
    description: 'This image is copyrighted and protected.',
  });

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `products/${uniqueSuffix}.webp`;

  const uploadParams = {
    Bucket: bucketConfig.bucketName,
    Key: filename,
    Body: webpBuffer,
    ContentType: 'image/webp',
    ACL: bucketConfig.acl,
  };

  const parallelUpload = new Upload({
    client: s3Client,
    params: uploadParams,
  });

  const result = await parallelUpload.done();

  return {
    location: result.Location || `https://${bucketConfig.bucketName}.s3.${bucketConfig.region}.amazonaws.com/${filename}`,
    key: filename,
    size: webpBuffer.length,
    mimetype: 'image/webp',
    originalSize: fileBuffer.length,
    compressionRatio: ((1 - webpBuffer.length / fileBuffer.length) * 100).toFixed(2) + '%'
  };
};

// Convert image to WebP and save locally (fallback)
const convertAndSaveLocally = async (fileBuffer, originalname, mimetype) => {
  const fs = require('fs').promises;
  const uploadDir = 'uploads/';

  // Create uploads directory if it doesn't exist
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  // Skip SVG files
  if (mimetype === 'image/svg+xml') {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `product-${uniqueSuffix}.svg`;
    const filepath = uploadDir + filename;

    await fs.writeFile(filepath, fileBuffer);

    return {
      location: `/uploads/${filename}`,
      key: filename,
      path: filepath,
      size: fileBuffer.length,
      mimetype: 'image/svg+xml',
    };
  }

  // Convert to WebP
  const webpBuffer = await sharp(fileBuffer)
    .webp({
      quality: 85,
      effort: 6,
    })
    .toBuffer();

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `product-${uniqueSuffix}.webp`;
  const filepath = uploadDir + filename;

  await fs.writeFile(filepath, webpBuffer);

  return {
    location: `/uploads/${filename}`,
    key: filename,
    path: filepath,
    size: webpBuffer.length,
    mimetype: 'image/webp',
    originalSize: fileBuffer.length,
    compressionRatio: ((1 - webpBuffer.length / fileBuffer.length) * 100).toFixed(2) + '%'
  };
};

// Process single uploaded image
const processSingleImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    let result;

    if (isS3Configured()) {
      result = await convertAndUploadToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    } else {
      console.warn('⚠️  AWS S3 not configured. Using local disk storage.');
      result = await convertAndSaveLocally(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    // Replace req.file with processed result
    req.file = {
      ...req.file,
      ...result,
    };

    next();
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({
      message: 'Failed to process image',
      error: error.message
    });
  }
};

// Process multiple uploaded images
const processMultipleImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const processedFiles = [];

    for (const file of req.files) {
      let result;

      if (isS3Configured()) {
        result = await convertAndUploadToS3(
          file.buffer,
          file.originalname,
          file.mimetype
        );
      } else {
        console.warn('⚠️  AWS S3 not configured. Using local disk storage.');
        result = await convertAndSaveLocally(
          file.buffer,
          file.originalname,
          file.mimetype
        );
      }

      processedFiles.push({
        ...file,
        ...result,
      });
    }

    req.files = processedFiles;
    next();
  } catch (error) {
    console.error('Error processing images:', error);
    return res.status(500).json({
      message: 'Failed to process images',
      error: error.message
    });
  }
};

// Error handler middleware for multer errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 10MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Too many files. Maximum is 10 images.' });
    }
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  processSingleImage,
  processMultipleImages,
  handleUploadError,
  convertAndUploadToS3,
  isS3Configured,
};
