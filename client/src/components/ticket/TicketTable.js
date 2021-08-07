import React from "react";
import PropTypes from "prop-types";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { Link } from "react-router-dom";
import LinkIcon from "@material-ui/icons/Link";
import NativeSelect from "@material-ui/core/NativeSelect";
import { connect } from "react-redux";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

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
  createData(
    4,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    5,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    6,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    7,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    8,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    9,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    10,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    11,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    12,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "Resolved"
  ),
  createData(
    13,
    "application for pension",
    "Paul McCartney",
    "16 Mar, 2019",
    "Tom Scholz",
    "16 Mar, 2019",
    "New"
  ),
];

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

function TicketsTable({ withLink, user }) {
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [stautsState, setStatusState] = React.useState([]);
  const [priorityState, setPriorityState] = React.useState(null);
  const initialvalue = () => {
    if (withLink === "false") return 5;
    else return 10;
  };
  const [rowsPerPage, setRowsPerPage] = React.useState(initialvalue);

  const handleChangePriority = (event) => {
    const priority = event.target.value;
    setPriorityState({
      [priority]: event.target.value,
    });
  };

  const handleCloseDialog = (event) => {
    setOpen(false);
  };

  const add = (event) => {
    rows.map((row) =>
      setStatusState((stautsState) => [...stautsState, row.status])
    );
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Id</StyledTableCell>
            <StyledTableCell align="left">Subject</StyledTableCell>
            <StyledTableCell align="left">Created by</StyledTableCell>
            <StyledTableCell align="left">Created Date</StyledTableCell>
            <StyledTableCell align="left">Assignned To</StyledTableCell>
            <StyledTableCell align="left">Assigned Date</StyledTableCell>
            <StyledTableCell align="left">Status</StyledTableCell>
            {user ? (
              withLink === "true" && user.role === "ADMIN" ? (
                <StyledTableCell align="left">Priority</StyledTableCell>
              ) : (
                <StyledTableCell align="left"></StyledTableCell>
              )
            ) : (
              <StyledTableCell align="left"></StyledTableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row" style={{ width: 10 }}>
                <a href="#">{row.id}</a>
              </StyledTableCell>
              <StyledTableCell align="left">{row.subject}</StyledTableCell>
              <StyledTableCell align="left">{row.createdBy}</StyledTableCell>
              <StyledTableCell align="left">{row.createDate}</StyledTableCell>
              <StyledTableCell align="left">{row.assignedTo}</StyledTableCell>
              <StyledTableCell align="left">{row.assignedDate}</StyledTableCell>

              <StyledTableCell align="left">
                {user ? (
                  withLink === "true" && user.role === "ADMIN" ? (
                    <NativeSelect
                      key={row.id + "_select"}
                      value={stautsState}
                      onChange={(event) => {
                        setOpen(true);
                        setSelectedValue(event.target.value);
                        setSelectedRowId(row.id);
                        setSelectedStatus(row.status);
                      }}
                    >
                      <option value={"New"}>New</option>
                      <option value={"Resolved"}>Resolved</option>
                      <option value={"In Progress"}>In Progress</option>
                    </NativeSelect>
                  ) : (
                    row.status
                  )
                ) : (
                  row.status
                )}
              </StyledTableCell>

              {user ? (
                withLink === "true" && user.role === "ADMIN" ? (
                  <StyledTableCell align="left">
                    <NativeSelect
                      defaultValue={row.status}
                      onChange={handleChangePriority}
                    >
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                    </NativeSelect>
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="left"></StyledTableCell>
                )
              ) : (
                <StyledTableCell align="left"></StyledTableCell>
              )}
            </StyledTableRow>
          ))}

          {open && (
            <Dialog onClose={handleCloseDialog} open={open}>
              <DialogTitle id="simple-dialog-title1">
                Changing Status
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Changing Status For Ticket ID - <b> {selectedRowId}</b> From{" "}
                  {"   "}
                  <b>
                    <i>{selectedStatus} </i>
                  </b>
                  {"  "}
                  To{" "}
                  <b>
                    <i>{selectedValue}.</i>
                  </b>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={(event) => {
                    setOpen(false);
                    setStatusState(selectedStatus);
                  }}
                  color="primary"
                >
                  Discard
                </Button>
                <Button
                  onClick={(event) => {
                    setStatusState(selectedValue);
                    setOpen(false);
                  }}
                  color="primary"
                  autoFocus
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={8} />
            </StyledTableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={
                withLink === "false"
                  ? [5, 10, 25, { label: "All", value: -1 }]
                  : [10, 20, 30, { label: "All", value: -1 }]
              }
              colSpan={7}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(TicketsTable);
