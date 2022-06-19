import React from "react";
import clsx from "clsx";
import { useDispatch } from "react-redux";
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
import { connect } from "react-redux";
import Chart from "./Chart";
import { login } from "../../actions/auth";
import TicketCountCard from "./TicketsCountCard";
import TicketsTable from "../ticket/TicketTable";
import Navbar from "./Navbar";
import {
  getcountticketstypes,
  getDelingOfficerTickets,
} from "../../actions/ticket";

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

function Dashboard({ auth }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getcountticketstypes());
  }, []);

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <Navbar />

      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* ticket count card*/}
            {auth.user != null && auth.user.role !== "DEALING_OFFICER" && (
              <Grid item xs={12} md={6} lg={3}>
                <TicketCountCard ticketType="New Ticket" color="secondary" />
              </Grid>
            )}
            {auth.user != null && auth.user.role !== "CC_OFFICER" && (
              <Grid item xs={12} md={6} lg={3}>
                <TicketCountCard
                  ticketType="Assigned Ticket"
                  color="secondary"
                />
              </Grid>
            )}
            {auth.user != null && auth.user.role !== "CC_OFFICER" && (
              <Grid item xs={12} md={6} lg={3}>
                <TicketCountCard ticketType="Open Ticket" color="primary" />
              </Grid>
            )}
            {auth.user != null && auth.user.role !== "CC_OFFICER" && (
              <Grid item xs={12} md={6} lg={3}>
                <TicketCountCard ticketType="Closed Ticket" color="primary" />
              </Grid>
            )}
            {/* Chart */}
            <Grid item xs={12}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Tickets */}
            <Grid item xs={12}>
              {auth?.user?.role !== "DEALING_OFFICER" ? (
                <TicketsTable ticketType="NEW" />
              ) : (
                <TicketsTable ticketType="ASSIGNED" />
              )}
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

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
