import {
    loadStocks,
    startSimulation,
    addListener,
    getStockPrice,
} from "./modules/marketData.js";
import { buy, getCash, getPortfolioValueBySymbol, sell } from "./modules/portfolio.js";
import { renderInitialPortfolio, renderInitialStocks, updatePortfolio, updateStockPrice } from "./modules/uiRenderer.js";
import { formatMoney } from "./utils/helpers.js";

function openModal(symbol) {
    let currentPrice = getStockPrice(symbol);
    document.getElementById("modal").style.display = "block";
    document.getElementById("modal-symbol").textContent = symbol;
    document.getElementById("modal-price").textContent = formatMoney(currentPrice);
    document.getElementById("modal-cash").textContent = formatMoney(getCash());
    document.getElementById("modal-holdings").textContent = formatMoney(getPortfolioValueBySymbol(symbol, currentPrice));

    document.getElementById('modal-buy').onclick = () => {
        const quantity = parseInt(document.getElementById('modal-quantity').value);
        buy(symbol, currentPrice, quantity);
        updatePortfolio();
        closeModal();
    };

    document.getElementById('modal-sell').onclick = () => {
        const quantity = parseInt(document.getElementById('modal-quantity').value);
        sell(symbol, currentPrice, quantity);
        closeModal();
    };

    document.getElementById('modal-close').onclick = closeModal;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    document.getElementById('modal-quantity').value = 1;
    document.getElementById('modal-buy').disabled = false;
    document.getElementById('modal-insufficient-funds').style.display = 'none';
}

async function init() {
    const stocks = await loadStocks();

    renderInitialStocks(stocks);
    renderInitialPortfolio();
    updatePortfolio();
    addListener((data) => {
        data.stocks.forEach((stock) => {
            updateStockPrice(stock);
        });
        updatePortfolio();
    });

    startSimulation();
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("trade-btn")) {
        const symbol = e.target.dataset.symbol;
        openModal(symbol);
    }
});

const quantityInput = document.getElementById('modal-quantity');
if (quantityInput) {
    const modal = document.getElementById('modal');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    quantityInput.addEventListener('input', () => {
        const quantity = parseInt(quantityInput.value);
        const price = parseFloat(document.getElementById('modal-price').textContent.replace(/[^0-9.-]+/g, ""));
        const totalCost = quantity * price;
        const cash = getCash();
        const insufficientFundsMessage = document.getElementById('modal-insufficient-funds');
        const buyButton = document.getElementById('modal-buy');

        if (totalCost > cash) {
            insufficientFundsMessage.style.display = 'block';
            buyButton.disabled = true;
        } else {
            insufficientFundsMessage.style.display = 'none';
            buyButton.disabled = false;
        }
    });
}

init();
