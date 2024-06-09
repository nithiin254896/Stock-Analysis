import { init as stockListInit } from "./components/stockList.js";
import { init as summaryDataInit } from "./components/summary.js";
import { init as stocksDataINint } from "./components/chart.js";


stockListInit();
summaryDataInit();
stocksDataINint();

console.log(window.selectedStock);
