// ใช้ Chart จาก CDN
declare const Chart: any;

let genderChart: any = null;
let facultyChart: any = null;
let topUserChart: any = null;
let yearChart: any = null;
let branchChart: any = null;


/* ==============================
   SAFE FETCH
============================== */

async function safeFetch(url: string, options?: any) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("HTTP error " + res.status);
  return res.json();
}

/* ==============================
   INIT
============================== */

document.addEventListener("DOMContentLoaded", async () => {

  initCharts();

  await Promise.all([
    loadRegions(),
    loadProvinces(),
    loadBranches(),
    loadFaculties()
  ]);

  bindEvents();
  toggleCustomDate();
  loadDashboard();
});

/* ==============================
   BIND EVENTS
============================== */

function bindEvents(): void {

  const ids = [
    "rangeSelect",
    "regionSelect",
    "provinceSelect",
    "branchSelect",
    "customerTypeSelect",
    "facultySelect",
    "studyYearSelect",
    "startDate",
    "endDate"
  ];

  ids.forEach(id => {

    const el = document.getElementById(id) as
      HTMLSelectElement | HTMLInputElement | null;

    if (!el) return;

    el.addEventListener("change", () => {

      if (id === "rangeSelect") toggleCustomDate();

      loadDashboard();
    });
  });

  document
    .getElementById("resetFilter")
    ?.addEventListener("click", resetFilter);
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
    customer_type: (document.getElementById("customerTypeSelect") as HTMLSelectElement)?.value || "",
    faculty_id: (document.getElementById("facultySelect") as HTMLSelectElement)?.value || "",
    study_year: (document.getElementById("studyYearSelect") as HTMLSelectElement)?.value || ""
  };
}

function toggleCustomDate(): void {

  const rangeEl = document.getElementById("rangeSelect") as HTMLSelectElement | null;
  const box = document.getElementById("customDateBox") as HTMLElement | null;

  if (!rangeEl || !box) return;

  box.style.display = rangeEl.value === "custom" ? "block" : "none";
}

function resetFilter(): void {

  const setValue = (id: string, value: string) => {
    const el = document.getElementById(id) as
      HTMLSelectElement | HTMLInputElement | null;
    if (el) el.value = value;
  };

  setValue("rangeSelect", "30days");
  setValue("regionSelect", "");
  setValue("provinceSelect", "");
  setValue("branchSelect", "");
  setValue("customerTypeSelect", "");
  setValue("facultySelect", "");
  setValue("studyYearSelect", "");
  setValue("startDate", "");
  setValue("endDate", "");

  toggleCustomDate();
  loadDashboard();
}

/* ==============================
   LOAD DASHBOARD
============================== */

async function loadDashboard(): Promise<void> {

  try {

    const result = await safeFetch(
      "/sports_rental_system/executive/api/user_dashboard.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFilter())
      }
    );

    updateKPI(result?.kpi || {});
    updateGender(result?.gender_ratio || {});
    updateFaculty(result?.top_faculty || {});
    updateTopUser(result?.top_users || {});
    updateYear(result?.user_by_year || {});
    updateBranch(result?.user_by_branch || {});

  } catch (err) {
    console.error("โหลด user dashboard ไม่สำเร็จ", err);
  }
}

/* ==============================
   KPI (UPDATED)
============================== */

function setText(id: string, value: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function updateKPI(kpi: any): void {

  setText("totalUsers", String(kpi?.total_users ?? 0));

  setText("studentPercent",
    String(kpi?.student_percent ?? 0) + "%");

  setText("externalPercent",
    String(kpi?.external_percent ?? 0) + "%");

  setText("avgBooking",
    String(kpi?.avg_booking ?? 0));
}

/* ==============================
   UPDATE CHARTS
============================== */

function updateGender(data: any): void {
  if (!genderChart) return;

  genderChart.data.labels = data?.labels || [];
  genderChart.data.datasets[0].data = data?.data || [];
  genderChart.update();
}

function updateFaculty(data: any): void {
  if (!facultyChart) return;

  facultyChart.data.labels = data?.labels || [];
  facultyChart.data.datasets[0].data = data?.data || [];
  facultyChart.update();
}

function updateTopUser(data: any): void {
  if (!topUserChart) return;

  topUserChart.data.labels = data?.labels || [];
  topUserChart.data.datasets[0].data = data?.data || [];
  topUserChart.update();
}

function updateYear(data: any): void {
  if (!yearChart) return;

  yearChart.data.labels = data?.labels || [];
  yearChart.data.datasets[0].data = data?.data || [];
  yearChart.update();
}

function updateBranch(data: any): void {
  if (!branchChart) return;

  branchChart.data.labels = data?.labels || [];
  branchChart.data.datasets[0].data = data?.data || [];
  branchChart.update();
}


/* ==============================
   INIT CHARTS
============================== */

function initCharts(): void {

  const genderEl = document.getElementById("genderChart") as HTMLCanvasElement | null;
  const facultyEl = document.getElementById("facultyChart") as HTMLCanvasElement | null;
  const topUserEl = document.getElementById("topUserChart") as HTMLCanvasElement | null;

  if (!genderEl || !facultyEl || !topUserEl) {
    console.error("Chart canvas not found");
    return;
  }

  genderChart = new Chart(genderEl, {
    type: "doughnut",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: ["#3b82f6", "#ec4899", "#10b981"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%"
    }
  });

  facultyChart = new Chart(facultyEl, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "จำนวนผู้ใช้",
        data: [],
        backgroundColor: "#ff7a00"
      }]
    }
  });

  topUserChart = new Chart(topUserEl, {
    type: "bar",
    data: {
      labels: [],
      datasets: [{
        label: "จำนวนครั้งที่จอง",
        data: [],
        backgroundColor: "#6366f1"
      }]
    },
    options: { indexAxis: "y" }
  });

  const yearEl = document.getElementById("yearChart") as HTMLCanvasElement | null;

  if (yearEl) {
    yearChart = new Chart(yearEl, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "จำนวนผู้ใช้",
          data: [],
          backgroundColor: "#22c55e"
        }]
      }
    });
  }

  const branchEl = document.getElementById("branchChart") as HTMLCanvasElement | null;

  if (branchEl) {
    branchChart = new Chart(branchEl, {
      type: "bar",
      data: {
        labels: [],
        datasets: [{
          label: "จำนวนผู้ใช้",
          data: [],
          backgroundColor: "#3b82f6"
        }]
      },
      options: {
        indexAxis: "y"   // ทำเป็นแนวนอน อ่านง่ายกว่า
      }
    });
  }


}

/* ==============================
   DROPDOWN
============================== */

async function loadDropdown(
  url: string,
  selectId: string,
  valueKey: string,
  labelKey: string
) {

  try {

    const json = await safeFetch(url);
    const data = Array.isArray(json) ? json : json?.data;

    const select = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!select) return;

    select.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "ทั้งหมด";
    select.appendChild(defaultOption);

    if (!Array.isArray(data)) return;

    data.forEach((item: any) => {
      const option = document.createElement("option");
      option.value = item[valueKey];
      option.textContent = item[labelKey];
      select.appendChild(option);
    });

  } catch (err) {
    console.error("Dropdown error:", err);
  }
}

async function loadRegions() {
  await loadDropdown(
    "/sports_rental_system/executive/api/get_regions.php",
    "regionSelect",
    "region_id",
    "region_name"
  );
}

async function loadProvinces() {
  await loadDropdown(
    "/sports_rental_system/executive/api/get_provinces.php",
    "provinceSelect",
    "province_id",
    "name"
  );
}

async function loadBranches() {
  await loadDropdown(
    "/sports_rental_system/executive/api/get_branches.php",
    "branchSelect",
    "branch_id",
    "name"
  );
}

async function loadFaculties() {
  await loadDropdown(
    "/sports_rental_system/executive/api/get_faculty.php",
    "facultySelect",
    "id",
    "name"
  );
}
