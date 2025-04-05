import "./home.css";
import "./military-card.css";
import { RiTwitterXLine } from "react-icons/ri";
import logo from "./assets/logo2.png";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

export const App = () => {
  const navigate = useNavigate();
  return (
    <div className="wrapper">
      <div className="home-container">
        <div className="info">
          <img src={logo} alt="Logo" className="logo" />
          <h1>National Trenches Forces</h1>
          <h2>Are you a Dip Sniper or a Moon Commander?</h2>
          <span>
            A Scout for hidden gems, or a Rugpull Survivor still standing
            strong?
          </span>
          <h3>
            Whatever your rank, one thing’s for sure — you’re in the trenches
            now.
          </h3>
          <div className="btns">
            <button
              onClick={() =>
                window.open(" https://x.com/trenches_forces", "_blank")
              }
            >
              <RiTwitterXLine />
            </button>
            <button className="apply-button" onClick={() => navigate("/apply")}>
              Apply Now
            </button>
          </div>
        </div>
      </div>
      <footer className="home-footer">
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export const Layout = () => {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
};
