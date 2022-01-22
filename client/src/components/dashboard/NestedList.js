import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AssessmentRoundedIcon from "@material-ui/icons/AssessmentRounded";
import StarBorder from "@material-ui/icons/StarBorder";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SendIcon from "@material-ui/icons/Send";
import { useHistory } from "react-router-dom";
import EmailIcon from "@material-ui/icons/Email";
import { connect } from "react-redux";
import { login } from "../../actions/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function NestedList({ auth }) {
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const newTicketButtonHandler = (e) => {
    history.push("/newTicket");
    e.stopPropagation();
  };

  const assignedButtonHandler = (e) => {
    history.push("/assigned_tickets");
    e.stopPropagation();
  };

  const dashboardButtonHandler = (e) => {
    history.push("/dashboard");
    e.stopPropagation();
  };

  const reportGenerateButtonHandler = (e) => {
    history.push("/report");
    e.stopPropagation();
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem button onClick={dashboardButtonHandler}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <EmailIcon />
        </ListItemIcon>
        <ListItemText primary="Tickets" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      {auth.user != null && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {auth.user.role !== "DEALING_OFFICER" && (
              <ListItem
                button
                className={classes.nested}
                onClick={newTicketButtonHandler}
              >
                <ListItemIcon>
                  <CreateOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Create New " />
              </ListItem>
            )}
            {auth.user.role === "DEALING_OFFICER" && (
              <ListItem
                button
                className={classes.nested}
                onClick={assignedButtonHandler}
              >
                <ListItemIcon>
                  <PersonAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Assignned To Me " />
              </ListItem>
            )}
            {/* <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="My Tickets " />
            </ListItem> */}
          </List>
        </Collapse>
      )}

      {auth.user != null && auth.user.role === "CC_OFFICER" && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              onClick={newTicketButtonHandler}
            >
              <ListItemIcon>
                <CreateOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Create New " />
            </ListItem>
          </List>
        </Collapse>
      )}
      {auth.user != null && auth.user.role !== "DEALING_OFFICER" && (
        <ListItem button onClick={reportGenerateButtonHandler}>
          <ListItemIcon>
            <AssessmentRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Generate Report" />
        </ListItem>
      )}
      <ListItem button>
        <ListItemIcon>
          <AccountCircleIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
    </List>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login })(NestedList);
