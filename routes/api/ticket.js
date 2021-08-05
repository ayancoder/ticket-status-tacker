const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const checkObjectId = require("../../middleware/checkObjectId");
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
      const user = await User.findById(req.user.id).select("-password");
      console.log('user -->', user);
      const newTicket = new Ticket({
        subject: req.body.subject,
        source: req.body.source,
        creator: req.user.id,
        creatorName: user.name,
        avatar: user.avatar,
      });

      const ticket = await newTicket.save();

      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    POST api/tickets/assign/:ticket_id
// @desc     update an existing ticket. subject/soruce/state/severity can be updated.
// @access   Private

router.put("/assign/:ticket_id",
  checkObjectId("ticket_id"),
  auth,
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const ticketId = req.params.ticket_id;
    const {subject, source, state, severity} = req.body;
    try {
      // Build ticket object
      const ticketFields = {};
      if (subject) ticketFields.subject = subject;
      if (source) ticketFields.source = source;
      if (state) ticketFields.state = state;
      if (severity) ticketFields.severity = severity;

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

// @route    POST api/tickets/assign/:ticket_id/:user_id
// @desc     assign a ticket to user and give severity.
// @access   Private

router.put(
  "/assign/:ticket_id/:assignee_id",
  checkObjectId("ticket_id"),
  checkObjectId("assignee_id"),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const ticketId = req.params.ticket_id;
    const assigneeId = req.params.assignee_id;
    try {
      const user = await User.findById(assigneeId).select("-password");
      console.log("user -->", user);
      const { severity } = req.body.severity;
      // Build ticket object
      const ticketFields = {};
      ticketFields._id = ticketId;
      ticketFields.assignedTo = user._id;
      ticketFields.assignedToName = user.name;
      ticketFields.severity = severity;

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
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  
  try {
    if(req.user.role === 'ADMIN'){
    const tickets = await Ticket.find().sort({ date: -1 });
    res.json(tickets);

    }else {
      return res.status(400).json({ msg: "only admin can view all users." })
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    GET api/tickets/:id
// @desc     Get ticket by ID
// @access   Private
router.get("/:id", auth, checkObjectId("id"), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
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
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const ticket = await Ticket.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      ticket.comments.unshift(newComment);
      console.log("after update ticket", ticket);
      await ticket.save();

      res.json(ticket.comments);
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
