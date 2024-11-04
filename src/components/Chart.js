import { btcKline } from "./BtcData.js";
import React, { useEffect, useState } from "react";
import { CanvasJS, CanvasJSChart } from "canvasjs-react-charts"; // Use named imports
import {
  candleIndetification,
  identifyCandleWithNextCandle,
} from "./candleIdentify.js";
import { Link } from "react-router-dom";
const { BollingerBands } = require("technicalindicators");

const Chart = () => {
  const [candlesPerChart, setcandlesPerChart] = useState(100);
  const [whichPage, setwhichPage] = useState(1);
  const [btcHistorical, setbtcHistorical] = useState(
    btcKline.slice(0, btcKline?.length - 1)
  );
  const [totalCandles, settotalCandles] = useState(btcKline?.length);

  // console.log("btcKline?.length - ", btcKline?.length);
  const totalPages = Math.ceil(totalCandles / candlesPerChart);
  const totalPagesArray = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const startIndex = (whichPage - 1) * candlesPerChart;
  const endIndex = whichPage * candlesPerChart;

  const ohlcData = btcHistorical.slice(19).map((data) => ({
    x: new Date(data[0]),
    y: [
      parseInt(data[1]), // Open
      parseInt(data[2]), // High
      parseInt(data[3]), // Low
      parseInt(data[4]), // Close
    ],
  }));

  // Example input data
  const input = {
    period: 20, // Set your desired period
    values: btcHistorical.map((entry) => parseInt(entry[4])), // Array of closing prices
    stdDev: 2, // Standard deviation multiplier (commonly set to 2)
  };

  const bb = BollingerBands.calculate(input);

  let dataPoints = ohlcData.map((entry, index) => {
    const { isBullish, isBearish } = candleIndetification(
      entry.y[0],
      entry.y[1],
      entry.y[2],
      entry.y[3]
    );

    // Add Bollinger Bands values to the data point if available

    const bbUpperBand = bb[index] ? parseInt(bb[index].upper) : null;
    const bbLowerBand = bb[index] ? parseInt(bb[index].lower) : null;
    const bbMiddleBand = bb[index] ? parseInt(bb[index].middle) : null;

    const { bullishAfterConfirmation, bearishAfterConfirmation } =
      identifyCandleWithNextCandle(
        isBullish,
        isBearish,
        index,
        ohlcData,
        entry,
        bbUpperBand,
        bbLowerBand
      );

    let chartDataPoint = {
      x: new Date(entry.x),
      y: [
        parseInt(entry.y[0]), // Open
        parseInt(entry.y[1]), // High
        parseInt(entry.y[2]), // Low
        parseInt(entry.y[3]), // Close
      ],
      bbUpperBand,
      bbLowerBand,
      bbMiddleBand,
    };

    if (bullishAfterConfirmation) {
      chartDataPoint = {
        ...chartDataPoint,
        indexLabel: "⤴",
        indexLabelFontColor: "green", // Color for bullish candles
        indexLabelFontSize: 30,
        indexLabelPlacement: "inside", // Use "inside" for below the candle
        indexLabelVerticalAlign: "bottom", // Align the label to the bottom
        // offsetY: 50, // Adjust the position downwards
      };
    } else if (bearishAfterConfirmation) {
      chartDataPoint = {
        ...chartDataPoint,
        indexLabel: "⤵",
        // indexLabel: "Bearish",
        indexLabelFontColor: "red", // Color for bearish candles
        indexLabelFontSize: 30,
        indexLabelPlacement: "inside", // Use "inside" for above the candle
        indexLabelVerticalAlign: "top", // Align the label to the top
        // offsetY: 50, // Adjust the position upwards
      };
    }

    return chartDataPoint;
  });

  dataPoints.reverse();

  // --------------------------
  // Apply  Pagination
  // --------------------------
  const initialPaginatedHistoricalData = dataPoints.slice(startIndex, endIndex);
  // console.log(
  //   "initialPaginatedHistoricalData - ",
  //   initialPaginatedHistoricalData?.length
  // );

  // Pagination btns clicks
  const handleNext = () => {
    if (whichPage < totalPages) {
      setwhichPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrev = () => {
    if (whichPage > 1) {
      setwhichPage((prevPage) => prevPage - 1);
    }
  };

  // For Date Range
  const timestamps = btcKline.map((candle) => candle[0]);
  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));

  const options = {
    animationEnabled: true,
    panningEnabled: true,
    zoomEnabled: true,
    theme: "light2",
    title: {
      // text: "Candlestick Chart with Bollinger Bands",
    },
    axisX: {
      // title: "Time Frame",
      valueFormatString: "DD MMM YYYY HH:mm", // Format for x-axis dates
      labelFontSize: 8,
      labelFontColor: "#666",
      crosshair: {
        enabled: true,
        snapToDataPoint: true,
        labelFormatter: function (e) {
          return CanvasJS.formatDate(e.value, "HH:mm");
        },
      },
    },

    axisY: {
      includeZero: false,
      // title: "Prices",
      prefix: "$ ",
    },

    toolTip: {
      shared: true, // To share the tooltip across different series
    },

    data: [
      {
        type: "candlestick",
        name: "Candlestick Data",
        risingColor: "#4caf50",
        fallingColor: "#f44336",
        borderThickness: 1, // Set the border thickness for both rising and falling candles
        risingBorderColor: "#4caf50", // Optional: Set specific border color for rising candles
        fallingBorderColor: "#f44336", // Optional: Set specific border color for falling candles

        dataPoints: initialPaginatedHistoricalData.map((item) => ({
          x: item.x,
          y: item.y,
          indexLabel: item.indexLabel,
          indexLabelFontColor: item.indexLabelFontColor,
          indexLabelFontSize: item.indexLabelFontSize,
          indexLabelPlacement: item.indexLabelPlacement,
          indexLabelVerticalAlign: item.indexLabelVerticalAlign,
        })),
        dataPointWidth: 30, // Adjust the width of candlesticks
        toolTipContent:
          "Date: {x}<br/>Open: ${y[0]}<br/>High: ${y[1]}<br/>Low: ${y[2]}<br/>Close: ${y[3]}",
      },
      {
        type: "line",
        name: "Bollinger Upper Band",
        showInLegend: true,
        dataPoints: initialPaginatedHistoricalData.map((item) => ({
          x: item.x,
          y: item.bbUpperBand,
        })),
      },
      {
        type: "line",
        name: "Bollinger Middle Band",
        showInLegend: true,
        dataPoints: initialPaginatedHistoricalData.map((item) => ({
          x: item.x,
          y: item.bbMiddleBand,
        })),
      },
      {
        type: "line",
        name: "Bollinger Lower Band",
        showInLegend: true,
        dataPoints: initialPaginatedHistoricalData.map((item) => ({
          x: item.x,
          y: item.bbLowerBand,
        })),
      },
    ],
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "20px",
          justifyContent: "center",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div>
          <Link to="/tradeConditions"> Check Applied Conditions </Link>
        </div>
        <div>
          <label htmlFor="candlesPerChart">Candles per chart:</label>
          <select
            id="candlesPerChart"
            value={candlesPerChart}
            onChange={(e) => setcandlesPerChart(e.target.value)}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>

        <div>
          <button onClick={handlePrev} disabled={whichPage === 1}>
            Next
          </button>
          <span>
            {" "}
            Page {whichPage} of {totalPages}{" "}
          </span>
          <button onClick={handleNext} disabled={whichPage === totalPages}>
            Prev
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <p>Historical Date Range -</p>
          <p>From : {minDate.toLocaleString()}</p>
          <p>To : {maxDate.toLocaleString()}</p>
        </div>
      </div>

      <CanvasJSChart options={options} />
    </>
  );
};

export default Chart;
