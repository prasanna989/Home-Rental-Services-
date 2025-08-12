const Property = require('../models/Property');
const { cloudinary } = require('../config/cloudinary');

// Get all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    return res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Add new property
exports.addProperty = async (req, res) => {
  try {
    let imageUrl = '';
    let cloudinaryId = '';

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr.message);
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
    }

    const newProperty = new Property({
      ...req.body,
      imageUrl,
      cloudinaryId
    });

    const savedProperty = await newProperty.save();
    return res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error adding property:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    // 1. Find the property
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    // 2. Handle image update first (if new image provided)
    if (req.file) {
      try {
        // Delete old image if exists
        if (property.cloudinaryId) {
          await cloudinary.uploader.destroy(property.cloudinaryId)
            .catch(err => console.error('Non-critical: Old image deletion failed:', err));
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'property-listings', // Optional: organize your Cloudinary files
          quality: 'auto:good' // Optimize image quality
        });
        
        // Update image references
        property.imageUrl = result.secure_url;
        property.cloudinaryId = result.public_id;
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr.message);
        return res.status(500).json({ 
          success: false, 
          message: 'Image upload failed',
          details: uploadErr.message 
        });
      }
    }

    // 3. Update other fields (excluding image-related fields)
    const excludedFields = ['imageUrl', 'cloudinaryId', '_id', '__v'];
    Object.keys(req.body).forEach(key => {
      if (!excludedFields.includes(key)) {
        // Special handling for amenities if sent as stringified array
        if (key === 'amenities' && typeof req.body[key] === 'string') {
          try {
            property[key] = JSON.parse(req.body[key]);
          } catch (e) {
            console.warn('Failed to parse amenities:', e);
          }
        } else {
          property[key] = req.body[key];
        }
      }
    });

    // 4. Save and respond
    const updatedProperty = await property.save();
    
    // Clean up the temporary file if using multer
    if (req.file && req.file.path) {
      const fs = require('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Temp file cleanup failed:', err);
      });
    }

    // Return standardized response
    return res.status(200).json({
      success: true,
      data: {
        ...updatedProperty.toObject(),
        // Ensure fresh image URL is returned
        imageUrl: property.imageUrl,
        cloudinaryId: property.cloudinaryId
      }
    });

  } catch (error) {
    console.error('Error updating property:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(property.cloudinaryId);
      } catch (deleteErr) {
        console.error('Cloudinary deletion failed:', deleteErr.message);
      }
    }

    await Property.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
      _id: req.params.id
    });
  } catch (error) {
    console.error('Error deleting property:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
