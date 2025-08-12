const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { storage } = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage });

router.get('/', propertyController.getAllProperties);
router.post('/', upload.single('image'), propertyController.addProperty);
router.put('/:id', upload.single('image'), propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;