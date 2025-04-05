import { useState, useRef, useEffect } from "react";
import "./home.css";
import "./military-card.css";
import "./components/index.scss";
import { FaHelmetUn } from "react-icons/fa6";
import { TbUserSquare } from "react-icons/tb";
import logo from "./assets/logo2.png";
import roset from "./assets/rozet.png";
import {
  formatMilitaryDate,
  generateRandomID,
  getCardAsImageData,
  getRandomRank,
  getRandomRozetClass,
  saveCardAsImage,
  uploadToImgbb,
} from "./context/service";
import chip from "./assets/chip.webp";
import { BiLoaderCircle } from "react-icons/bi";
import { PDF417Canvas } from "./components/qr";
import stamp from "./assets/stamp2.png";
import { RiHome5Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export const Card = () => {
  const [applyNow, setApplyNow] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [militaryCard, setMilitaryCard] = useState(null);
  const [sending, setSending] = useState(false);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const navigate = useNavigate();

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

    if (!value.fullname || !value.birthday) return;
    if (!photo) return alert("Please take a photo");
    if (!canvasRef.current.toDataURL("image/png")) {
      return alert("Please take a signature");
    }
    if (!value.nickname) value.nickname = "No nickname";

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

  const shareOnX = async () => {
    if (!militaryCard?.military_id) return;
    setSending(true);
    const cardEl = document.querySelector(".military-card_container");
    const imgUrl = await uploadToImgbb(await getCardAsImageData(cardEl));
    console.log(imgUrl);

    const tweetText = `🎖️ Welcome to the trenche force, soldier.
You’ve officially enlisted in the Trenches Armed Forces — there’s no turning back.`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}&url=${encodeURIComponent(imgUrl)}`;
    window.open(tweetUrl, "_blank");
    setSending(false);
  };

  return (
    <div className="wrapper">
      <div className="home-container">
        <button onClick={() => navigate("/")}>
          Back Home <RiHome5Fill />
        </button>
        {(applyNow || militaryCard?.loading) && (
          <div className="contitution">
            <img src={roset} alt="Troop" className="roset" />
            <h1>
              <FaHelmetUn /> CONSTITUTION OF DUTY & LOYALTY
            </h1>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#ccc",
              }}
            >
              National Trenches Forces | Codex of the Chain
            </h2>
            <p>
              1. I shall protect with honor the integrity, decentralization, and
              vision of the crypto frontier — no matter the cost.
            </p>
            <p>
              2. I swear unwavering loyalty to my fellow trench soldiers, the
              mission we fight for, and the freedom of the open ledger.
            </p>
            <p>
              3. I shall remain calm and calculated in the face of FOMO, FUD, or
              rug.
            </p>
            <p>
              4. I will never leak alpha, expose ops, or compromise the
              brotherhood of the chain.
            </p>
            <p>
              5. I shall operate with discipline, risk-awareness, and
              gas-efficient precision in every transaction.
            </p>
            <p>
              6. I pledge to seek truth through on-chain signals, resist
              manipulation, and never bow to centralized control.
            </p>
            <p>
              7. I serve not for fame or fortune — but for the cause. Until I
              hit 0 or touch moon.
            </p>
            <div className="accept-box">
              <label htmlFor="accept">
                {" "}
                <input type="checkbox" id="accept" />I accept the terms
              </label>
              <button
                onClick={() => {
                  setOpenForm(true);
                  setApplyNow(false);
                }}
              >
                Open to Card
              </button>
            </div>
          </div>
        )}
        <div
          className={`military-card ${militaryCard?.military_id ? "blur" : ""}`}
        >
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
                  <h3>National Trenches Forces</h3>
                  <img src={logo} alt="Logo" className="logo2" />
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
              <p>National Trenches Forces Indentification Card</p>
              <img src={stamp} alt="stamp" className="stamp" />
            </div>
          )}
          {militaryCard?.military_id && (
            <div className="actions">
              <button onClick={reset}>Reset</button>
              <button onClick={downloadCard}>Download to Galery</button>
              <button onClick={shareOnX}>
                🚀 Share on X {sending && <BiLoaderCircle className="loader" />}
              </button>
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
