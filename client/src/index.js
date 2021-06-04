import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.scss";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { ToastContainer } from "react-toastify";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
        <ToastContainer toastStyle={{ backgroundColor: "rgb(135, 206, 235)", color: "rgb(32, 32, 32)" }} />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
