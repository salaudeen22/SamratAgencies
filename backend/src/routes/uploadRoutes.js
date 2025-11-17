const express = require('express');
const router = express.Router();
const {
  uploadSingle,
  uploadMultiple,
  processSingleImage,
  processMultipleImages,
  handleUploadError
} = require('../middleware/uploadS3');
const { auth, adminAuth } = require('../middleware/auth');
const { DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { s3Client, bucketConfig } = require('../config/s3');

// @route   POST /api/upload/image
// @desc    Upload single image (auto-converts to WebP)
// @access  Private/Admin
router.post('/image', auth, adminAuth, uploadSingle, processSingleImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  // Return the uploaded file information
  const response = {
    message: 'Image uploaded and converted successfully',
    file: {
      url: req.file.location,
      key: req.file.key,
      size: req.file.size,
      mimetype: req.file.mimetype,
    }
  };

  // Add compression stats if available
  if (req.file.compressionRatio) {
    response.file.originalSize = req.file.originalSize;
    response.file.compressionRatio = req.file.compressionRatio;
  }

  res.json(response);
});

// @route   POST /api/upload/images
// @desc    Upload multiple images (auto-converts to WebP)
// @access  Private (authenticated users)
router.post('/images', auth, uploadMultiple, processMultipleImages, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Please upload at least one image' });
  }

  // Return the uploaded files information
  const images = req.files.map(file => ({
    url: file.location,
    public_id: file.key,
    size: file.size,
    mimetype: file.mimetype,
    ...(file.compressionRatio && {
      originalSize: file.originalSize,
      compressionRatio: file.compressionRatio
    })
  }));

  res.json({
    message: `${images.length} image(s) uploaded and converted successfully`,
    images: images
  });
});

// @route   GET /api/upload/files
// @desc    List all files from S3
// @access  Private/Admin
router.get('/files', auth, adminAuth, async (req, res) => {
  try {
    const listParams = {
      Bucket: bucketConfig.bucketName,
      MaxKeys: 1000 // Adjust as needed
    };

    const command = new ListObjectsV2Command(listParams);
    const response = await s3Client.send(command);

    const files = (response.Contents || []).map(file => ({
      key: file.Key,
      url: `https://${bucketConfig.bucketName}.s3.${bucketConfig.region}.amazonaws.com/${file.Key}`,
      size: file.Size,
      lastModified: file.LastModified,
      name: file.Key.split('/').pop() // Extract filename from key
    }));

    res.json({
      message: 'Files retrieved successfully',
      files,
      count: files.length
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ message: 'Failed to list files', error: error.message });
  }
});

// @route   DELETE /api/upload/image
// @desc    Delete image from S3
// @access  Private/Admin
router.delete('/image', auth, adminAuth, async (req, res) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ message: 'Image key is required' });
    }

    // Delete from S3
    const deleteParams = {
      Bucket: bucketConfig.bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
});

module.exports = router;
