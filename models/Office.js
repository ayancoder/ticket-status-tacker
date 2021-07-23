const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    reuired: true,
  },
  staffs: [
    {
      user: {
        type: Schema.Types.ObjectId
      }
    }
  ],
});
module.exports = Office = mongoose.model('office', UserSchema)