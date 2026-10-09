const multer = require('multer');

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: MAX_IMAGES },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }

    cb(null, true);
  }
}).array('images', MAX_IMAGES);

exports.uploadImages = (req, res, next) => {
  upload(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    next();
  });
};