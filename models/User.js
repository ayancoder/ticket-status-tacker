const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    enum: ["SUPER_ADMIN", "BDO", "CC_OFFICER", "DEALING_OFFICER"],
    default: "DEALING_OFFICER",
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
    ref: "office",
  },
  // cc-clerk creates ticktes. 
  createdTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    },
  ],
  assignedTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    },
  ],
  inprogressTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    },
  ],

  resolvedTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    },
  ],
  concludedTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    },
  ],
  copiedTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ticket"
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.plugin(mongoosePaginate);
module.exports = User = mongoose.model("user", UserSchema);