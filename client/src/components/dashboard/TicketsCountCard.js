import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";

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
    margin: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

export default function TicketCountCard({ ticketType, color }) {
  const classes = useStyles();
  const history = useHistory();
  const newButtonHandler = (e) => {
    switch (ticketType) {
      case "New Ticket":
        history.push("/tickets");
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
            32
          </Typography>
        </CardContent>
      </div>

      <div style={{ display: "flex" }}>
        <CardActions>
          <Button
            variant="contained"
            color={color}
            className={classes.button}
            onClick={newButtonHandler}
          >
            {ticketType}
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}
