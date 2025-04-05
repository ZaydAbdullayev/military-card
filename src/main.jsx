import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App, Layout } from "./home.jsx";
import { Bg } from "./components/bg.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Card } from "./card.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/apply" element={<Card />} />
        </Route>
      </Routes>
      <Bg />
    </BrowserRouter>
  </StrictMode>
);
