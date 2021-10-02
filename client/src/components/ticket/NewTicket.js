import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import TicketsTable from "./TicketTable";
import Navbar from "../dashboard/Navbar";
import { Button, TextField } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { tickets, addtickets } from "../../actions/ticket";
import { connect } from "react-redux";

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
    // marginLeft:theme.spacing(13)
  },
}));

function NewTicket({ tickets,addtickets }) {
  const classes = useStyles();
  const [isclose, setIsClose] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState([]);
  const [subject, setSubject] = React.useState(null);
  const [source, setSource] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);

  React.useEffect(() => {
    const parsedIsClose = true;
    setIsClose(parsedIsClose);
  }, []);

  React.useEffect(() => {
    localStorage.setItem("isclose", isclose);
  }, [isclose]);

  const onFileChange = (e) => {
    let str = "";
    var selected = [];
    for (let i = 0; i <= selectedFile.length; i++) {
      selectedFile.pop();
    }
    for (let i = 0; i < e.target.files.length; i++) {
      str += e.target.files[i].name + ",";
      console.log(selectedFile);
      selected = selectedFile;
      selected.push(e.target.files[i]);
      setSelectedFile(selected);
    }
    setFileName(str);
    console.log(selectedFile);
    console.log(e.target.files.length);
  };

  const onSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const onSourceChange = (e) => {
    setSource(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(selectedFile);
    addtickets(subject, source, selectedFile);
    setSubject("");
    setSource("");
    setFileName("");
  };

  return (
    <div className={classes.root}>
      <Navbar />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.heading}>
              <Paper className={classes.headingPaper}>
                <Typography
                  variant="h5"
                  className={classes.ticketTypography}
                  gutterBottom
                >
                  <b>New Ticket</b>
                </Typography>
              </Paper>
            </Grid>
            <form
              className={classes.form}
              onSubmit={onSubmit}
              enctype="multipart/form-data"
            >
              <Grid item xs={12}>
                <Paper className={classes.formPaper}>
                  <Container
                    maxWidth="lg"
                    className={classes.formcontainer}
                    align="center"
                  >
                    <Grid container>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h6" className={classes.formTypo}>
                          <b>Subject </b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <TextField
                          id="standard-textarea"
                          multiline
                          value={subject}
                          style={{ textAlign: "left", width: "20rem" }}
                          // variant="outlined"
                          onChange={onSubjectChange}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={classes.descrptioncontainer}>
                      <Grid item xs={12} md={6} lg={4}>
                        <Typography variant="h6" className={classes.formTypo}>
                          <b>Source </b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <Select
                          labelId="simple-select-label-source"
                          id="simple-select-source"
                          value={source}
                          onChange={onSourceChange}
                          style={{ width: "20rem" }}
                        >
                          <MenuItem value={"State"}>State</MenuItem>
                          <MenuItem value={"District"}>District</MenuItem>
                          <MenuItem value={"Sub-Division"}>
                            Sub-Division
                          </MenuItem>
                          <MenuItem value={"Gram Panchayat"}>
                            Gram Panchayat
                          </MenuItem>
                          <MenuItem value={"Other Block Offices"}>
                            Other Block Offices
                          </MenuItem>
                          <MenuItem value={"Others"}>Others</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid container className={classes.descrptioncontainer}>
                      <Grid item xs={12} md={6} lg={12}>
                        <Button
                          variant="outlined"
                          color="primary"
                          component="label"
                        >
                          To Upload
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={onFileChange}
                            multiple
                          />
                        </Button>
                        &nbsp;&nbsp;
                        {fileName === null ? "Select File" : fileName}
                      </Grid>
                    </Grid>
                    <Grid container className={classes.submitcontainer}>
                      <Grid item xs={12} md={6} lg={12}>
                        <Button
                          type="submit"
                          variant="outlined"
                          color="primary"
                          style={{ marginRight: "4rem" }}
                          disabled={!source || !subject}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Container>
                </Paper>
              </Grid>
            </form>
            {/* Recent Tickets */}
            <Grid item xs={12}>
              <TicketsTable withLink="newticket" />
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
  user: state.auth.user,
});

export default connect(mapStateToProps, { addtickets })(NewTicket);
