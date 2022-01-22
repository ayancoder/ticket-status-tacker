import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  card: {
    marginTop: 14,
    width: 180,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

function TicketCountCard({ ticketType, color, ticketCount }) {
  const classes = useStyles();
  const history = useHistory();
  const newButtonHandler = (e) => {
    switch (ticketType) {
      case "New Ticket":
        history.push("/new_tickets");
        break;
      case "Open Ticket":
        history.push("/open_tickets");
        break;
      case "Closed Ticket":
        history.push("/close_tickets");
        break;
      case "Assigned Ticket":
        history.push("/assigned_tickets");
        break;
      default:
        console.log("Option Not Present");
    }
  };

  return (
    <Card className={classes.card}>
      <div style={{ display: "flex" }}>
        <CardContent>
          <Typography variant="h2" component="h2" color={color}>
            {ticketType === "New Ticket"
              ? ticketCount?.ticket?.stateTickets?.newTickets
              : ticketType === "Open Ticket"
              ? ticketCount?.ticket?.stateTickets?.openTickets
              : ticketType === "Closed Ticket"
              ? ticketCount?.ticket?.stateTickets?.resolvedTickets
              : ticketType === "Assigned Ticket"
              ? ticketCount?.ticket?.stateTickets?.assignedTickets
              : {}}
          </Typography>
        </CardContent>
      </div>

      <div style={{ display: "flex", textAlign: "center" }}>
        <CardActions>
          <Button variant="contained" color={color} onClick={newButtonHandler}>
            {ticketType}
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  ticketCount: state,
});

export default connect(mapStateToProps)(TicketCountCard);
