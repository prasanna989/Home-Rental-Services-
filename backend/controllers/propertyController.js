const Property = require('../models/Property');
const { cloudinary } = require('../config/cloudinary');

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new property
exports.addProperty = async (req, res) => {
  try {
    // Upload image to Cloudinary if exists
    let imageUrl = '';
    let cloudinaryId = '';
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      cloudinaryId = result.public_id;
    }

    const newProperty = new Property({
      ...req.body,
      imageUrl,
      cloudinaryId
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (property.cloudinaryId) {
        await cloudinary.uploader.destroy(property.cloudinaryId);
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      property.imageUrl = result.secure_url;
      property.cloudinaryId = result.public_id;
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'imageUrl' && key !== 'cloudinaryId') {
        property[key] = req.body[key];
      }
    });

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete image from Cloudinary if exists
    if (property.cloudinaryId) {
      await cloudinary.uploader.destroy(property.cloudinaryId);
    }

    await property.remove();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};