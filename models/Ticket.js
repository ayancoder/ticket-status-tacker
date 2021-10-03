const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const cron = require('node-cron');
const Office = require('./Office');
const Counter = require('./TicketCounter');
const constants = require('../const/constants');
const moment = require('moment');

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
  copiedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
  ],
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "office",
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  source: {
    type: String,
  },
  priority: {
    type: Number,
  },
  state: {
    type: String,
    enum: [constants.NEW_STATE, constants.ASSIGNED_STATE , constants.IN_PROGRESS_STATE , constants.RESOLVED_STATE
       ,constants.CONCLUDED_STATE , constants.DUMPPED_STATE],
    default: constants.NEW_STATE,
  },
  imageFilePath: [{ 
    type: String
  
  }],
   pdfFilePath: [{ 
    type: String
  
  }],
  createDate: {
    type: Date,
    default: Date.now,
  },
  assignDate: {
    type: Date,
  },
  etaDate: {
    type: Date,
  },
  comments: [
    {
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      text: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

TicketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const officeId = this.office;
    const office = await Office.findById(officeId);
    const id = await Counter.getNextId("Tickets", officeId);
    const dateStr = moment().format('DD-MM-YYYY');
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
