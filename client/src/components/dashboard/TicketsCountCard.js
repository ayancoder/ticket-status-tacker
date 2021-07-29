import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';

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
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h2" component="h2" color={color}>
          32
        </Typography>
      </CardContent>
      <CardActions>
      <Button
        variant="contained"
        color= {color}
        className={classes.button}
       >
        {ticketType}
      </Button>

      </CardActions>
    </Card>
  );
}
