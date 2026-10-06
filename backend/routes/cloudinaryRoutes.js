const express = require('express');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      message: 'Cloudinary connected successfully',
      result,
    });
  } catch (error) {
    logger.error('Cloudinary connection failed:', error);

    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
    });
  }
});

module.exports = router;