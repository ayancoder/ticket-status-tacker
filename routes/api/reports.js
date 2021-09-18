const express = require('express');
const router = express.Router();
var pdf = require("pdf-creator-node")
var fs = require('fs') 
const auth = require("../../middleware/auth");
const Ticket = require("../../models/Ticket");

router.post("/", auth, async (req, res) => {

    const query = await queryParams(req);
    const options = await getQueryOptions(req);
    await Ticket.paginate(query, options)
    .then((data) => {   
        //console.log("data", data)   
        generatePfd(data.docs, res)    
    })
    .catch((err) => {
      console.log("error in fetching data", err);
      return res.status(500).send("Server Error");
    }); 
    
});

const getQueryOptions = async (req) => {
    const assignedTo  = { path: "assignedTo", select: "name" };
    const options = {
      page: 1,
      limit: 15,
      select:
        "docketId subject source ",
      sort: { docketId: 1},
      populate: assignedTo,
    };
    return options;
  };
// create query object to get data from data base.
const queryParams = async (req) => {
    const assignedId = req.body.assign;
    const creatorId = req.body.creator;
    const docketId = req.body.docketId;
    const subject = req.body.subject;
    const state = req.body.state;
    const priority = req.body.priority;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
  
    // Build query object
    const query = {};
  
    if (creatorId) query.creator = creatorId;
    if (assignedId) query.assignedTo = assignedId;
    // if creatorId and assiged Id is not spcified then
    //  get office wise tickts
    query.office = await getOfficeId(req.user.id);
    if (subject) {
      query.subject = { $regex: new RegExp(subject), $options: "i" };
    }
    if (state) query.state = state;
    if (docketId) query.docketId = docketId;
    if (priority) query.priority = priority;
    if (startDate) query.createDate = { $gte: startDate, $lte: endDate };
    console.log("query params", query)
    return query;
  };

// get office id of user.
const getOfficeId = async (userId) => {
    const user = await User.findById(userId).select(
      "-password  -createdTickets -assignedTickets -inprogressTickets -resolvedTickets -concludedTickets"
    );
    return user.office;
  };

const generatePfd = (tickets, response) => {
  // Read HTML Template
  const html = fs.readFileSync("./html-template/template.html", "utf8");

  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
  };
  const office = { address: "Manbazar 2, Purulia, West Bengal" };
  const str = JSON.stringify(tickets);
  console.log("tickts", str);
  const t = JSON.parse(str);
  console.log("tickts", t)
  const document = {
    html: html,
    data: {
      office: office,
      tickets: t,
    },
    path: "./output.pdf",
    type: "",
  };

  pdf.create(document, options)
    .then((res) => {
        return response.status(200).send(res)
    })
    .catch((error) => {
      console.error(error);
    });
    
};

module.exports = router;
