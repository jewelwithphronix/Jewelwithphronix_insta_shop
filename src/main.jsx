import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import { hideSplash } from "./utils/splash.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// shop rendered: fade the splash screen out
requestAnimationFrame(() => requestAnimationFrame(hideSplash));
setTimeout(hideSplash, 3000); // in case animation frames are paused (background tab)
