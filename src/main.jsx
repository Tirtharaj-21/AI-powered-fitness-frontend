import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "react-oauth2-code-pkce";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { authConfig } from "./authConfig";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider authConfig={authConfig}>
    <Provider store={store}>
      <App />
    </Provider>
  </AuthProvider>,
);
