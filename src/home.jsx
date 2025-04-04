import { useState, useEffect } from "react";
import "./home.css";
import "./components/index.scss";
import { HeartBeat } from "./components/bg";
import {
  GiClaymoreExplosive,
  GiMedicines,
  GiPistolGun,
  GiBombingRun,
} from "react-icons/gi";
import { FaTelegramPlane } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const detections = [
  { type: "explosive", icon: GiClaymoreExplosive },
  { type: "drugs", icon: GiMedicines },
  { type: "weapons", icon: GiPistolGun },
  { type: "contraband", icon: GiBombingRun },
];

export const App = () => {
  const [applyNow, setApplyNow] = useState(false);
  return (
    <div className="wrapper">
      <div className="home-container">
        <div className="info">
          <h1>National Security Forces</h1>
          <h2>Welcome to the National Security Forces</h2>
          <span>Your safety is our priority.</span>
          <p>Join us in our mission to protect and serve.</p>
          <p>
            We are committed to ensuring the safety and security of our nation.
          </p>
          <div className="btns">
            <button>
              Telegram <FaTelegramPlane />
            </button>
            <button>
              <RiTwitterXLine />
            </button>
          </div>
        </div>
        <div className="detections">
          <h2>Detection Alerts</h2>
          <div className="detections-list">
            {detections.map((detection, index) => (
              <div key={index} className="detection-item">
                <div className="detection-icon">{<detection.icon />}</div>
                <HeartBeat />
                <div className="detection-type">{detection.type}</div>
                <span></span>
                <span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="join-forces">
          <h2>Join the Forces</h2>
          <p>Be part of something bigger.</p>
          <p>We are looking for dedicated individuals.</p>
          <p>Apply now and make a difference.</p>
          <button className="apply-button">Apply Now</button>
        </div>

        {applyNow && (
          <div className="contitution">
            <h1>🪖 CONSTITUTION OF DUTY & LOYALTY</h1>
            <p>
              1. I shall protect with honor the unity, sovereignty, and dignity
              of our command at all costs.
            </p>

            <p>
              2. I swear unwavering loyalty to my comrades, my mission, and the
              higher order I serve.
            </p>

            <p>
              3. I shall remain silent and resolute in the face of fear, doubt,
              or betrayal.
            </p>

            <p>
              4. I will never disclose confidential operations, identities, or
              internal affairs.
            </p>

            <p>
              5. I shall act with discipline, responsibility, and strategic
              precision in every action taken.
            </p>

            <p>
              6. I pledge to uphold truth, even when surrounded by deception,
              and to resist corruption at all times.
            </p>

            <p>
              7. I serve not for glory, but for duty — until relieved or fallen.
            </p>
          </div>
        )}
      </div>
      <footer className="home-footer">
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};
