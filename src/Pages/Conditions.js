import React from "react";
import { Link } from "react-router-dom";

const Conditions = () => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/"> Home Page </Link>
      </div>

      <div>
        <h2> Bullish </h2>
        <ul>
          <li> Candle Lower Longer Wick </li>
          <li> Candle small Body </li>
          <li> Green Candle </li>
          <li> Candle Volatility filtering small candle Movements </li>
          <li> Above condition will return isBullish True </li>
        </ul>
        <ul>
          <li> isBullish should be true </li>
          <li> nextClosing should be greater than Current Candle Close </li>
          <li>
            {" "}
            BB Consition - bbUpperBand {">="} currentOpen && bbUpperBand {"<="}{" "}
            currentHigh{" "}
          </li>
        </ul>
      </div>
      <div>
        <h2> Bearish </h2>
        <ul>
          <li> Candle Upper Longer Wick </li>
          <li> Candle small Body </li>
          <li> Red Candle </li>
          <li> Candle Volatility filtering small candle Movements </li>
          <li> Above condition will return isBearish True </li>
        </ul>

        <ul>
          <li> isBearish should be true </li>
          <li> nextClosing should be less than Current Candle Close </li>
          <li>
            BB Consition - bbUpperBand {">="} currentOpen && bbUpperBand {"<="}{" "}
            currentHigh
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Conditions;
