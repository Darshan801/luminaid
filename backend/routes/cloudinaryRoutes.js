const express = require('express');
const cloudinary = require('../config/cloudinary');

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
    console.error('Cloudinary connection failed:', error);

    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
    });
  }
});

module.exports = router;