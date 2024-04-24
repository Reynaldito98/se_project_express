const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
  },
  avatar: {
      type: String,
      required: true,
      validate: {
          validator:  (v) => validator.isURL(v),
          message: 'You must enter a valid URL',
      }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'You must enter a valid email',
    }
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false
  }
});

module.exports = mongoose.model('user', userSchema);