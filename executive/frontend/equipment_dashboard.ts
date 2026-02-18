declare const Chart: any;

let bestEquipmentChart: any;
let worstEquipmentChart: any;
let bestVenueChart: any;
let worstVenueChart: any;
let expireChart: any;
let categoryChart: any;

/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", async () => {

  initCharts();
  await loadDropdowns();
  bindFilters();
  loadDashboard();

});

/* ==============================
   LOAD DASHBOARD
============================== */

async function loadDashboard(): Promise<void> {

  try {

    const res = await fetch(
      "/sports_rental_system/executive/api/equipment_dashboard.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFilter())
      }
    );

    const result = await res.json();

    if (result.error) {
      console.error(result.message);
      return;
    }

    updateKPI(result.kpi);

    updateBar(bestEquipmentChart, result.top_best_equipment);
    updateBar(worstEquipmentChart, result.top_worst_equipment);
    updateBar(bestVenueChart, result.top_best_venue);
    updateBar(worstVenueChart, result.top_worst_venue);

    updateExpire(result.expiring_soon);
    updateCategory(result.category_popular);

  } catch (err) {
    console.error("โหลด Dashboard ไม่สำเร็จ", err);
  }
}

/* ==============================
   KPI (4 ตัวเท่านั้น)
============================== */

function updateKPI(kpi: any): void {

  if (!kpi) return;

  document.getElementById("kpiEquipment")!.textContent =
    String(kpi.total_equipment ?? "-");

  document.getElementById("kpiVenue")!.textContent =
    String(kpi.total_venues ?? "-");

  document.getElementById("kpiEquipRating")!.textContent =
    kpi.avg_equipment_rating ?? "-";

  document.getElementById("kpiVenueRating")!.textContent =
    kpi.avg_venue_rating ?? "-";
}

/* ==============================
   UPDATE BAR CHART
============================== */

function updateBar(chart: any, data: any[]): void {

  if (!chart) return;

  if (!data || data.length === 0) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();
    return;
  }

  chart.data.labels = data.map(d => d.name);
  chart.data.datasets[0].data =
    data.map(d => parseFloat(d.avg_rating));

  chart.update();
}

/* ==============================
   UPDATE EXPIRE
============================== */

function updateExpire(data: any[]): void {

  if (!expireChart) return;

  if (!data || data.length === 0) {
    expireChart.data.labels = [];
    expireChart.data.datasets[0].data = [];
    expireChart.update();
    return;
  }

  expireChart.data.labels = data.map(d => d.name);
  expireChart.data.datasets[0].data =
    data.map(d => parseInt(d.total));

  expireChart.update();
}

/* ==============================
   UPDATE CATEGORY PIE
============================== */

function updateCategory(data: any): void {

  if (!categoryChart) return;

  if (!data || !data.labels) {
    categoryChart.data.labels = [];
    categoryChart.data.datasets[0].data = [];
    categoryChart.update();
    return;
  }

  categoryChart.data.labels = data.labels;
  categoryChart.data.datasets[0].data = data.data;
  categoryChart.update();
}

/* ==============================
   INIT CHARTS
============================== */

function initCharts(): void {

  bestEquipmentChart = createBarChart("bestEquipmentChart", "#22c55e");
  worstEquipmentChart = createBarChart("worstEquipmentChart", "#ef4444");
  bestVenueChart = createBarChart("bestVenueChart", "#3b82f6");
  worstVenueChart = createBarChart("worstVenueChart", "#f97316");
  expireChart = createBarChart("expireChart", "#f59e0b");

  categoryChart = new Chart(
    document.getElementById("categoryChart"),
    {
      type: "pie",
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [
            "#6366f1",
            "#8b5cf6",
            "#ec4899",
            "#22c55e",
            "#f59e0b"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    }
  );
}

/* ==============================
   BAR FACTORY
============================== */

function createBarChart(id: string, color: string): any {

  return new Chart(
    document.getElementById(id),
    {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "คะแนนเฉลี่ย",
          data: [],
          backgroundColor: color,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 5
          }
        }
      }
    }
  );
}

/* ==============================
   FILTER
============================== */

function getFilter() {

  return {
    range: (document.getElementById("rangeSelect") as HTMLSelectElement)?.value || "",
    start: (document.getElementById("startDate") as HTMLInputElement)?.value || "",
    end: (document.getElementById("endDate") as HTMLInputElement)?.value || "",
    region_id: (document.getElementById("regionSelect") as HTMLSelectElement)?.value || "",
    province_id: (document.getElementById("provinceSelect") as HTMLSelectElement)?.value || "",
    branch_id: (document.getElementById("branchSelect") as HTMLSelectElement)?.value || "",
    category_id: (document.getElementById("categorySelect") as HTMLSelectElement)?.value || "",
    equipment_id: (document.getElementById("equipmentSelect") as HTMLSelectElement)?.value || ""
  };
}

/* ==============================
   DROPDOWNS
============================== */

async function loadDropdowns(): Promise<void> {

  await loadSelect("regionSelect", "/api/get_regions.php", "region_id", "region_name");
  await loadSelect("provinceSelect", "/api/get_provinces.php", "province_id", "name");
  await loadSelect("branchSelect", "/api/get_branches.php", "branch_id", "name");
  await loadSelect("categorySelect", "/api/get_categories.php", "category_id", "name");
  await loadSelect("equipmentSelect", "/api/get_equipment_master.php", "equipment_id", "name");
}

async function loadSelect(
  id: string,
  url: string,
  valueKey: string,
  textKey: string
) {

  const res = await fetch("/sports_rental_system/executive" + url);
  const json = await res.json();

  const select = document.getElementById(id) as HTMLSelectElement;
  select.innerHTML = `<option value="">ทั้งหมด</option>`;

  json.data?.forEach((item: any) => {
    select.innerHTML += `<option value="${item[valueKey]}">${item[textKey]}</option>`;
  });
}

/* ==============================
   FILTER EVENTS
============================== */

function bindFilters(): void {

  const ids = [
    "rangeSelect",
    "regionSelect",
    "provinceSelect",
    "branchSelect",
    "categorySelect",
    "equipmentSelect",
    "startDate",
    "endDate"
  ];

  ids.forEach(id => {
    document.getElementById(id)
      ?.addEventListener("change", () => {
        toggleDate();
        loadDashboard();
      });
  });

  document.getElementById("resetFilter")
    ?.addEventListener("click", () => location.reload());
}

function toggleDate(): void {

  const box = document.getElementById("customDateBox");
  if (!box) return;

  const range = (document.getElementById("rangeSelect") as HTMLSelectElement)?.value;

  box.style.display = range === "custom" ? "block" : "none";
}
