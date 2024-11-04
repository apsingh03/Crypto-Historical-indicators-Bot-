import logo from "./logo.svg";
import "./App.css";
import Chart from "./components/Chart";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Conditions from "./Pages/Conditions";

function App() {
  return (
    <>
      {/* 
      // https://binance-docs.github.io/apidocs/futures/en/#kline-candlestick-data
//canvasjs.com/docs/charts/chart-types/html5-candle-stick-chart/
//api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000 */}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tradeConditions" element={<Conditions />} />
      </Routes>
    </>
  );
}

export default App;

// codes to download data in bulk
// async function fetchAllCandles(symbol, interval, startTime, endTime) {
//   let allCandles = [];
//   let currentStartTime = startTime;

//   while (currentStartTime < endTime) {
//     const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${currentStartTime}&limit=1000`;
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.length === 0) break; // If no more data is returned, stop

//     allCandles = allCandles.concat(data);

//     // Move the start time forward by the number of entries fetched
//     currentStartTime = data[data.length - 1][0] + 1;
//   }

//   // Save data to a file in the browser
//   const jsonData = JSON.stringify(allCandles, null, 2); // Convert data to JSON string
//   const blob = new Blob([jsonData], { type: "application/json" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "candlesData.json"; // Name of the file
//   link.click();

//   // Clean up the URL object
//   URL.revokeObjectURL(url);

//   return allCandles;
// }

// // Example usage
// const symbol = "BTCUSDT";
// const interval = "1h";
// const startTime = new Date("2024-01-01T00:00:00Z").getTime(); // 1st January 2024
// const endTime = new Date("2024-11-02T00:00:00Z").getTime(); // 2nd November 2024

// fetchAllCandles(symbol, interval, startTime, endTime).then((candles) => {
//   console.log("Total Candles Fetched:", candles.length);
// });
