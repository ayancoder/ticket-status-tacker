import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";

// Generate Order Data
function createData(
  id,
  subject,
  createdBy,
  createDate,
  assignedTo,
  assignedDate,
  status
) {
  return {
    id,
    subject,
    createdBy,
    createDate,
    assignedTo,
    assignedDate,
    status,
  };
}

const rows = [
  createData(
    0,
    "application for home",
    "Elvis Presley",
    "16 Mar, 2019",
    "Paul McCartney",
    "16 Mar, 2019",
    "New"
  ),
  createData(
    1,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    2,
    "application for home",
    "Elvis Presley",
    "16 Mar, 2019",
    "Paul McCartney",
    "16 Mar, 2019",
    "New"
  ),
  createData(
    3,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Tickets() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Recent Tickets</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Created by </TableCell>
            <TableCell>Created Date </TableCell>
            <TableCell>Assignned To</TableCell>
            <TableCell>Assigned Date </TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.subject}</TableCell>
              <TableCell>{row.createdBy}</TableCell>
              <TableCell>{row.createdBy}</TableCell>
              <TableCell>{row.assignedTo}</TableCell>
              <TableCell>{row.assignedDate}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more Tickets
        </Link>
      </div>
    </React.Fragment>
  );
}
