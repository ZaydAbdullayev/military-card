import { useState, useRef, useEffect } from "react";
import "./home.css";
import "./military-card.css";
import "./components/index.scss";
import { HeartBeat } from "./components/bg";
import {
  GiClaymoreExplosive,
  GiMedicines,
  GiPistolGun,
  GiBombingRun,
} from "react-icons/gi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaHelmetUn } from "react-icons/fa6";
import { RiTwitterXLine } from "react-icons/ri";
import { TbUserSquare } from "react-icons/tb";
import logo from "./assets/logo.png";
import troop from "./assets/troop.png";
import roset from "./assets/rozet.png";
import {
  formatMilitaryDate,
  generateRandomID,
  getRandomRank,
  getRandomRozetClass,
  saveCardAsImage,
} from "./context/service";
import military_logo from "./assets/logo2.png";
import chip from "./assets/chip.webp";
import { BiLoaderCircle } from "react-icons/bi";
import { PDF417Canvas } from "./components/qr";
import stamp from "./assets/stamp2.png";

const detections = [
  { type: "explosive", icon: GiClaymoreExplosive },
  { type: "drugs", icon: GiMedicines },
  { type: "weapons", icon: GiPistolGun },
  { type: "contraband", icon: GiBombingRun },
];

export const App = () => {
  const [applyNow, setApplyNow] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [militaryCard, setMilitaryCard] = useState(null);

  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const scale = window.devicePixelRatio || 2; // Retina ekranlar için
    const width = 400;
    const height = 150;

    canvas.width = width * scale;
    canvas.height = height * scale;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.scale(scale, scale); // scale’i ayarla

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);
  }, [openForm]);

  const startDrawing = (e) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const takePhotoLink = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const getUserLocationByIP = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      const location = {
        city: data.city,
        region: data.region,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
        ip: data.ip,
      };
      return location;
    } catch (error) {
      console.error("Konum alınamadı ❌", error);
      return null;
    }
  };

  const generate_card = async () => {
    setMilitaryCard({ loading: true });
    const formEl = document.querySelector(".form-container");
    const formData = new FormData(formEl);
    const value = Object.fromEntries(formData.entries());

    // Rastgele ID ve rütbe üret
    const randomID = generateRandomID();
    const selectedRank = getRandomRank();
    const location = await getUserLocationByIP();
    const issued_at = formatMilitaryDate(new Date().toISOString());
    const expires_at = formatMilitaryDate(
      new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toISOString()
    );

    // imzayı doğrudan canvasRef'ten al
    const signatureData = canvasRef.current.toDataURL("image/png");

    const cardData = {
      ...value,
      military_id: randomID,
      rank: selectedRank.title,
      pay_grade: selectedRank.grade,
      signature: signatureData || null,
      photo: photo || null,
      location: location || null,
      issued_at,
      expires_at,
    };

    const barcodeText = `
MILITARY ID: ${cardData.military_id}
NAME: ${cardData.fullname}
RANK: ${cardData.rank} (${cardData.pay_grade})
BIRTH: ${cardData.birthday}
REGION: ${cardData.location}
`.trim();
    cardData.pdf417 = barcodeText;

    setMilitaryCard(cardData);
    setOpenForm(false);
    formEl.reset();
  };

  const reset = () => {
    setMilitaryCard({});
    setOpenForm(true);
    setPhoto(null);
  };

  const downloadCard = async () => {
    const cardElement = document.querySelector(".military-card_container");
    saveCardAsImage(cardElement);
  };

  return (
    <div className="wrapper">
      <div className="home-container">
        <div className="info">
          <img src={logo} alt="Logo" className="logo" />
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
                <div className="detection-type">
                  {detection.type} Particles Detection
                </div>
                <span></span>
                <span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="join-forces">
          <img src={troop} alt="Troop" className="troop-image" />
          <h2>Join the Forces</h2>
          <p>Be part of something bigger.</p>
          <p>We are looking for dedicated individuals.</p>
          <p>Apply now and make a difference.</p>
          <button className="apply-button" onClick={() => setApplyNow(true)}>
            Apply Now
          </button>
        </div>

        {(applyNow || militaryCard?.loading) && (
          <div className="contitution">
            <img src={roset} alt="Troop" className="roset" />
            <h1>
              <FaHelmetUn /> CONSTITUTION OF DUTY & LOYALTY
            </h1>
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
            <div className="accept-box">
              <label htmlFor="accept">
                {" "}
                <input type="checkbox" id="accept" />I accept the terms
              </label>
              <button onClick={() => setOpenForm(true)}>Open to Card</button>
            </div>
          </div>
        )}
        <div className="military-card">
          {openForm && (
            <form
              className="form-container"
              onSubmit={(e) => e.preventDefault()}
            >
              <h1>Soldier Information</h1>
              <label>
                <span>Fullname *</span>
                <input
                  type="text"
                  name="fullname"
                  required
                  placeholder="Enter your fullname"
                />
              </label>
              <label>
                <span>Nickname</span>
                <input
                  type="text"
                  name="nickname"
                  placeholder="Enter your nickname"
                />
              </label>
              <label>
                <span>Birthday *</span>
                <input
                  type="text"
                  name="birthday"
                  required
                  placeholder="22/10/2004"
                />
              </label>
              <label className="photo">
                <span>Your photo *</span>

                <input
                  type="file"
                  required
                  onChange={(e) => takePhotoLink(e.target.files[0])}
                />
                {photo ? <img src={photo} alt="User" /> : <TbUserSquare />}
              </label>
              <div className="signature-wrapper">
                <span>Your signature *</span>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <button onClick={clearCanvas} type="button">
                  Clear
                </button>
              </div>
              <button onClick={generate_card}>
                Take Military Card{" "}
                {militaryCard?.loading && <BiLoaderCircle className="loader" />}
              </button>
            </form>
          )}
          {militaryCard?.military_id && (
            <div className="military-card_container">
              <div className="first-section">
                <figure className="user-photo">
                  <img src={militaryCard?.photo} alt="User" />
                  <p>Name: {militaryCard?.fullname}</p>
                </figure>
                <figure className="military-info">
                  <h3>Armed Forces of the National Security</h3>
                  <img src={military_logo} alt="Logo" className="logo2" />
                  <p>
                    Army <span>ACTIVE DUTY</span>
                  </p>
                </figure>
              </div>
              <div className="user-info">
                <p>
                  DPO: <span>{militaryCard?.birthday}</span>
                </p>
                <p>
                  Origin:{" "}
                  <span>
                    {militaryCard?.location?.city},
                    {militaryCard?.location?.country}
                  </span>
                </p>
              </div>
              <div className="second-section">
                <PDF417Canvas value={militaryCard?.pdf417} />
                <div className="military-info-details">
                  <label>
                    <p>
                      Rank: <span>{militaryCard?.rank}</span>
                    </p>
                    <p>
                      Pay Grade:{" "}
                      <span>
                        {militaryCard?.pay_grade} | {militaryCard?.military_id}
                      </span>
                    </p>
                  </label>
                  <div>
                    <div className="rozets-wrapper">
                      <div className={`rozet ${getRandomRozetClass()}`} />
                    </div>
                    <figure>
                      <label className="signature">
                        <span>Signature:</span>
                        <img src={militaryCard?.signature} alt="signature" />
                      </label>
                      <img src={chip} alt="chip" className="chip" />
                    </figure>
                    <div className="date-info">
                      <p>
                        Issued Date: <span>{militaryCard?.issued_at}</span>
                      </p>
                      <p>
                        Expires Date: <span>{militaryCard?.expires_at}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p>Armed Forces Indentification Card</p>
              <img src={stamp} alt="stamp" className="stamp" />
            </div>
          )}
          {militaryCard?.military_id && (
            <div className="actions">
              <button>Share from X</button>
              <button onClick={downloadCard}>Download to Galery</button>
              <button onClick={reset}>Reset</button>
            </div>
          )}
        </div>
      </div>
      <footer className="home-footer">
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};
