const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  rentPerDay: { type: Number, required: true },
  location: { type: String, required: true },
  available: { type: Boolean, default: true },
  imageUrl: { type: String },
  amenities: { type: [String], default: [] },
  cloudinaryId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);