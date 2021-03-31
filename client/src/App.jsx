import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage.jsx";

const App = () => {
  return (
    <div id="app">
      <Router>
        <Switch>
          <Route path="/" exact render={() => <Homepage />} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
