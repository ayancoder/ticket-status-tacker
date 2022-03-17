import React, { useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Navbar from "../dashboard/Navbar";
import { Button, Divider, TextField } from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { fetchAllDealingOfficer } from "../../actions/auth";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import ImageIcon from "@material-ui/icons/Image";
import {
  editTickets,
  getTicketComments,
  addComments,
  closeSnackBar,
} from "../../actions/ticket";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SendIcon from "@material-ui/icons/Send";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
    marginTop: theme.spacing(1),
  },
  formTypoButton: {
    color: theme.palette.primary.main,
  },
  formTypoComment: {
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(7),
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
  descrptioncontainerComment: {
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
    display: "flex",
  },
}));

function EditTicket({
  user,
  fetchAllDealingOfficer,
  dealingOfficers,
  editTickets,
  alertOpen,
  getTicketComments,
  ticketComments,
  addComments,
  closeSnackBar,
}) {
  console.log(alertOpen);
  const { state } = useLocation();
  const history = useHistory();
  const ticket_details = state.ticket;
  const classes = useStyles();
  const [isclose, setIsClose] = React.useState(0);
  const [selectedFile, setSelectedFile] = React.useState([]);
  const [subject, setSubject] = React.useState(ticket_details?.subject);
  const [source, setSource] = React.useState(ticket_details?.source);
  const [fileName, setFileName] = React.useState(null);
  const [assigned, setAssigned] = React.useState(
    ticket_details?.assignedTo?._id
  );
  const [priority, setPriority] = React.useState(ticket_details?.priority);
  const [editState, seteditState] = React.useState(false);
  const [sendClick, setSendClick] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [states, setState] = React.useState(ticket_details.state);
  const myRef = useRef(null);
  const executeScroll = () => myRef.current.scrollIntoView();
  React.useEffect(() => {
    const parsedIsClose = true;
    setIsClose(parsedIsClose);
    fetchAllDealingOfficer();
  }, []);

  React.useEffect(() => {
    getTicketComments(ticket_details._id);
  }, [sendClick]);

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

  function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children:
        name.indexOf(" ") >= 0
          ? `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`
          : `${name[0][0]}`,
    };
  }

  const onSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const onSourceChange = (e) => {
    setSource(e.target.value);
  };

  const onAssignChange = (e) => {
    setAssigned(e.target.value);
  };
  const onPriorityChange = (e) => {
    setPriority(e.target.value);
  };
  const onStateChange = (e) => {
    setState(e.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // setOpen(false);
    alertOpen = false;
    closeSnackBar();
    switch (ticket_details.state) {
      case "NEW":
        history.push("/new_tickets");
        break;
      case "IN-PROGRESS":
        history.push("/open_tickets");
        break;
      case "RESOLVED":
        history.push("/close_tickets");
        break;
      case "ASSIGNED":
        history.push("/assigned_tickets");
        break;
      default:
        console.log("Option Not Present");
    }
  };

  const onSendClick = (e) => {
    addComments(ticket_details._id, comment);
    setComment("");
    setSendClick(!sendClick);
  };

  const onCommentChange = (e) => {
    setComment(e.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (editState === true) {
      console.log(priority);
      console.log(assigned);
      console.log(ticket_details._id);
      if (user?.role === "BDO" && comment !== "") {
        editTickets(
          ticket_details._id,
          assigned,
          priority,
          comment,
          "BDO",
          null
        );
      } else if (user?.role === "DEALING_OFFICER") {
        editTickets(
          ticket_details._id,
          null,
          null,
          comment,
          "DEALING_OFFICER",
          states
        );
      }
      if (comment !== "") {
        seteditState(false);
        setComment("");
      }
    } else {
      seteditState(true);
      executeScroll();
    }
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
                  ref={myRef}
                >
                  <>
                    <b>{editState === false ? "View" : "Edit"} Ticket ID -</b>
                    <b style={{ marginLeft: "4rem" }}>
                      <u>{"   " + ticket_details.docketId}</u>
                    </b>
                  </>
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
                    {user?.role !== "CC_OFFICER" &&
                      ticket_details.state !== "NEW" && (
                        <Grid container className={classes.descrptioncontainer}>
                          <Grid item xs={12} md={6} lg={4}>
                            <Typography
                              variant="h6"
                              className={classes.formTypo}
                            >
                              <b>State </b>
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6} lg={6}>
                            {ticket_details.state === "ASSIGNED" ? (
                              <Select
                                labelId="simple-select-label-source"
                                id="simple-select-source"
                                value={states}
                                onChange={onStateChange}
                                inputProps={{
                                  readOnly:
                                    !editState && user?.role !== "CC_OFFICER",
                                }}
                                style={{ width: "20rem" }}
                              >
                                {editState === false && (
                                  <MenuItem value={"ASSIGNED"}>
                                    <b>Assigned</b>
                                  </MenuItem>
                                )}
                                <MenuItem value={"IN-PROGRESS"}>
                                  <b>In Progress</b>
                                </MenuItem>
                                <MenuItem value={"RESOLVED"}>
                                  <b>Resolved</b>
                                </MenuItem>
                              </Select>
                            ) : ticket_details.state === "IN-PROGRESS" ? (
                              <Select
                                labelId="simple-select-label-source"
                                id="simple-select-source"
                                value={states}
                                onChange={onStateChange}
                                inputProps={{
                                  readOnly:
                                    !editState && user?.role !== "CC_OFFICER",
                                }}
                                style={{ width: "20rem" }}
                              >
                                {editState === false && (
                                  <MenuItem value={"IN-PROGRESS"}>
                                    <b>In Progress</b>
                                  </MenuItem>
                                )}
                                <MenuItem value={"RESOLVED"}>
                                  <b>Resolved</b>
                                </MenuItem>
                              </Select>
                            ) : ticket_details.state === "RESOLVED" &&
                              user?.role === "BDO" ? (
                              <Select
                                labelId="simple-select-label-source"
                                id="simple-select-source"
                                value={states}
                                onChange={onStateChange}
                                inputProps={{
                                  readOnly:
                                    !editState && user?.role !== "CC_OFFICER",
                                }}
                                style={{ width: "20rem" }}
                              >
                                <MenuItem value={"ASSIGNED"}>
                                  <b>Assigned</b>
                                </MenuItem>
                                <MenuItem value={"IN-PROGRESS"}>
                                  <b>In Progress</b>
                                </MenuItem>
                                <MenuItem value={"RESOLVED"}>
                                  <b>Resolved</b>
                                </MenuItem>
                              </Select>
                            ) : (
                              <Select
                                labelId="simple-select-label-source"
                                id="simple-select-source"
                                value={states}
                                onChange={onStateChange}
                                inputProps={{
                                  readOnly: true,
                                }}
                                style={{ width: "20rem" }}
                              >
                                <MenuItem value={"RESOLVED"}>
                                  <b>Resolved</b>
                                </MenuItem>
                              </Select>
                            )}
                          </Grid>
                        </Grid>
                      )}
                    {user?.role !== "CC_OFFICER" && (
                      <Grid container className={classes.descrptioncontainer}>
                        <Grid item xs={12} md={6} lg={4}>
                          <Typography variant="h6" className={classes.formTypo}>
                            <b>Proirity </b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <Select
                            labelId="simple-select-label-source"
                            id="simple-select-source"
                            value={priority}
                            onChange={onPriorityChange}
                            inputProps={{
                              readOnly:
                                (!editState && user?.role === "BDO") ||
                                user?.role === "DEALING_OFFICER",
                            }}
                            style={{ width: "20rem" }}
                          >
                            <MenuItem value={"1"}>
                              <b>High</b>
                            </MenuItem>
                            <MenuItem value={"2"}>
                              <b>Medium</b>
                            </MenuItem>
                            <MenuItem value={"3"}>
                              <b>Low</b>
                            </MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                    )}
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
                          InputProps={{
                            readOnly: true,
                          }}
                          style={{ textAlign: "left", width: "20rem" }}
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
                          inputProps={{
                            readOnly: true,
                          }}
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
                    {user?.role === "BDO" && (
                      <Grid container className={classes.descrptioncontainer}>
                        <Grid item xs={12} md={6} lg={4}>
                          <Typography variant="h6" className={classes.formTypo}>
                            <b>Assigned To </b>
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                          <Select
                            labelId="simple-select-label-source"
                            id="simple-select-source"
                            value={assigned}
                            onChange={onAssignChange}
                            inputProps={{
                              readOnly:
                                (!editState && user?.role === "BDO") ||
                                user?.role === "DEALING_OFFICER",
                            }}
                            style={{ width: "20rem" }}
                          >
                            {dealingOfficers.map((x) => {
                              return (
                                <MenuItem value={x._id}>{x.name}</MenuItem>
                              );
                            })}
                          </Select>
                        </Grid>
                      </Grid>
                    )}
                    {/* Removed Upload On Edit Ticket */}
                    {false ? (
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
                    ) : (
                      <>
                        <>
                          {user?.role !== "CC_OFFICER" && (
                            <>
                              <Divider style={{ marginTop: "2rem" }} />
                              <Typography
                                variant="h4"
                                className={classes.formTypo}
                              >
                                <b>
                                  <u>Comments </u>{" "}
                                </b>
                              </Typography>
                              <Grid
                                container
                                className={classes.descrptioncontainer}
                              >
                                <Grid
                                  item
                                  xs={6}
                                  md={6}
                                  lg={1}
                                  style={{ margin: "1rem" }}
                                >
                                  <TextareaAutosize
                                    aria-label="empty textarea"
                                    onChange={onCommentChange}
                                    value={comment}
                                    placeholder="Enter you Comment Here"
                                    style={{
                                      fontSize: 19,
                                      width: "31rem",
                                      height: "3rem",
                                      marginTop: "1rem",
                                    }}
                                  />
                                </Grid>
                                {!(
                                  ticket_details.state === "NEW" &&
                                  user?.role === "BDO"
                                ) &&
                                  editState !== true && (
                                    <Grid item xs={6} md={6} lg={6}>
                                      <Button
                                        disabled={!comment}
                                        style={{
                                          marginLeft: "27rem",
                                          marginTop: "2.2rem",
                                          backgroundColor: "#42a5f5",
                                          color: "#e3f2fd",
                                        }}
                                        variant="contained"
                                        onClick={onSendClick}
                                        endIcon={<SendIcon />}
                                      >
                                        Send
                                      </Button>
                                    </Grid>
                                  )}
                              </Grid>
                            </>
                          )}
                          {ticketComments !== null && (
                            <Grid
                              container
                              className={classes.descrptioncontainerComment}
                            >
                              {ticketComments.map((x) => (
                                <Paper
                                  style={{
                                    marginLeft: "1rem",
                                    marginBottom: "1.5rem",
                                    width: "38rem",
                                    paddingBottom: "0.5rem",
                                    paddingTop: "0.5rem",
                                  }}
                                  elevation={10}
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    lg={6}
                                    style={{
                                      display: "flex",
                                      marginRight: "18rem",
                                    }}
                                  >
                                    <Avatar
                                      {...stringAvatar(x.name)}
                                      style={{
                                        height: "3rem",
                                        width: "3rem",
                                      }}
                                    />
                                    <Typography
                                      variant="h5"
                                      style={{ marginLeft: "1rem" }}
                                    >
                                      <b>{x.name}</b>
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    md={6}
                                    lg={6}
                                    style={{
                                      marginRight: "12rem",
                                    }}
                                  >
                                    <Typography
                                      align="left"
                                      style={{
                                        marginLeft: "1rem",
                                        marginTop: "-1.1rem",
                                      }}
                                    >
                                      {x.text}
                                    </Typography>
                                  </Grid>
                                </Paper>
                              ))}
                            </Grid>
                          )}
                          {(ticket_details?.imageFilePath.length !== 0 ||
                            ticket_details?.pdfFilePath !== 0) && (
                            <>
                              <Divider style={{ marginTop: "2rem" }} />
                              <Typography
                                variant="h4"
                                className={classes.formTypo}
                              >
                                <b>
                                  <u>Attachments</u>{" "}
                                </b>
                              </Typography>
                            </>
                          )}
                          <Grid
                            container
                            className={classes.descrptioncontainer}
                          >
                            {ticket_details.imageFilePath.map((path) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={4}
                                style={{ margin: "1rem" }}
                              >
                                <Button
                                  variant="contained"
                                  className={classes.formTypoButton}
                                  onClick={() =>
                                    window.open(
                                       `http://${process.env.REACT_APP_SERVER}:5000/` + path
                                    )
                                  }
                                >
                                  <ImageIcon
                                    fontSize="large"
                                    color="inherit"
                                    style={{ fontSize: "7rem" }}
                                  />
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                        <>
                          <Grid
                            container
                            className={classes.descrptioncontainer}
                          >
                            {ticket_details.pdfFilePath.map((path, i) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={4}
                                style={{ margin: "1rem" }}
                              >
                                <Button
                                  variant="contained"
                                  className={classes.formTypoButton}
                                  onClick={() =>
                                    window.open(
                                      `http://${process.env.REACT_APP_SERVER}:5000/` + path
                                    )
                                  }
                                >
                                  <PictureAsPdfIcon
                                    fontSize="large"
                                    color="inherit"
                                    style={{ fontSize: "7rem" }}
                                  />
                                </Button>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      </>
                    )}
                    {editState === true ? (
                      <Grid container className={classes.submitcontainer}>
                        <Grid item xs={12} md={6} lg={4}>
                          <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: "14rem" }}
                            disabled={!states || !comment}
                          >
                            Submit
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                          <Button
                            type="submit"
                            variant="outlined"
                            style={{ marginLeft: "6rem" }}
                            color="primary"
                            onClick={() => seteditState(false)}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid container className={classes.submitcontainer}>
                        <Grid item xs={12} md={6} lg={4}>
                          <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: "16rem" }}
                          >
                            Edit
                          </Button>
                        </Grid>
                      </Grid>
                    )}
                  </Container>
                </Paper>
              </Grid>
            </form>
          </Grid>
          <Snackbar
            open={alertOpen}
            autoHideDuration={2500}
            onClose={handleClose}
            style={{ width: "20rem" }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Alert onClose={handleClose} severity="success">
              Ticket Edit Successfully!
            </Alert>
          </Snackbar>
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
  dealingOfficers: state?.auth?.dealingOfficers,
  ticketComments: state?.ticket?.comments,
  alertOpen: state?.ticket?.alertOpen,
});

export default connect(mapStateToProps, {
  fetchAllDealingOfficer,
  editTickets,
  getTicketComments,
  addComments,
  closeSnackBar,
})(EditTicket);
