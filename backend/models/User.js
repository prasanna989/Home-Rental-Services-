const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  role: { type: String, enum: ['tenant', 'owner', 'admin'], default: 'tenant' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  profileImageUrl: String,
  bio: String,
  dateOfBirth: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
