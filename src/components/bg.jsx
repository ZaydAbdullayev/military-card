import "./index.scss";
import bg from "../assets/bg.jpg";

export const Bg = () => {
  return (
    <div className="bg-container">
      <img src={bg} alt="troop" className="troop-image" />
    </div>
  );
};
