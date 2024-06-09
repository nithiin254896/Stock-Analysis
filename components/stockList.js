import { stockListAPI } from "../const.js";
import { renderSelectedStock } from "./selectedStock.js";
import { renderSummary } from "./summary.js";
import { renderChartOnStockSelected } from "./chart.js";

stockListAPI;

let stockListData = {};
const rightContainerElement = document.getElementById("rightContainer");

function stockHandler(data) {
  window.selectedStock = data.key;
  renderSelectedStock({
    stockName: data.key,
    stockValue: data.bookValue,
    profit: data.profit,
  });

  renderChartOnStockSelected();
  renderSummary();
}
// here we need to get the data & render the recceived data so we use below function as follows

function getStockListData() {
  fetch(stockListAPI)
    .then((res) => res.json())
    .then((res) => {
      const { stocksStatsData } = res;
      const [data] = stocksStatsData;
      stockListData = { ...data };

      const [selectedKey] = Object.keys(stockListData);

      renderStockList();

      renderSelectedStock({
        stockName: selectedStock,
        stockValue: stockListData[selectedKey].bookValue,
        profit: stockListData[selectedKey].profit,
      });
    });
}

export function renderStockList() {
  Object.keys(stockListData).forEach((key) => {
    if (typeof stockListData[key] === "string") return;

    const { bookValue, profit } = stockListData[key];

    const stockListDiv = document.createElement("div");
    stockListDiv.classList.add("stock-stat");

    const button = document.createElement("button");
    button.innerText = key;
    button.addEventListener("click", () =>
      stockHandler({ key, bookValue, profit })
    );

    const priceSpan = document.createElement("span");
    priceSpan.innerText = `$${bookValue}`;

    const profitSpan = document.createElement("span");
    profitSpan.innerText = `${profit.toFixed(2)}%`;
    if (profit <= 0) profitSpan.classList.add("loss");
    else profitSpan.classList.add("profit");

    stockListDiv.append(button);
    stockListDiv.append(priceSpan);
    stockListDiv.append(profitSpan);

    rightContainerElement.append(stockListDiv);
  });
}

export function init() {
  getStockListData();
}
