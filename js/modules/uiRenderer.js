import {
  formatMoney,
  formatPercentage,
  calculateChange,
} from "../utils/helpers.js";
import { getCurrentPrices, getStockPrice } from "./marketData.js";
import { getCash, getHoldings, getPortfolioValueBySymbol, getTotalValue } from "./portfolio.js";

export function renderInitialStocks(stocks) {
  const marketDiv = document.getElementById("market-section");

  const table = document.createElement("table");
  table.id = "stocks-table";

  table.innerHTML = `
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Name</th>
        <th>Price</th>
        <th>Change</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody id="stocks-tbody"></tbody>
  `;

  const tbody = table.querySelector("#stocks-tbody");

  stocks.forEach((stock) => {
    const row = document.createElement("tr");
    row.setAttribute("data-symbol", stock.symbol);
    row.innerHTML = `
      <td data-symbol="${stock.symbol}">${stock.symbol}</td>
      <td>${stock.name}</td>
      <td class="text-center price price-${stock.symbol}">${formatMoney(stock.price)}</td>
      <td class="text-center change-${stock.symbol}">${formatPercentage(calculateChange(stock.price, stock.previousPrice))}</td>
      <td><button class="trade-btn" data-symbol="${stock.symbol}">Comprar/Vender</button></td>
    `;
    tbody.appendChild(row);
  });

  marketDiv.innerHTML = "";
  marketDiv.appendChild(table);
}

export function updateStockPrice(stock) {
  const priceCell = document.querySelector(`.price-${stock.symbol}`);
  const changeCell = document.querySelector(`.change-${stock.symbol}`);
  const totalPortFolioValue = getTotalValue(getCurrentPrices());
  const totalPortfolioValueCell = document.getElementById("portfolio-total-value");
  if (totalPortfolioValueCell) {
    totalPortfolioValueCell.textContent = formatMoney(totalPortFolioValue);
  }
  if (priceCell && changeCell) {
    priceCell.textContent = formatMoney(stock.price);
    const change = calculateChange(stock.price, stock.previousPrice);
    changeCell.textContent = formatPercentage(change);
    changeCell.classList.add(change >= 0 ? 'positive' : 'negative');
    changeCell.classList.remove(change >= 0 ? 'negative' : 'positive');
  }
}

export function renderInitialPortfolio() {
  const portfolioDiv = document.getElementById("portfolio-section");

  const dashboard = document.createElement("div");
  dashboard.id = "portfolio-dashboard";
  dashboard.innerHTML = `
  <h2>Mi Portafolio</h2>
  <p>Cash: <span id="portfolio-cash" class="cash-value">${formatMoney(getCash())}</span></p>
  <p>Valor total: <span id="portfolio-total-value" class="total-value">${formatMoney(getTotalValue(getCurrentPrices()))}</span></p>
  `;

  const holdingsTable = document.createElement("table");
  holdingsTable.id = "holdings-table";
  holdingsTable.innerHTML = `
    <thead>
      <tr>
        <th>Symbol</th>
        <th>Quantity</th>
        <th>Current</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody id="holdings-tbody"></tbody>
  `;
  portfolioDiv.appendChild(dashboard);
  portfolioDiv.appendChild(holdingsTable);
}

export function updatePortfolio() {
  document.getElementById("portfolio-cash").textContent = formatMoney(getCash());

  const holdingsTbody = document.getElementById("holdings-tbody");
  if (!holdingsTbody) return;

  holdingsTbody.innerHTML = "";

  Object.entries(getHoldings()).forEach(([symbol, quantity]) => {
    const row = document.createElement("tr");
    let currentPrice = getStockPrice(symbol);
    let totalValue = getPortfolioValueBySymbol(symbol, currentPrice);
    console.log(totalValue);

    row.innerHTML = `
      <td>${symbol}</td>
      <td class="text-center">${quantity}</td>
      <td class="text-center">${formatMoney(currentPrice)}</td>
      <td class="text-center">${formatMoney(totalValue)}</td>
    `;
    holdingsTbody.appendChild(row);
  });
}
