import { emiPerMonth } from "../utils/format.js";
import { ChevronRight } from "./Icons.jsx";

const banks = ["#1f70c1", "#f26d21", "#d8232a", "#e8472b"];

export default function EmiBox({ price }) {
  return (
    <div className="emi">
      <div className="emi__head">
        <strong>EMI Plans</strong>
        <span className="emi__powered">
          powered by <b>Razorpay</b>
        </span>
      </div>
      <div className="emi__card">
        <p className="emi__from">EMI from ₹{emiPerMonth(price)}/month</p>
        <div className="emi__row">
          <div className="emi__banks">
            {banks.map((c) => (
              <span key={c} className="emi__bank"><i style={{ background: c }} /></span>
            ))}
            <span className="emi__bank emi__bank--more">+8</span>
          </div>
          <button type="button" className="emi__plans">
            View plans <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}