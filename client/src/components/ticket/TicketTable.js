import React, { useState, useRef, useCallback } from "react";
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { tickets } from "../../actions/ticket";
import { Link } from "react-router-dom";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

function TicketsTable({ user, tickets, newTickets, ticketType }) {
  const classes = useStyles2();
  const [pageNumber, setPageNumber] = useState(1);
  const [newtickets, setTickets] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [subject, setSubject] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);

  const observer = useRef();
  const lastTicketElementRef = useCallback(
    (node) => {
      if (newTickets.loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [newTickets.loading, hasMore]
  );

  React.useEffect(() => {
    if (user && user.role === "BDO") {
      tickets(ticketType !== null ? ticketType : "NEW", pageNumber, 15);
    } else if (user && user.role === "CC_OFFICER") {
      console.log("CC_OFFICE new ticket");
      tickets(
        ticketType !== null ? ticketType : "NEW",
        pageNumber,
        15,
        user == null ? null : user._id + "Creator"
      );
    } else {
      tickets(
        ticketType !== null ? ticketType : "NEW",
        pageNumber,
        15,
        user == null ? null : user._id
      );
    }
  }, [pageNumber]);

  React.useEffect(() => {
    console.log(ticketType);
    setPageNumber(1);
    setTickets([]);
    if (user == null) {
      window.location.reload();
    }
    if (user && user.role === "BDO") {
      tickets(ticketType !== null ? ticketType : "NEW", pageNumber, 15);
    } else if (user && user.role === "CC_OFFICER") {
      console.log("CC_OFFICE new ticket");
      tickets(
        ticketType !== null ? ticketType : "NEW",
        pageNumber,
        15,
        user == null ? null : user._id + "Creator"
      );
    } else {
      tickets(
        ticketType !== null ? ticketType : "NEW",
        pageNumber,
        15,
        user == null ? null : user._id
      );
    }
  }, [ticketType]);

  React.useEffect(() => {
    console.log(newTickets);
    console.log("Entered Here");
    if (newTickets.ticket != null) {
      console.log("Ticket Added");
      setTickets((prevtickets) => {
        return [newTickets.ticket, ...prevtickets];
      });
    } else if (
      newTickets.loading === false &&
      newTickets.tickets.tickets != null &&
      newtickets.length !== newTickets.tickets.total
    ) {
      if (subject !== "") {
        setSubject("");
        setTickets(newTickets.tickets.tickets);
      } else if (searchEnabled === false) {
        newTickets.tickets.tickets.map((ticket) => {
          setTickets((prevtickets) => {
            var flag = true;
            if (prevtickets != null) {
              prevtickets.map((prevticket) => {
                if (prevticket.docketId === ticket.docketId) {
                  flag = false;
                }
              });
            }
            if (flag === true && ticket.state === ticketType) {
              return [...prevtickets, ticket];
            } else {
              return [...prevtickets];
            }
          });
        });
        setHasMore((prev) => {
          if (newTickets.tickets.totalPages < pageNumber) {
            return false;
          } else {
            return true;
          }
        });
      }
    }
  }, [newTickets.tickets]);

  const onSubjectChange = (e) => {
    if (e.target.value.indexOf("\n") !== -1) {
      onClickSubmitSubject(e);
    } else {
      setSubject(e.target.value);
    }
  };

  const onClickSubmitSubject = (e) => {
    if (user && user.role === "BDO") {
      tickets(ticketType !== null ? ticketType : "NEW", 1, 15, null, subject);
      setSearchEnabled(true);
    } else if (user && user.role === "CC_OFFICER") {
      console.log("CC_OFFICER new ticket");
      tickets(
        ticketType !== null ? ticketType : "NEW",
        1,
        15,
        user == null ? null : user._id + "Creator"
      );
    } else {
      tickets(
        ticketType !== null ? ticketType : "NEW",
        1,
        15,
        user == null ? null : user._id,
        subject
      );
    }
    setPageNumber(1);
    // setSubject("");
  };

  const onClickCancel = (e) => {
    if (user && user.role === "BDO") {
      tickets(ticketType !== null ? ticketType : "NEW", pageNumber, 15);
    } else if (user && user.role === "CC_OFFICER") {
      console.log("CC_OFFICER new ticket");
      tickets(
        ticketType !== null ? ticketType : "NEW",
        pageNumber,
        15,
        user == null ? null : user._id + "Creator"
      );
    } else {
      tickets(
        ticketType !== null ? ticketType : "NEW",
        pageNumber,
        15,
        user == null ? null : user._id
      );
    }
    setPageNumber(1);
    setSearchEnabled(false);
    // setSubject("");
  };
  return (
    <div>
      <div style={{ display: "flex", marginBottom: "1.5rem" }}>
        <TextareaAutosize
          placeholder="Search With Subject..."
          value={subject}
          onChange={onSubjectChange}
          style={{ height: "1.5rem", width: 300, marginLeft: "28rem" }}
        />
        {searchEnabled === false ? (
          <Button
            style={{ height: "1.5rem" }}
            disabled={!subject}
            onClick={onClickSubmitSubject}
          >
            <SearchIcon />
          </Button>
        ) : (
          <Button style={{ height: "1.5rem" }} onClick={onClickCancel}>
            <CancelIcon />
          </Button>
        )}
      </div>
      {newtickets.length !== 0 && (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Docket Number</StyledTableCell>
                <StyledTableCell align="left">Subject</StyledTableCell>
                <StyledTableCell align="left">Created by</StyledTableCell>
                <StyledTableCell align="left">Created Date</StyledTableCell>
                <StyledTableCell align="left">Status</StyledTableCell>
                {user && user.role !== "CC_OFFICER" && ticketType !== "NEW" ? (
                  <StyledTableCell align="left">Assigned Date</StyledTableCell>
                ) : (
                  <StyledTableCell align="left"></StyledTableCell>
                )}
                {user && user.role !== "CC_OFFICER" && ticketType !== "NEW" ? (
                  <StyledTableCell align="left">Assignned To</StyledTableCell>
                ) : (
                  <StyledTableCell align="left"></StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {newtickets &&
                newtickets.map((ticket, index) => {
                  if (newtickets.length === index + 1) {
                    return (
                      <TableRow
                        ref={lastTicketElementRef}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#eeeeee" : "#ffffff",
                          color: "#000000",
                        }}
                      >
                        <StyledTableCell align="left">
                          <Link
                            to={{
                              pathname: `/ticket/details`,
                              state: { ticket },
                            }}
                          >
                            {ticket.docketId}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.subject}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.creator.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.createDate.substring(
                            0,
                            ticket.createDate.indexOf("T")
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {ticket.state}
                        </StyledTableCell>
                        {user?.role !== "CC_OFFICER" ? (
                          <StyledTableCell align="center">
                            {ticket.assignDate == null
                              ? null
                              : ticket.assignDate.substring(
                                  0,
                                  ticket.createDate.indexOf("T")
                                )}
                          </StyledTableCell>
                        ) : (
                          <></>
                        )}
                        {user?.role !== "CC_OFFICER" ? (
                          <StyledTableCell align="center">
                            {ticket?.assignedTo?.name == null
                              ? null
                              : ticket?.assignedTo?.name}
                          </StyledTableCell>
                        ) : (
                          <></>
                        )}
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow
                        style={{
                          font: "serif",
                          backgroundColor:
                            index % 2 === 0 ? "#eeeeee" : "#ffffff",
                        }}
                      >
                        <StyledTableCell align="left">
                          <Link
                            to={{
                              pathname: `/ticket/details`,
                              state: { ticket },
                            }}
                          >
                            {ticket.docketId}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.subject}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.creator.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.createDate.substring(
                            0,
                            ticket.createDate.indexOf("T")
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.state}
                        </StyledTableCell>
                        {user?.role !== "CC_OFFICER" ? (
                          <StyledTableCell align="center">
                            {ticket.assignDate == null
                              ? null
                              : ticket.assignDate.substring(
                                  0,
                                  ticket.createDate.indexOf("T")
                                )}
                          </StyledTableCell>
                        ) : null}
                        {user?.role !== "CC_OFFICER" ? (
                          <StyledTableCell align="center">
                            {ticket?.assignedTo?.name == null
                              ? null
                              : ticket?.assignedTo?.name}
                          </StyledTableCell>
                        ) : null}
                      </TableRow>
                    );
                  }
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  newTickets: state.ticket,
});

export default connect(mapStateToProps, { tickets, login })(TicketsTable);
