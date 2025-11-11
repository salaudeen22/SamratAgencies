const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/uploadS3');
const { auth, adminAuth } = require('../middleware/auth');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, bucketConfig } = require('../config/s3');

// @route   POST /api/upload/image
// @desc    Upload single image
// @access  Private/Admin
router.post('/image', auth, adminAuth, (req, res) => {
  uploadSingle(req, res, function (err) {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    // Return the uploaded file information
    res.json({
      message: 'Image uploaded successfully',
      file: {
        url: req.file.location, // S3 URL
        key: req.file.key,      // S3 key for deletion
        size: req.file.size,
        mimetype: req.file.mimetype,
      }
    });
  });
});

// @route   POST /api/upload/images
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/images', auth, adminAuth, (req, res) => {
  uploadMultiple(req, res, function (err) {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one image' });
    }

    // Return the uploaded files information
    const files = req.files.map(file => ({
      url: file.location,
      key: file.key,
      size: file.size,
      mimetype: file.mimetype,
    }));

    res.json({
      message: `${files.length} image(s) uploaded successfully`,
      files: files
    });
  });
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
