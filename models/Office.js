const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emails: [
    {
      type: String,
    },
  ],
  address: {
    type: String,
  },
  staffs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
module.exports = Office = mongoose.model("office", UserSchema);
