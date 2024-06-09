import { chartAPI } from "../const.js";

const ctx = document.getElementById("stockChart").getContext("2d");

const defaultChartPeriod = "1mo";
let stocksData = {};

function getChartData() {
  fetch(chartAPI)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const [data] = res.stocksData;
      stocksData = data;
      renderChartOnStockSelected();
    });
}

export function renderChartOnStockSelected(id = defaultChartPeriod) {
  const xAxisValues =
    stocksData[window.selectedStock][defaultChartPeriod].timeStamp;
  const yAxisValues =
    stocksData[window.selectedStock][defaultChartPeriod].value;

  renderChart(xAxisValues, yAxisValues);
}

document.addEventListener("stockmarket-applyChartPeriod", function (event) {
  const id = event.detail;
  renderChartOnStockSelected(id);
});

const plugin = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#99ffff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

const verticalLinePlugin = {
  id: "verticalLinePlugin",
  afterDraw: (chart) => {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const activePoint = chart.tooltip._active[0];
      const { ctx } = chart;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.restore();
    }
  },
};

const hoverValue = {
  id: "hoverValue",
  afterDataSetsDraw(chart, args, pluginOptions) {
    const { ctx, data, tooltip } = chart;
    if (tooltip._active && tooltip._active.length) {
      const activePoint = tooltip._active[0];
      const datasetIndex = activePoint.datasetIndex;
      const index = activePoint.dataIndex;
      const dataset = data.datasets[datasetIndex];
      const stockName = window.selectedStock; // Assuming you have the selected stock stored globally
      const stockValue = dataset.data[index];

      const x = activePoint.element.x;
      const y = activePoint.element.y;

      ctx.save();
      ctx.font = "12px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(stockName + ": " + stockValue, x, y - 10);
      ctx.restore();
    }
  },
};

let stockChart;
export function renderChart(xAxisValues, yAxisValues) {
  if (stockChart) {
    stockChart.destroy();
  }
  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xAxisValues,
      datasets: [
        {
          data: yAxisValues,
          borderWidth: 1,
          borderColor: "#39FF15",
        },
      ],
    },
    options: {
      tension: 0.1,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        customCanvasBackgroundColor: {
          color: "#020145",
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
    plugins: [plugin, verticalLinePlugin, hoverValue],
  });
}

export function init() {
  getChartData();
}
