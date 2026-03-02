import { INITIAL_CASH } from "./constants.js";

let cash = INITIAL_CASH;
let holdings = {};
let listeners = [];

export function buy(symbol, price, quantity) {
  const totalCost = price * quantity;
  if (cash >= totalCost) {
    cash -= totalCost;
    holdings[symbol] = (holdings[symbol] || 0) + quantity;
    saveToStorage();
    notifyListeners();
  }
}

export function sell(symbol, price, quantity) {
  if (holdings[symbol] >= quantity) {
    cash += price * quantity;
    holdings[symbol] -= quantity;
    if (holdings[symbol] === 0) {
      delete holdings[symbol];
    }
    saveToStorage();
    notifyListeners();
  }
}

export function getCash() {
  return cash;
}

export function getHoldings() {
  return { ...holdings };
}

export function getPortfolioValueBySymbol(symbol, currentPrice) {
  return (holdings[symbol] || 0) * currentPrice;
}

export function getTotalValue(currentPrices) {
  let totalValue = cash;
  Object.keys(holdings).forEach((symbol) => {
    totalValue += currentPrices[symbol] * holdings[symbol];
  });
  return totalValue;
}

export function addListener(callback) {
  listeners.push(callback);
}

export function removeListener(callback) {
  listeners = listeners.filter((cb) => cb !== callback);
}

export const saveToStorage = () => {
  localStorage.setItem("cash", cash);
  localStorage.setItem("holdings", JSON.stringify(holdings));
};

export const loadFromStorage = () => {
  const storedCash = localStorage.getItem("cash");
  const storedHoldings = localStorage.getItem("holdings");

  if (storedCash !== null) {
    cash = parseFloat(storedCash);
  }
  if (storedHoldings !== null) {
    holdings = JSON.parse(storedHoldings);
  }
};

function notifyListeners() {
  listeners.forEach((listener) => listener({ cash, holdings }));
}

loadFromStorage();
