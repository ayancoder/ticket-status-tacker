const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  staffs: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
module.exports = Office = mongoose.model("office", UserSchema);
