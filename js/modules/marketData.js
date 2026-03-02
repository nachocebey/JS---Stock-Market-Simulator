import { UPDATE_INTERVAL } from "./constants.js";

let stocks = [];
let prices = {};
let previousPrices = {};
let listeners = [];

export async function loadStocks() {
  const response = await fetch("../data/stocks.json");
  let data = await response.json();
  stocks = data.stocks;

  stocks.forEach((stock) => {
    prices[stock.symbol] = stock.price;
  });

  notifyListeners();
  return stocks;
}

export function startSimulation() {
  setInterval(() => {
    previousPrices = { ...prices };

    Object.keys(prices).forEach((symbol) => {
      const currentPrice = prices[symbol];
      const variation = (Math.random() - 0.5) * 0.04;
      let newPrice = currentPrice * (1 + variation);
      newPrice = Math.round(newPrice * 100) / 100;
      prices[symbol] = newPrice;
    });

    notifyListeners();
  }, UPDATE_INTERVAL);
}

export function getStockPrice(symbol) {
  return prices[symbol];
}

export function getCurrentPrices() {
  return { ...prices };
}

export function addListener(callback) {
  listeners.push(callback);
}

export function removeListener(callback) {
  listeners = listeners.filter((cb) => cb !== callback);
}

function notifyListeners() {
  let stocksWithCurrentPrices = stocks.map((stock) => {
    return {
      ...stock,
      price: prices[stock.symbol],
      previousPrice: previousPrices[stock.symbol] || stock.price,
    };
  });

  let data = {
    stocks: stocksWithCurrentPrices,
    prices: { ...prices },
  };

  listeners.forEach((listener) => listener(data));
}
