function calculateWicks(open, high, low, close) {
  // Determine if the candle is bullish or bearish
  const isBullishOrBearish = close > open;

  // Calculate body size
  const bodySize = Math.abs(close - open);

  // Calculate lower wick
  const lowerWick = isBullishOrBearish ? open - low : close - low;

  // Calculate upper wick
  const upperWick = isBullishOrBearish ? high - close : high - open;

  return {
    bodySize,
    lowerWick,
    upperWick,
    isBullishOrBearish,
  };
}

function isVolatileCandle(open, high, low, close, thresholdPercentage = 0.4) {
  const totalMovement = high - low;
  const threshold = (thresholdPercentage / 100) * open;

  // If the total movement is greater than the threshold, consider it volatile
  return totalMovement >= threshold;
}

function candleIndetification(open, high, low, close) {
  const { isBullishOrBearish, bodySize, lowerWick, upperWick } = calculateWicks(
    open,
    high,
    low,
    close
  );

  let candleType = {
    isBullish: false,
    isBearish: false,
  };

  //   // Check the criteria
  const bullishIsLongLowerWick = lowerWick > bodySize && lowerWick > upperWick;
  const bullishIsSmallBody = bodySize < (high - low) * 0.3; // Assuming small body is less than 30% of the total range

  if (
    bullishIsLongLowerWick &&
    bullishIsSmallBody &&
    close > open &&
    isVolatileCandle(open, high, low, close)
  ) {
    candleType.isBullish = true;
  }

  // Check the criteria for a bearish candle
  const bearishIsLongUpperWick = upperWick > bodySize && upperWick > lowerWick;
  const bearishIsSmallBody = bodySize < (high - low) * 0.3; // Assuming small body is less than 30% of the total range

  if (
    bearishIsLongUpperWick &&
    bearishIsSmallBody &&
    close < open &&
    isVolatileCandle(open, high, low, close)
  ) {
    candleType.isBearish = true;
  }

  return candleType;
}

function checkBullishBBLowerBand(currentOpen, currentLow, bbLowerBand) {
  // Check if bbLower is between low and open
  if (bbLowerBand >= currentLow && bbLowerBand <= currentOpen) {
    // console.log(true); // BB Lower Band value is between Low and Open
    return true;
  }
  return false;
}

function checkBearishBBUpperBand(currentOpen, currentHigh, bbUpperBand) {
  // Check if bbLower is between low and open
  if (bbUpperBand >= currentOpen && bbUpperBand <= currentHigh) {
    // console.log(true); // BB Upper Band value is between Open and High
    return true;
  }
  return false;
}

function identifyCandleWithNextCandle(
  isBullish,
  isBearish,
  index,
  ohlcData,
  entry,
  bbUpperBand,
  bbLowerBand
) {
  let candleType = {
    bullishAfterConfirmation: false,
    bearishAfterConfirmation: false,
  };

  // BB

  if (isBullish || isBearish) {
    const currentOpen = parseFloat(entry.y[0]);
    const currentHigh = parseFloat(entry.y[1]);
    const currentLow = parseFloat(entry.y[2]);
    const currentClose = parseFloat(entry.y[3]);

    // Current index
    const findIndex = index;

    // Check if the next entry exists before comparing to avoid accessing out of bounds
    if (ohlcData[findIndex + 1]) {
      // Current entry's close
      const nextClose = parseFloat(ohlcData[findIndex + 1].y[3]); // Next entry's close

      // Compare the close values 7322
      if (
        isBullish &&
        nextClose > currentClose &&
        checkBullishBBLowerBand(currentOpen, currentLow, bbLowerBand)
      ) {
        candleType.bullishAfterConfirmation = true;

        const sdafsadfds =
          new Date(entry.x).toLocaleDateString() +
          " " +
          new Date(entry.x).toLocaleTimeString();
        // console.log(
        //   `Bullish i - ${findIndex}: ${sdafsadfds} CurrentClose (${currentClose}) > nextClose (${parseFloat(
        //     ohlcData[findIndex + 1].y[3]
        //   )}). ${nextClose > currentClose} `
        // );
      }

      if (
        isBearish &&
        nextClose < currentClose &&
        checkBearishBBUpperBand(currentOpen, currentHigh, bbUpperBand)
      ) {
        candleType.bearishAfterConfirmation = true;
      }
    }
  }

  return candleType;
}

// --------------------------------------------------------------

module.exports = {
  candleIndetification,
  identifyCandleWithNextCandle,
};
