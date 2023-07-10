import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./components/services/Display/bootstrap.min.css";
import "./index.css";
import App from "./App";
import store from "./components/redux/Root/Root";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
