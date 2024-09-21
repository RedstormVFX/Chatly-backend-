const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: 'active',
  },
});

module.exports = mongoose.model('User', UserSchema);
