const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

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
  severity: {
    type: String,
    enum: ["CRITICAL", "MAJOR", "MINOR", "DUMPED"],
    default: "MINOR",
  },
  state: {
    type: String,
    enum: ["NEW", "ASSIGNED", "IN-PROGRESS", "RESOLVED", "CLOSED"],
    default: "NEW",
  },
  filePath: {
    type: String,
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
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

TicketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ticket", TicketSchema);
