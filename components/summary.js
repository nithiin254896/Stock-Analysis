import { summaryAPI } from "../const.js";

let summaryData = {};
const summaryDataEl = document.getElementById("summaryWrapper");

export function getSummaryData() {
  fetch(summaryAPI)
    .then((res) => res.json())
    .then((res) => {
      const { stocksProfileData } = res;
      const [data] = stocksProfileData;
      summaryData = { ...data };
      renderSummary();
    });
}

export function renderSummary() {
  summaryDataEl.innerText = summaryData[window.selectedStock].summary;
}

export function init() {
  getSummaryData();
}
