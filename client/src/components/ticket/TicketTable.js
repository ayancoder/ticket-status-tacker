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

function TicketsTable({ withLink, user, tickets, newTickets }) {
  const classes = useStyles2();
  const [pageNumber, setPageNumber] = useState(1);
  const [newtickets, setTickets] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastTicketElementRef = useCallback(
    (node) => {
      console.log(node);
      console.log(hasMore);
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
    tickets("NEW", pageNumber, 15);
  }, [pageNumber]);

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
      newTickets.tickets.tickets.map((ticket) => {
        setTickets((prevtickets) => {
          var flag = true;
          if (prevtickets != null) {
            prevtickets.map((prevticket) => {
              if (prevticket.docketId === ticket.docketId) {
                console.log(ticket);
                flag = false;
              }
            });
          }
          if (flag === true) {
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
  }, [newTickets]);

  return (
    <div>
      {newtickets.length !== 0 && (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Id</StyledTableCell>
                <StyledTableCell align="left">Subject</StyledTableCell>
                <StyledTableCell align="left">Created by</StyledTableCell>
                <StyledTableCell align="left">Created Date</StyledTableCell>
                {user && user.role !== "CC_OFFICER" && (
                  <StyledTableCell align="left">Assigned Date</StyledTableCell>
                )}
                {user && user.role !== "CC_OFFICER" && (
                  <StyledTableCell align="left">Assignned To</StyledTableCell>
                )}
                <StyledTableCell align="left">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newtickets &&
                newtickets.map((ticket, index) => {
                  if (newtickets.length === index + 1) {
                    return (
                      <TableRow ref={lastTicketElementRef}>
                        <StyledTableCell align="left">
                          {ticket.docketId}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.subject}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.creator.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.createDate}
                        </StyledTableCell>
                        {user && user.role === "ADMIN" && (
                          <StyledTableCell align="left">
                            {ticket.assignedDate}
                          </StyledTableCell>
                        )}
                        {user && user.role === "ADMIN" && (
                          <StyledTableCell align="left">
                            {ticket.assignedName}
                          </StyledTableCell>
                        )}
                        <StyledTableCell align="left">
                          {ticket.state}
                        </StyledTableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow>
                        <StyledTableCell align="left">
                          {ticket.docketId}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.subject}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.creator.name}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {ticket.createDate}
                        </StyledTableCell>
                        {user && user.role === "ADMIN" && (
                          <StyledTableCell align="left">
                            {ticket.assignedDate}
                          </StyledTableCell>
                        )}
                        {user && user.role === "ADMIN" && (
                          <StyledTableCell align="left">
                            {ticket.assignedName}
                          </StyledTableCell>
                        )}
                        <StyledTableCell align="left">
                          {ticket.state}
                        </StyledTableCell>
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
