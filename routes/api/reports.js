const express = require('express');
const router = express.Router();
var pdf = require("pdf-creator-node")
var fs = require('fs') 
const auth = require("../../middleware/auth");
const Ticket = require("../../models/Ticket");
const logger = require('../../config/winston');

router.post("/", auth, async (req, res) => {
    const user = await getUser(req.user.id)
    const query = await queryParams(req, user.office._id);
    const options = await getQueryOptions(req);
    await Ticket.paginate(query, options)
    .then((data) => {   
        generatePfd(data.docs, user, res)    
    })
    .catch((err) => {
      logger.info("error in fetching data", err);
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
const queryParams = async (req, officeId) => {
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
    query.office = officeId;
    if (subject) {
      query.subject = { $regex: new RegExp(subject), $options: "i" };
    }
    if (state) query.state = state;
    if (docketId) query.docketId = docketId;
    if (priority) query.priority = priority;
    if (startDate) query.createDate = { $gte: startDate, $lte: endDate };
    logger.info(`query params ${query}`)
    return query;
  };


const getUser = async (userId) => {

  const user = await User.findById(userId).populate("office")
  return user;
};

const generatePfd = (tickets, user, response) => {
  // Read HTML Template
  const html = fs.readFileSync("./html-template/template.html", "utf8");

  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
  };
  
  const officeNamePrefix = user.office.docketPrefix
  const fileName = new Date().toISOString() + "-" + "report.pdf"
  const dir = "./uploads/" + officeNamePrefix + "/" + getDate()+"/reports";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = dir + "/"+ fileName;
  logger.info(`file path ${filePath}`);
  officeAddress = { address: user.office.address };
  const str = JSON.stringify(tickets);
  const t = JSON.parse(str);
  logger.info(`tickts ${t}`)
  const document = {
    html: html,
    data: {
      office: officeAddress,
      tickets: t,
    },
    path: filePath,
    type: "",
  };

  pdf.create(document, options)
    .then((res) => {
        return response.status(200).send(res)
    })
    .catch((error) => {
      logger.error(error.message);
    });
    
};


const getDate = () => {
  const event = new Date();
  const mon = event.getMonth() + 1;
  const day = event.getDate();
  const year = event.getFullYear();
  const dateStr = day + "-" + mon + "-" + year;
  return dateStr;
}

module.exports = router;
