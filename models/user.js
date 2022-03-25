const mongoose = require('mongoose');

// Mongoose Model
const userSchema = new mongoose.Schema({
  public_key: {
    type: String,
    unique: true,
    required: true,
  },
})
userSchema
.virtual('url')
.get(function () {
  return '/' + this._id;
});

// Export Mongoose "User" model
module.exports = mongoose.model('User', userSchema)
