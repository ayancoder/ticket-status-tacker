import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Navbar } from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import TicketsTable from "./components/ticket/TicketTable";

// Redux
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/dashboard" component={Dashboard}></Route>
            <Route exact path="/tickets" component={TicketsTable}></Route>
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
