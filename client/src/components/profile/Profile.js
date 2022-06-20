import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Navbar from "../dashboard/Navbar";
import { Button, TextField } from "@material-ui/core";
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
  formcontainerforprofile: {
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
    color: theme.palette.secondary.main,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(67),
  },
  formTypo: {
    color: theme.palette.primary.main,
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(40),
  },
  formTypoImage: {
    color: theme.palette.primary.main,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
  },
  formTypoTextField: {
    paddingTop: theme.spacing(1),
    color: theme.palette.primary.main,
    width: theme.spacing(40),
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
  formRoot: {
    width: "90%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
}));

function Profile({ auth }) {
  const classes = useStyles();
  const [name, setName] = React.useState(auth?.user?.name);
  const [email, setEmail] = React.useState(auth?.user?.email);
  const [role, setRole] = React.useState(auth?.user?.role);
  const [img, setImg] = React.useState(auth?.user?.avatar);
  console.log(auth.user.avatar);
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
                  PROFILE
                </Typography>
              </Paper>
            </Grid>
            <form className={classes.formRoot} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <img
                    src={img}
                    alt="avatar"
                    style={{
                      width: "10rem",
                      marginLeft: "15rem",
                      overflow: "hidden",
                      borderRadius: 160 / 2,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" className={classes.formTypo}>
                    <b>Name -</b>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    id="name"
                    // label="Name"
                    autoFocus
                    inputProps={{
                      readOnly: true,
                    }}
                    value={name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" className={classes.formTypo}>
                    <b>Email Id -</b>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="email"
                    variant="outlined"
                    fullWidth
                    id="email"
                    // label="Email Address"
                    name="email"
                    inputProps={{
                      readOnly: true,
                    }}
                    autoComplete="email"
                    value={email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" className={classes.formTypo}>
                    <b>Assigned Role -</b>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    name="role"
                    // label="Role"
                    type="role"
                    inputProps={{
                      readOnly: true,
                    }}
                    id="role"
                    value={role.replace("_", " ")}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
