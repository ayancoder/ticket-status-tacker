const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fs = require('fs');
const mv = require('mv');
const ObjectId = mongoose.Types.ObjectId;
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const User = require("../../models/User");
const Ticket = require("../../models/Ticket");
const constants = require('../../const/constants');
const logger = require('../../config/winston');

// @route    POST api/tickets
// @desc     Create a ticket subject and source passed in body. creatorid be fetched from token.
// @access   Private
router.post(
  "/",
  auth,
  check("subject", "subject is required").notEmpty(),
  check("source", "source is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      logger.info(`user creating tickets: ${JSON.stringify(req.user)}`);
      const user = await User.findById(req.user.id).populate("office");

      const newTicket = new Ticket({
        subject: req.body.subject,
        source: req.body.source,
        creator: req.user.id,
        office: user.office._id,
        avatar: user.avatar,

      });
      const filePaths = moveFiles(req.body.imageFilePath, req.body.pdfFilePath, newTicket._id);
      newTicket.imageFilePath = filePaths.imgFiles;
      newTicket.pdfFilePath = filePaths.pdfFiles;
      const ticket = await newTicket.save();
      console.log("ticket ", ticket);
      // update user with ticket id
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { createdTickets: ticket._id } },
        { new: true, setDefaultsOnInsert: true }
      );
      const creator = { path: "creator", select: "name" };
      Ticket.populate(ticket, creator, function (err, data) {
        if(err) {
          logger.error(`could not save ticket ${JSON.stringify(err.message)}`);
        }
        return res.json(ticket);
      }); 
      
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

const moveFiles = (imageFilePaths, pdfFilePaths, ticketId) => {
  console.log("imageFilePaths pdfFilePaths",imageFilePaths, pdfFilePaths)
  let pdfFiles = [];
  let imgFiles = [];
  imageFilePaths.forEach(imgFilePath => {
    if (imgFilePath) {
      const lastIndex = imgFilePath.lastIndexOf("/");
      const existingDir = imgFilePath.substr(0, lastIndex);
      const newDir = existingDir + "/" + ticketId;
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }

      const imgFileName = imgFilePath.substr(lastIndex + 1, imgFilePath.length);
      const newImgFilePath = newDir + "/" + imgFileName;
      console.log("old image path",imgFilePath);
      logger.info(`new image file path ${newImgFilePath}`)
      mv(imgFilePath, newImgFilePath, function (err) {
        logger.error(err);
      });
      imgFiles.push(newImgFilePath);
    }
  });

  pdfFilePaths.forEach(pdfFilePath => {
    if (pdfFilePath) {
      const lastIndex = pdfFilePath.lastIndexOf("/");
      const existingDir = pdfFilePath.substr(0, lastIndex);

      const newDir = existingDir + "/" + ticketId;
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      const pdfFileName = pdfFilePath.substr(lastIndex + 1, pdfFilePath.length);
      const newPdfFilePath = newDir + "/" + pdfFileName;
      console.log("old pdf path",imgFilePath);
      logger.info(`new pdf file path  ${newPdfFilePath}`)
      mv(pdfFileName, newPdfFilePath, function (err) {
        logger.error(err);
      });

      pdfFiles.push(newPdfFilePath);
    }
  });
  return { "pdfFiles": pdfFiles, "imgFiles": imgFiles }
}

// @route    PUT api/tickets/:ticket_id
// @desc     update an existing ticket. subject/soruce/state/priority can be updated.
// @access   Private

router.put(
  "/:ticket_id",
  checkObjectId("ticket_id"),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const ticketId = req.params.ticket_id;
    const { subject, source, state, priority } = req.body;
    try {
      let ticket = await Ticket.findById(ticketId);
      // update subject field
      if (ticket) {
        if (subject) ticket.subject = subject;
        // update source field
        if (source) ticket.source = source;
        // update priority
        if (priority) ticket.priority = priority;
        // update state field
        if (state) {
          updateTicketInUser(ticketId, ticket.state, state, ticket.assignedTo);
          ticket.state = state;
        }
        await ticket.save();
        return res.json(ticket);
      } else {
        return res.status(400).json({ msg: "ticket not found" });
      }
    } catch (err) {
      logger.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);
// when ticket state change happens -
// need to remove the ticketId form old state array
// need to add the ticketId to new state array
let updateTicketInUser = (
  ticketId,
  oldTicketState,
  newTicketState,
  assigendToUserId
) => {
  removeFromUser(ticketId, oldTicketState, assigendToUserId);
  addToUser(ticketId, newTicketState, assigendToUserId);
};

// when ticket state change happens -
// need to remove the ticketId form old state array
let removeFromUser = async (ticketId, oldTicketState, userId) => {
  let user;
  if (oldTicketState == constants.ASSIGNED_STATE) {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { assignedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (oldTicketState == constants.IN_PROGRESS_STATE) {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { inprogressTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (oldTicketState == constants.RESOLVED_STATE) {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { resolvedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (oldTicketState == constants.CONCLUDED_STATE) {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { concludedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  //logger.log("updated user ", user);
};

// when ticket state change happens -
//  need to add the ticketId to new state array
let addToUser = async (ticketId, newTicketState, userId) => {
  if (newTicketState == constants.ASSIGNED_STATE) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { assignedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (newTicketState == constants.IN_PROGRESS_STATE) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { inprogressTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (newTicketState == constants.RESOLVED_STATE) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { resolvedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (newTicketState == constants.CONCLUDED_STATE) {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { concludedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
};

// @route    PUT api/tickets/assign/:ticket_id
// @desc     assign a ticket to user and give priority and commennt(passed in body).
//           generally when ticket is assigned. admin post a comment.
// @access   Private
router.put(
  "/assign/:ticket_id",
  checkObjectId("ticket_id"),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const ticketId = req.params.ticket_id;
    try {
      const { assigneeId, priority, commentText } = req.body;
      const commentUser = await User.findById(req.user.id).select(
        "-password  -office -createdTickets -assignedTickets -inprogressTickets -resolvedTickets -concludedTickets"
      );
      // construct the ticket field to be updated.
      const ticketFields = getTicketFields(
        assigneeId,
        priority,
        commentUser,
        commentText
      );
      logger.info(`ticket fields: ${JSON.stringify(ticketFields)}`);
      // udpate the ticket.
      let ticket = await Ticket.findOneAndUpdate(
        { _id: ticketId },
        { $set: ticketFields },
        { new: true, setDefaultsOnInsert: true }
      );

      if (ticket) { 
        // add the ticket
        await User.findOneAndUpdate(
          { _id: assigneeId },
          { $push: { assignedTickets: ticketId } },
          { new: true, setDefaultsOnInsert: true }
        );
        return res.json(ticket);
      } else {
        return res.status(400).json({ msg: "ticket not found" });
      }
    } catch (err) {
      logger.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

let getTicketFields = (
  assigendToUserId,
  priority,
  commentUser,
  commentText
) => {
  // Build ticket object
  const ticketFields = {};
  ticketFields.assignedTo = assigendToUserId;
  ticketFields.priority = priority;
  ticketFields.state = constants.ASSIGNED_STATE
  ticketFields.assignDate = Date.now();
  ticketFields.comments = getNewComment(commentUser, commentText);
  return ticketFields;
};

const getNewComment = (commentUser, commentText) => {
  const newComment = {
    text: commentText,
    postedBy: commentUser._id,
    name: commentUser.name
  };
  return newComment;
};

// @route    GET api/tickets
// @desc     Get all tickets assigned/in-progress/resolved
// @access   Private
router.get("/", auth, async (req, res) => {
  const query = await queryParams(req);
  logger.info(`query  ${JSON.stringify(query)}`);
  const options = getQueryOptions(req);

  await Ticket.paginate(query, options)
    .then((data) => {
      return res.status(200).send({
        total: data.totalDocs,
        tickets: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page,
      });
    })
    .catch((err) => {
      logger.error(`error in fetching data ${err.message}`);
      return res.status(500).send("Server Error");
    });
});

// create query object to get data from data base.
let queryParams = async (req) => {
  const assignedId = req.query.assign;
  const creatorId = req.query.creator;
  const docketId = req.query.docketId;
  const subject = req.query.subject;
  const state = req.query.state;
  const priority = req.query.priority;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

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

  return query;
};
// get office id of user.
let getOfficeId = async (userId) => {
  const user = await User.findById(userId).select(
    "-password  -createdTickets -assignedTickets -inprogressTickets -resolvedTickets -concludedTickets"
  );
  return user.office;
};

const getQueryOptions = (req) => {
  const assignedTo  = { path: "assignedTo", select: "name" };
  const creator = { path: "creator", select: "name" };
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    select:
      "_id docketId subject source createDate assignDate state priority imageFilePath pdfFilePath",
    sort: { priority: 1, assignDate: 1 },
    populate: [creator, assignedTo],
  };
  return options;
};
// @route    GET api/tickets/search
// @desc     Get all tickets
// @access   Private
router.get("/search", auth, async (req, res) => {

  const query = await queryParams(req);
  logger.info(`query  ${JSON.stringify(query)}`);
  const options = getQueryOptions(req);

  await Ticket.paginate(query, options)
    .then((data) => {
      return res.status(200).send({
        total: data.totalDocs,
        tickets: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page,
      });
    })
    .catch((err) => {
      logger.error(`error in fetching data ${err.message}`);
      return res.status(500).send("Server Error");
    });
});

// @route    GET api/tickets/:id
// @desc     Get ticket by ID
// @access   Private
router.get("/ticket_id/:ticket_id", auth, async (req, res) => {
  try {
    const creator = { path: "assignedTo", select: "name" };
   const assignedTo = { path: "creator", select: "name" };
    const ticket = await Ticket.findById(req.params.ticket_id).populate([creator, assignedTo]);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }
    return res.json(ticket);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send("Server Error");
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    const state = req.query.state;
    const userId = ObjectId(req.user.id);
    const userRole = req.user.role;
    logger.info(`userId:  ${userId} userRole: ${userRole}`);

    if (userRole == constants.ADMIN_ROLE) {
      const adminUser = await User.findById(userId).select(
        "-password -createdTickets -assignedTickets -inprogressTickets -resolvedTickets -concludedTickets"
      );
      const officeId = adminUser.office;
      //const count = ticketCountOfAdmin(officeId, state, res);
      //return res.status(200).send(count);
      return ticketCount(null, officeId, state, res)

    } else if (userRole == constants.OPERATOR_ROLE) {
      //const count = ticketCountOfOperator(userId, state);
      //return res.status(200).send(count);
      return ticketCount(userId, null, state, res)

    } else if (userRole == constants.CREATOR_ROLE) {
      //const count = ticketCountOfCreator(userId);
      //return res.status(200).send(count);
      return ticketCountOfCreator(userId, res);
    }
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send("Server Error");
  }
});


const ticketCount = (assigedTo, officeId, state, res) => {
  if (!state) {
    // get count of new/assigned/in-progress/resolved/closed
    //state, priority, assignedTo, createdBy, officeId, countText
    const newTicket = ticketCountQueryString(
      constants.NEW_STATE,
      null,
      assigedTo,
      null,
      officeId,
      "newTicket"
    );
    //logger.log('new ticket count query', newTicket);
    const assignedTicket = ticketCountQueryString(
      constants.ASSIGNED_STATE,
      null,
      assigedTo,
      null,
      officeId,
      "assignedTicket"
    );
    //logger.log('assigned query', assignedTicket);
    const inprogressTicket = ticketCountQueryString(
      constants.IN_PROGRESS_STATE,
      null,
      assigedTo,
      null,
      officeId,
      "inprogressTicket"
    );
    //logger.log("inprogress query ", inprogressTicket)
    const resolvedTicket = ticketCountQueryString(
      constants.RESOLVED_STATE,
      null,
      assigedTo,
      null,
      officeId,
      "resolvedTicket"
    );
    //logger.log("resolved query", resolvedTicket);
    Ticket.aggregate(
      [
        {
          $facet: {
            newTicket: newTicket,
            assignedTicket: assignedTicket,
            inprogressTicket: inprogressTicket,
            resolvedTicket: resolvedTicket,
          },
        },
        {
          $project: {
            newTicket: {
              $arrayElemAt: ["$newTicket.newTicket", 0],
            },
            assignedTicket: {
              $arrayElemAt: ["$assignedTicket.assignedTicket", 0],
            },
            inprogressTicket: {
              $arrayElemAt: ["$inprogressTicket.inprogressTicket", 0],
            },
            resolvedTicket: {
              $arrayElemAt: ["$resolvedTicket.resolvedTicket", 0],
            },
          },
        },
      ],
      function (err, counts) {
        if (err) {
          //logger.error(err.message);
          return res.status(500).send("Server Error");
        }
        //logger.info(`admin  ${counts[0]}`);
        return res.status(200).send(counts[0]);
      }
    );
  } else {
    //state, priority, assignedTo, createdBy, officeId, countText
    const highPriority = ticketCountQueryString(
      state,
      1,
      assigedTo,
      null,
      officeId,
      constants.TICKET_PRIORITY_HIGH
    );
    //logger.log('new ticket count query', newTicket);
    const medPriority = ticketCountQueryString(
      state,
      2,
      assigedTo,
      null,
      officeId,
      constants.TICKET_PRIORITY_MED
    );
    //logger.log('assigned query', assignedTicket);
    const lowPriority = ticketCountQueryString(
      state,
      3,
      assigedTo,
      null,
      officeId,
      constants.TICKET_PRIORITY_LOW
    );
    //logger.log("inprogress query ", inprogressTicket)
    Ticket.aggregate(
      [
        {
          $facet: {
            high: highPriority,
            med: medPriority,
            low: lowPriority,
          },
        },
        {
          $project: {
            high: {
              $arrayElemAt: ["$high.high", 0],
            },
            med: {
              $arrayElemAt: ["$med.med", 0],
            },
            low: {
              $arrayElemAt: ["$low.low", 0],
            },
          },
        },
      ],
      function (err, counts) {
        if (err) {
          logger.error(err.message);
          return res.status(500).send("Server Error");
        }
        //logger.log("admin tickets ", counts[0]);
        return res.status(200).send(counts[0]);
      }
    );
  }
};

const ticketCountOfCreator = (createdBy, res) => {
  const newTicket = ticketCountQueryString(
    "NEW",
    null,
    null,
    createdBy,
    null,
    "newTicket"
  );
  Ticket.aggregate(
    [
      {
        $facet: {
          newTicket: newTicket,
        },
      },
      {
        $project: {
          newTicket: {
            $arrayElemAt: ["$newTicket.newTicket", 0],
          },
        },
      },
    ],
    function (err, counts) {
      if (err) {
        logger.error(err.message);
        return res.status(500).send("Server Error");
      }
      //logger.log(" --> ", counts[0]);
      return res.status(200).send(counts[0]);
      //return counts[0];
    }
  );
};

const ticketCountQueryString = (
  state,
  priority,
  assignedTo,
  createdBy,
  officeId,
  countText
) => {

  const andQueryArray = [];
  const stateQuery = {};
  if (state) {
    stateQuery.state = state;
    andQueryArray.push(stateQuery);
  }

  const priorityQuery = {};
  if (priority) {
    priorityQuery.priority = priority;
    andQueryArray.push(priorityQuery);
  }
  const assignedToQuery = {};
  if (assignedTo) {
    assignedToQuery.assignedTo = assignedTo;
    andQueryArray.push(assignedToQuery);
  }
  const createdByQuery = {};
  if (createdBy) {
    createdByQuery.creator = createdBy;
    andQueryArray.push(createdByQuery);
  }

  const officeQuery = {};

  if (officeId) {
    officeQuery.office = officeId;
    andQueryArray.push(officeQuery);
  }
  const countQuery = { $count: countText };
  //logger.log(`query  ${JSON.stringify(andQueryArray)}`);
  const query = [
    {
      $match: {
        $and: andQueryArray,
      },
    },
    countQuery,
  ];
  return query;
};


// @route    DELETE api/tickets/:id
// @desc     Delete a ticket
// @access   Private
router.delete("/:id", [auth, checkObjectId("id")], async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "ticket not found" });
    }

    // Check user
    if (ticket.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await ticket.remove();

    res.json({ msg: "ticket removed" });
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/tickets/comment/:id
// @desc     Comment on a ticket
// @access   Private
router.post("/comment/:id", auth, checkObjectId("id"), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id).select("-password");
    const ticket = await Ticket.findById(req.params.id);
    const newComment = getNewComment(user,req.body.commentText);
    const state = req.body.state;
    const priority = req.body.priority;
    if (state) ticket.state = state;
    if (priority) ticket.priority = priority;
    ticket.comments.unshift(newComment);
    logger.info(`after update ticket ${JSON.stringify(ticket)}`);
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    logger.error(`${JSON.stringify(err)}`);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    // Pull out comment
    const comment = ticket.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    ticket.comments = ticket.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await ticket.save();

    return res.json(ticket.comments);
  } catch (err) {
    logger.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
