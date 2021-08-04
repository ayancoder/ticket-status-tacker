const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    reuired: true,
    uniqure: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["SUPER_ADMIN", "ADMIN", "TICKET_CREATOR", "TICKET_OPERATOR"],
    default: "TICKET_OPERATOR"
  },
  designation: {
    type: String,
  },
  avatar: {
    type: String,
  },
  photo: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "office"
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = User = mongoose.model("user", UserSchema);
