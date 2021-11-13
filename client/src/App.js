import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Navbar } from "./components/layout/Navbar";
import Alert from "./components/layout/Alert";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import NewTicketDisplay from "./components/ticket/NewTicketDisplay";
import { loadUser } from "./actions/auth";
import ReportGenerate from "./components/report/ReportGenerate";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";
// Redux
import { Provider } from "react-redux";
import store from "./store";

import "./App.css";
import NewTicket from "./components/ticket/NewTicket";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/login" component={Login}></Route>
              <Route exact path="/register" component={Register}></Route>
              <PrivateRoute
                exact
                path="/dashboard"
                component={Dashboard}
              ></PrivateRoute>
              <Route
                exact
                path="/tickets"
                component={NewTicketDisplay}
                withLink="tickets"
              ></Route>
              <Route exact path="/newTicket" component={NewTicket}></Route>
              <Route exact path="/report" component={ReportGenerate}></Route>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
