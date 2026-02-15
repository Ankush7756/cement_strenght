const defaultMetrics = [
  { name: "Monthly Revenue", value: 125000, change: "+8.2% vs last month" },
  { name: "Active Clients", value: 348, change: "+12 new this week" },
  { name: "Conversion Rate", value: 6.4, change: "+0.6 pts" },
  { name: "Fulfillment Time", value: 2.1, change: "-0.3 days" },
];

const defaultActivity = [
  { date: "2026-02-12", metric: "Lead Volume", category: "Sales", value: 196 },
  { date: "2026-02-12", metric: "Refund Rate", category: "Finance", value: 1.8 },
  { date: "2026-02-11", metric: "Campaign ROI", category: "Marketing", value: 320 },
  { date: "2026-02-10", metric: "Order Backlog", category: "Operations", value: 27 },
];

const metricsGrid = document.getElementById("metricsGrid");
const metricTemplate = document.getElementById("metricTemplate");
const activityTable = document.getElementById("activityTable");
const entryForm = document.getElementById("entryForm");
const filterInput = document.getElementById("filterInput");
const exportBtn = document.getElementById("exportBtn");

let activity = [...defaultActivity];

function renderMetrics() {
  metricsGrid.innerHTML = "";
  for (const metric of defaultMetrics) {
    const clone = metricTemplate.content.cloneNode(true);
    clone.querySelector(".metric-name").textContent = metric.name;
    clone.querySelector(".metric-value").textContent = Number(metric.value).toLocaleString();
    clone.querySelector(".metric-change").textContent = metric.change;
    metricsGrid.appendChild(clone);
  }
}

function renderActivity(records) {
  activityTable.innerHTML = "";
  for (const row of records) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.date}</td>
      <td>${row.metric}</td>
      <td>${row.category}</td>
      <td>${Number(row.value).toLocaleString()}</td>
    `;
    activityTable.appendChild(tr);
  }
}

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(entryForm);
  const newRecord = {
    date: new Date().toISOString().slice(0, 10),
    metric: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "General"),
    value: Number(formData.get("value") || 0),
  };

  if (!newRecord.metric || Number.isNaN(newRecord.value)) {
    return;
  }

  activity = [newRecord, ...activity];
  renderActivity(activity);
  entryForm.reset();
});

filterInput.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  const filtered = activity.filter((item) => {
    return item.metric.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
  });
  renderActivity(filtered);
});

exportBtn.addEventListener("click", () => {
  const snapshot = {
    exportedAt: new Date().toISOString(),
    metrics: defaultMetrics,
    activity,
  };

  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "business-tracking-snapshot.json";
  anchor.click();
  URL.revokeObjectURL(url);
});

renderMetrics();
renderActivity(activity);
