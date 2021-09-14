const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const checkObjectId = require("../../middleware/checkObjectId");
const User = require("../../models/User");
const Ticket = require("../../models/Ticket");

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
      console.log("user creating tickets:", req.user);
      const user = await User.findById(req.user.id).populate("office");

      const newTicket = new Ticket({
        subject: req.body.subject,
        source: req.body.source,
        creator: req.user.id,
        office: user.office._id,
        avatar: user.avatar,
        filePath: req.body.filePath,
      });
      const ticket = await newTicket.save();
      // update user with ticket id
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { createdTickets: ticket._id } },
        { new: true, setDefaultsOnInsert: true }
      );
      return res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

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
      console.error(err.message);
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
  if (oldTicketState == "ASSIGNED") {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { assignedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (oldTicketState == "IN-PROGRESS") {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { inprogressTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (oldTicketState == "RESOLVED") {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { resolvedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (oldTicketState == "CONCLUDED") {
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { concludedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  //console.log("updated user ", user);
};

// when ticket state change happens -
//  need to add the ticketId to new state array
let addToUser = async (ticketId, newTicketState, userId) => {
  if (newTicketState == "ASSIGNED") {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { assignedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (newTicketState == "IN-PROGRESS") {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { inprogressTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (newTicketState == "RESOLVED") {
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { resolvedTickets: ticketId } },
      { new: true, setDefaultsOnInsert: true }
    );
  }
  if (newTicketState == "CONCLUDED") {
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
      console.log("ticket fields:", ticketFields);
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
      console.error(err.message);
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
  ticketFields.state = "ASSIGNED";
  ticketFields.assignDate = Date.now();
  ticketFields.comments = getNewComment(commentUser, commentText);
  return ticketFields;
};

let getNewComment = (commentUser, commentText) => {
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
  console.log("query-->", query);
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
      console.log("error in fetching data", err);
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

let getQueryOptions = (req) => {
  const creator = { path: "assignedTo", select: "name" };
  const assignedTo = { path: "creator", select: "name" };
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    select:
      "_id docketId subject source createDate assignDate state priority filePath",
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
  console.log("query-->", query);
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
      console.log("error in fetching data", err);
      return res.status(500).send("Server Error");
    });
});

// @route    GET api/tickets/:id
// @desc     Get ticket by ID
// @access   Private
router.get("/ticket_id/:ticket_id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticket_id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }
    return res.json(ticket);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

router.get("/count", auth, async (req, res) => {
  try {
    const state = req.query.state;
    const userId = ObjectId(req.user.id);
    const userRole = req.user.role;
    console.log("userId: ", userId, ":userRole :", userRole);

    if (userRole == "ADMIN") {
      const adminUser = await User.findById(userId).select(
        "-password -createdTickets -assignedTickets -inprogressTickets -resolvedTickets -concludedTickets"
      );
      const officeId = adminUser.office;
      //const count = ticketCountOfAdmin(officeId, state, res);
      //return res.status(200).send(count);
      return ticketCount(null, officeId, state, res)

    } else if (userRole == "TICKET_OPERATOR") {
      //const count = ticketCountOfOperator(userId, state);
      //return res.status(200).send(count);
      return ticketCount(userId, null, state, res)

    } else if (userRole == "TICKET_CREATOR") {
      //const count = ticketCountOfCreator(userId);
      //return res.status(200).send(count);
      return ticketCountOfCreator(userId, res);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});


const ticketCount = (assigedTo, officeId, state, res) => {
  if (!state) {
    // get count of new/assigned/in-progress/resolved/closed
    //state, priority, assignedTo, createdBy, officeId, countText
    const newTicket = ticketCountQueryString(
      "NEW",
      null,
      assigedTo,
      null,
      officeId,
      "newTicket"
    );
    //console.log('new ticket count query', newTicket);
    const assignedTicket = ticketCountQueryString(
      "ASSIGNED",
      null,
      assigedTo,
      null,
      officeId,
      "assignedTicket"
    );
    //console.log('assigned query', assignedTicket);
    const inprogressTicket = ticketCountQueryString(
      "IN-PROGRESS",
      null,
      assigedTo,
      null,
      officeId,
      "inprogressTicket"
    );
    //console.log("inprogress query ", inprogressTicket)
    const resolvedTicket = ticketCountQueryString(
      "RESOLVED",
      null,
      assigedTo,
      null,
      officeId,
      "resolvedTicket"
    );
    //console.log("resolved query", resolvedTicket);
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
          //console.error(err.message);
          return res.status(500).send("Server Error");
        }
        console.log("admin -->", counts[0]);
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
      "high"
    );
    //console.log('new ticket count query', newTicket);
    const medPriority = ticketCountQueryString(
      state,
      2,
      assigedTo,
      null,
      officeId,
      "med"
    );
    //console.log('assigned query', assignedTicket);
    const lowPriority = ticketCountQueryString(
      state,
      3,
      assigedTo,
      null,
      officeId,
      "low"
    );
    //console.log("inprogress query ", inprogressTicket)
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
          console.error(err.message);
          return res.status(500).send("Server Error");
        }
        console.log("admin tickets ", counts[0]);
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
        console.error(err.message);
        return res.status(500).send("Server Error");
      }
      console.log(" --> ", counts[0]);
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
  console.log("query ->", JSON.stringify(andQueryArray));
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
    console.error(err.message);

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

    const newComment = {
      text: req.body.commentText,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };
    const state = req.body.state;
    const priority = req.body.priority;
    if (state) ticket.state = state;
    if (priority) ticket.priority = priority;

    ticket.comments.unshift(newComment);
    console.log("after update ticket", ticket);
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
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
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
