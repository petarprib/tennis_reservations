import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <ToastContainer toastStyle={{ backgroundColor: "#3F51B5", color: "#ffffff" }} />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
