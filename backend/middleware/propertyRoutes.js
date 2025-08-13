const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// ====== OWNER ROUTES ======

// Get all properties of logged-in owner
router.get('/my-properties', auth(['owner']), async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a property (owner only)
router.post('/', auth(['owner']), async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      owner: req.user.id
    });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property (owner only)
router.put('/:id', auth(['owner']), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access forbidden' });

    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property (owner only)
router.delete('/:id', auth(['owner']), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access forbidden' });

    await property.remove();
    res.json({ message: 'Property deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ====== TENANT ROUTES ======

// Get all properties (tenant)
router.get('/', auth(['tenant', 'owner']), async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single property by ID
router.get('/:id', auth(['tenant', 'owner']), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Owner can only see their own property here if desired
    if (req.user.role === 'owner' && property.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Access forbidden' });

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
