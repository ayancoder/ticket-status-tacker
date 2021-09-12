const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const cron = require('node-cron');
const Office = require('./Office');
const Counter = require('./TicketCounter');

const TicketSchema = new mongoose.Schema({
  docketId: {
    type: String,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  office: {
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
        type: mongoose.Schema.Types.ObjectId,
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

TicketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const officeId = this.office;
    const office = await Office.findById(officeId);
    const id = await Counter.getNextId("Tickets", officeId);
    const event = new Date();
    const mon = event.getMonth() + 1;
    const day = event.getDate();
    const year = event.getFullYear();
    const dateStr = mon + "-" + day + "-" + year;
    const docketId = office.docketPrefix + "/" + dateStr + "/" + id;
    this.docketId = docketId;
    next();
  } else {
    next();
  }
});

/*
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * * 
 */
// run the corn job at 1 st jan
cron.schedule("0 1 0 1 January *", (req, res, next) => {

  Counter.find({ model: "tickets" }, function (err, counters) {
    counters.forEach((counter) => {
      console.log(counter);
      Counter.counterReset("tickets", counter.identifier);
    });
  });
});

TicketSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ticket", TicketSchema);
