import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

import { positions, transitions, Provider as AlertProvide } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 5000,
  positions: positions.TOP_RIGHT,
  transitions: transitions.SCALE,
};

ReactDOM.render(
  <Provider store={store}>
    <AlertProvide template={AlertTemplate} {...options}>
      <App />
    </AlertProvide>
  </Provider>,
  document.getElementById("root")
);
