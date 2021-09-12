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
      console.log("req.user", req.user);
      const user = await User.findById(req.user.id).populate('office');

      const newTicket = new Ticket({
        subject: req.body.subject,
        source: req.body.source,
        creator: req.user.id,
        creatorName: user.name,
        office: user.office._id,
        avatar: user.avatar,
        filePath: req.body.filePath,
      });
      const ticket = await newTicket.save();
      // update user with ticket id
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $push: {createdTickets: ticket._id} },
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
      // Build ticket object
      const ticketFields = {};
      if (subject) ticketFields.subject = subject;
      if (source) ticketFields.source = source;
      if (state) ticketFields.state = state;
      if (priority) ticketFields.priority = priority;

      console.log("ticket field", ticketFields);
      //new option to true to return the document after update was applied.
      let ticket = await Ticket.findOneAndUpdate(
        { _id: ticketId },
        { $set: ticketFields },
        { new: true, setDefaultsOnInsert: true }
      );
      if (ticket) {
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

// @route    PUT api/tickets/assign/:ticket_id/:user_id
// @desc     assign a ticket to user and give priority(passed in body).
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
      const assignedUser = await User.findById(assigneeId).select(
        "-password -tickets -office"
      );
      
      const commentUser = await User.findById(req.user.id).select(
        "-password -tickets -office"
      );

      // Build ticket object
      const ticketFields = {};
      ticketFields._id = ticketId;
      ticketFields.assignedTo = assignedUser._id;
      ticketFields.assignedToName = assignedUser.name;
      ticketFields.priority = priority;
      ticketFields.state = "ASSIGNED";
      ticketFields.assignDate = Date.now();
  
      const newComment = {
        text: commentText,
        name: commentUser.name,
        avatar: commentUser.avatar,
        user: commentUser.id,
      };

      ticketFields.comments = newComment
      console.log("ticket field", ticketFields);
      //new option to true to return the document after update was applied.
      let ticket = await Ticket.findOneAndUpdate(
        { _id: ticketId },
        { $set: ticketFields },
        { new: true, setDefaultsOnInsert: true }
      );
      if (ticket) {
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

// @route    GET api/tickets
// @desc     Get all tickets assigned/in-progress/resolved
// @access   Private
router.get("/", auth, async (req, res) => {
  const assignedId = req.query.assign;
  const state = req.query.state;
  const priority = req.query.priority;
  // Build query object
  const query = {};
  if (assignedId) {
    // query for specific user
    query.assignedTo = assignedId;
  }else { 
    // query for admin
    const adminUserId = req.user.id;
    const adminUser = await User.findById(adminUserId).select(
      "-password -tickets -office"
    );
    query.officeId = adminUser.officeId;
  }
  if (state) query.state = state;
  if (priority) query.priority = priority;

  console.log("query-->", query);

  const options = {
    page: req.query.page,
    limit: req.query.limit,
    select:
      "_id subject source creatorName createDate assignedToName assignDate state priority filePath",
    sort: { priority: 1, assignDate: 1 },
  };

  //const tickets = await Ticket.find(query).sort({ date: -1 });
  //res.send(tickets);
  //console.log('tickets', tickets);
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

// @route    GET api/tickets/search
// @desc     Get all tickets
// @access   Private
router.get("/search", auth, async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const userId = req.user.id;
  const user = await User.findById(userId).select("-password -tickets");
  const officeId = user.officeId;

  const subject = req.query.subject;
  const assignedToName = req.query.assignedToName;
  const state = req.query.state;
  const priority = req.query.priority;

  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  let query = {};
  if (assignedToName) {
    query.assignedToName = {
      $regex: new RegExp(assignedToName),
      $options: "i",
    };
  }
  query.officeId = ObjectId(officeId);
  if (subject) {
    query.subject = { $regex: new RegExp(subject), $options: "i" };
  }
  if (state) query.state = state;
  if (priority) query.priority = priority;
  if (startDate) query.createDate = { $gte: startDate, $lte: endDate };
  console.log("search query-->", query);

  try {
    const options = {
      page: page,
      limit: limit,
      collation: {
        locale: "en",
      },
    };

    await Ticket.paginate(query, options)
      .then((data) => {
        return res.status(200).send({
          totalItems: data.totalDocs,
          tickets: data.docs,
          totalPages: data.totalPages,
          currentPage: data.page,
        });
      })
      .catch((err) => {
        console.log("error in fetching data");
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
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
    const userId = req.user.id;
    const userRole = req.user.role;
    console.log("userId: ", userId, "userRole :", userRole);

    if (userRole == "ADMIN") {
      const adminUserId = req.user.id;
      const adminUser = await User.findById(adminUserId).select(
        "-password -tickets"
      );
      const officeId = adminUser.officeId;
      if (!state) {
        // get count of new/assigned/in-progress/resolved/closed
        Ticket.aggregate(
          [
            {
              $facet: {
                newTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "NEW",
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "newTicket",
                  },
                ],
                assignedTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "ASSIGNED",
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "assignedTicket",
                  },
                ],
                inprogressTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "IN-PROGRESS",
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "inprogressTicket",
                  },
                ],
                resolvedTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "RESOLVED",
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "resolvedTicket",
                  },
                ],
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
              console.error(err.message);
              return res.status(500).send("Server Error");
            }
            console.log(" --> ", counts[0]);
            return res.status(200).send(counts[0]);
          }
        );
      } else {
        const state = req.query.state;
        console.log("state is ", state);
        Ticket.aggregate(
          [
            {
              $facet: {
                high: [
                  {
                    $match: {
                      $and: [
                        {
                          state: state,
                        },
                        {
                          priority: 1,
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "high",
                  },
                ],
                med: [
                  {
                    $match: {
                      $and: [
                        {
                          state: state,
                        },
                        {
                          priority: 2,
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "med",
                  },
                ],
                low: [
                  {
                    $match: {
                      $and: [
                        {
                          state: state,
                        },
                        {
                          priority: 3,
                        },
                        {
                          officeId: ObjectId(officeId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "low",
                  },
                ],
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
            console.log(" --> ", counts[0]);
            return res.status(200).send(counts[0]);
          }
        );
      }
    } else if (userRole == "TICKET_OPERATOR") {
      if (!state) {
        // get count of new/assigned/in-progress/resolved/closed
        Ticket.aggregate(
          [
            {
              $facet: {
                newTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "NEW",
                        },
                        {
                          assignedTo: ObjectId(userId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "newTicket",
                  },
                ],
                assignedTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "ASSIGNED",
                        },
                        {
                          assignedTo: ObjectId(userId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "assignedTicket",
                  },
                ],
                inprogressTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "IN-PROGRESS",
                        },
                        {
                          assignedTo: ObjectId(userId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "inprogressTicket",
                  },
                ],
                resolvedTicket: [
                  {
                    $match: {
                      $and: [
                        {
                          state: "RESOLVED",
                        },
                        {
                          assignedTo: ObjectId(userId),
                        },
                      ],
                    },
                  },
                  {
                    $count: "resolvedTicket",
                  },
                ],
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
              console.error(err.message);
              return res.status(500).send("Server Error");
            }
            console.log(" --> ", counts[0]);
            return res.status(200).send(counts[0]);
          }
        );
      } else {
        const state = req.query.state;
        console.log("state is ", state);
        Ticket.aggregate(
          [
            {
              $facet: {
                high: [
                  {
                    $match: {
                      $and: [
                        {
                          assignedTo: ObjectId(userId),
                        },
                        {
                          state: state,
                        },
                        {
                          priority: 1,
                        },
                      ],
                    },
                  },
                  {
                    $count: "high",
                  },
                ],
                med: [
                  {
                    $match: {
                      $and: [
                        {
                          assignedTo: ObjectId(userId),
                        },
                        {
                          state: state,
                        },
                        {
                          priority: 2,
                        },
                      ],
                    },
                  },
                  {
                    $count: "med",
                  },
                ],
                low: [
                  {
                    $match: {
                      $and: [
                        {
                          assignedTo: ObjectId(userId),
                        },
                        {
                          state: state,
                        },
                        {
                          priority: 3,
                        },
                      ],
                    },
                  },
                  {
                    $count: "low",
                  },
                ],
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
            console.log(" --> ", counts[0]);
            return res.status(200).send(counts[0]);
          }
        );
      }
    } else if (userRole == "TICKET_CREATOR") {
      Ticket.aggregate(
        [
          {
            $facet: {
              newTicket: [
                {
                  $match: {
                    $and: [
                      {
                        state: "NEW",
                      },
                      {
                        creator: ObjectId(userId),
                      },
                    ],
                  },
                },
                {
                  $count: "newTicket",
                },
              ],
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
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});
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
router.post(
  "/comment/:id",
  auth,
  checkObjectId("id"),
  async (req, res) => {
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
      const state =req.body.state;
      const priority = req.body.priority
      if(state) ticket.state = state;
      if(priority) ticket.priority = priority;

      ticket.comments.unshift(newComment);
      console.log("after update ticket", ticket);
      await ticket.save();

      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

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
