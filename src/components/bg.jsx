import "./index.scss";
import bg from "../assets/bg.jpg";

export const HeartBeat = () => {
  return (
    <div className="heartbeat-container">
      <svg
        viewBox="0 0 2000 100"
        preserveAspectRatio="none"
        className="heartbeat-svg"
      >
        <path
          className="heartbeat-path"
          d="
        M0,50 
        L100,50 
        L130,20 L140,80 L150,50 
        L300,50 
        L330,35 L340,65 L350,50 
        L500,50 
        L530,25 L540,75 L550,50 
        L700,50 
        L730,40 L740,60 L750,50 
        L900,50 
        L930,15 L940,85 L950,50 
        L1100,50 
        L1130,30 L1140,70 L1150,50 
        L1300,50 
        L1330,40 L1340,60 L1350,50 
        L1500,50 
        L1530,22 L1540,78 L1550,50 
        L1700,50 
        L1730,35 L1740,65 L1750,50 
        L2000,50
      "
        />
      </svg>
    </div>
  );
};

export const Bg = () => {
  return (
    <div className="bg-container">
      <img src={bg} alt="troop" className="troop-image" />
      <span className="signal _1"></span>
      <span className="signal _2"></span>
      <span className="signal _3"></span>
      <span className="signal _4"></span>
      <span className="signal _5"></span>
      <span className="signal _6"></span>
      <span className="signal _7"></span>
      <span className="signal _8"></span>
      <span className="signal _9"></span>
      <span className="signal _10"></span>
      <span className="signal _11"></span>
      <span className="signal _12"></span>
      <span className="signal _13"></span>
      <span className="signal _14"></span>
    </div>
  );
};
