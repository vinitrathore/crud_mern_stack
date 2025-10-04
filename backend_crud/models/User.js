// models/User.js
const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,       // name is required
    trim: true            // removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,       // email is required
    unique: true,         // no two users can have the same email
    lowercase: true,      // converts email to lowercase
    trim: true
  },
  phone: {
    type: String,
    required: true,       // phone number is required
    trim: true
  },
  isDelete:{
    type:Boolean,
    // required:true,
    default:false
  }
}, {
  timestamps: true        // adds createdAt and updatedAt timestamps automatically
});

// userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

module.exports = mongoose.model('User', userSchema);
