const getChartDataPeriodEvent = (detail) => {
  return new CustomEvent("stockmarket-applyChartPeriod", { detail });
};

function chartPeriodClickHandler(event) {
  const element = event.target;
  if (element) {
    const id = element.dataset.id;
    const event = getChartDataPeriodEvent(id);
    document.dispatchEvent(event);
  }
}
