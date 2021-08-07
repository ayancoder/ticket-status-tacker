import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NestedList from "./NestedList";
import { reportsListItems, userListItems } from "./listItems";
import Chart from "./Chart";
import TicketCountCard from "./TicketsCountCard";
import TicketsTable from "../ticket/TicketTable";
import Navbar from "./Navbar";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Tux
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 12px",
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  divider: {
    marginTop: theme.spacing(3),
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [isclose, setIsClose] = React.useState(0);

  React.useEffect(() => {
    const parsedIsClose = true;
    setIsClose(parsedIsClose);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("isclose", isclose);
  }, [isclose]);

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <Navbar />

      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* ticket count card*/}
            <Grid item xs={12} md={6} lg={4}>
              <TicketCountCard ticketType="New Ticket" color="secondary" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TicketCountCard ticketType="Open Ticket" color="primary" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TicketCountCard ticketType="Closed Ticket" color="default" />
            </Grid>
            {/* Chart */}
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Tickets */}
            <Grid item xs={12}>
              <TicketsTable withLink="false" />
            </Grid>
          </Grid>

          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
