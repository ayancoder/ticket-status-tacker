const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  creatorName: {
    type: String,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  assignedToName: {
    type: String,
  },
  officeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "office"
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  source: {
    type: String
  },
  priority: {
    type: Number,
  },
  state: {
    type: String,
    enum: ["NEW", "ASSIGNED", "IN-PROGRESS", "RESOLVED", "CLOSED", "DUMPPED"],
    default: "NEW",
  },
  filePath: {
    type: String,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  assignDate: {
    type: Date,
  },
  comments: [
    {
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ]
});

TicketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ticket", TicketSchema);
