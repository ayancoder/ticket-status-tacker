import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Navbar from "../dashboard/Navbar";
import { connect } from "react-redux";
import { Button, TextField } from "@material-ui/core";
import { generate_report } from "../../actions/reportGenerate";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";

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

const drawerWidth = 240;

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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    marginTop: theme.spacing(2),
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    marginLeft: theme.spacing(3),
  },
  container: {
    paddingBottom: theme.spacing(4),
  },
  formcontainer: {
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(3),
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
  heading: {
    marginTop: theme.spacing(2),
    height: theme.spacing(7),
  },
  ticketTypography: {
    color: theme.palette.primary.main,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  formTypo: {
    color: theme.palette.primary.main,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  headingPaper: {
    height: theme.spacing(7),
  },
  formPaper: {
    marginTop: theme.spacing(2),
    height: "relative",
  },
  typography: {
    float: "left",
    paddingLeft: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  field: {
    paddingLeft: theme.spacing(10),
    width: theme.spacing(20),
  },
  descrptioncontainer: {
    marginTop: theme.spacing(3),
    flexDirection: "row",
  },
  formTypoDesc: {
    color: theme.palette.primary.main,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(6),
  },
  form: {
    width: "100%",
    paddingLeft: "1rem",
    paddingRight: "1rem",
  },
  submitcontainer: {
    marginTop: theme.spacing(3),
  },
}));

function ReportGenerate({ report_url, generate_report }) {
  const classes = useStyles();
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [clicked, setClicked] = React.useState(false);
  const history = useHistory();

  const onfromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const onToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(fromDate);
    console.log(toDate);
    generate_report(
      "ASSIGNED",
      fromDate.substring(0, fromDate.indexOf("T")),
      toDate.substring(0, toDate.indexOf("T"))
    );
    setClicked(true);
  };

  if (report_url !== null && report_url.filename != null && clicked === true) {
    var url = report_url.filename.filename;
    url = url.replace("/root/ticket-status-tacker", "");
    window.open("http://143.244.131.27:5000" + url);
    setClicked(false);
  }

  return (
    <div className={classes.root}>
      <Navbar />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.heading}>
              <Paper className={classes.headingPaper}>
                <Typography
                  variant="h4"
                  align="center"
                  className={classes.ticketTypography}
                  gutterBottom
                >
                  <b>Generate Report</b>
                </Typography>
              </Paper>
            </Grid>
            <form className={classes.form}>
              <Grid item xs={12}>
                <Paper className={classes.formPaper}>
                  <Container
                    maxWidth="lg"
                    className={classes.formcontainer}
                    align="center"
                  >
                    <Grid container>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography variant="h6" className={classes.formTypo}>
                          <b>From Date </b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <TextField
                          type="datetime-local"
                          onChange={onfromDateChange}
                          value={fromDate}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={classes.descrptioncontainer}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography
                          variant="h6"
                          className={classes.formTypo}
                          style={{ width: "20rem" }}
                        >
                          <b>To Date </b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <TextField
                          style={{ paddingLeft: "8.8rem" }}
                          type="datetime-local"
                          onChange={onToDateChange}
                          value={toDate}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={classes.submitcontainer}>
                      <Grid item xs={12} md={6} lg={12}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={onSubmit}
                          style={{ marginRight: "4rem" }}
                          disabled={!fromDate || !toDate}
                        >
                          Generate Report
                        </Button>
                      </Grid>
                    </Grid>
                  </Container>
                </Paper>
              </Grid>
            </form>
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
  report_url: state.generate,
});

export default connect(mapStateToProps, { generate_report })(ReportGenerate);
