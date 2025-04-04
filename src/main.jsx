import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./home.jsx";
import { Bg } from "./components/bg.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Bg />
  </StrictMode>
);
