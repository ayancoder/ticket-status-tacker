const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  role: {
    type: String,
  },
  address: {
    type: String,
  },
  office: {
    type: String,
  },
  photo: {
    type: String,
  },
  phone: {
    type: String,
  }
});

module.exports = mongoose.model('profile', ProfileSchema);