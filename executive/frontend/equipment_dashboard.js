var popularChart;
var usageChart;
var damageChart;
var damageTopChart;
var repairChart;
/* ==============================
   INIT
============================== */
document.addEventListener("DOMContentLoaded", function () {
    initCharts();
    loadRegions();
    loadProvinces();
    loadBranches();
    bindFilters();
    loadAll();
});
/* ==============================
   FILTER EVENTS
============================== */
function bindFilters() {
    var _a;
    var ids = [
        "rangeSelect",
        "regionSelect",
        "provinceSelect",
        "branchSelect",
        "startDate",
        "endDate"
    ];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el)
            return;
        el.addEventListener("change", function () {
            if (id === "rangeSelect")
                toggleCustomDate();
            // 🔥 cascade dropdown
            if (id === "regionSelect") {
                loadProvinces();
                loadBranches();
            }
            if (id === "provinceSelect") {
                loadBranches();
            }
            loadAll();
        });
    });
    (_a = document.getElementById("resetFilter")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", resetFilter);
}
/* ==============================
   FILTER
============================== */
function getFilter() {
    var _a, _b, _c, _d, _e, _f;
    return {
        range: ((_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value) || "",
        start: ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "",
        end: ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "",
        region_id: ((_d = document.getElementById("regionSelect")) === null || _d === void 0 ? void 0 : _d.value) || "",
        province_id: ((_e = document.getElementById("provinceSelect")) === null || _e === void 0 ? void 0 : _e.value) || "",
        branch_id: ((_f = document.getElementById("branchSelect")) === null || _f === void 0 ? void 0 : _f.value) || ""
    };
}
function toggleCustomDate() {
    var range = document.getElementById("rangeSelect").value;
    var box = document.getElementById("customDateBox");
    box.style.display = range === "custom" ? "block" : "none";
}
function resetFilter() {
    document.getElementById("rangeSelect").value = "";
    document.getElementById("regionSelect").value = "";
    document.getElementById("provinceSelect").value = "";
    document.getElementById("branchSelect").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    loadProvinces();
    loadBranches();
    loadAll();
}
/* ==============================
   LOAD DASHBOARD
============================== */
function loadAll() {
    fetch("/sports_rental_system/executive/api/equipment_dashboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFilter())
    })
        .then(function (res) { return res.json(); })
        .then(function (result) {
        updateKPI(result.kpi);
        updatePopular(result.popular);
        updateUsage(result.trend_booking);
        updateDamage(result.damage);
        updateDamageTop(result.damage_top); // 🔥 ใหม่
        updateRepair(result.repair);
    })
        .catch(function (err) { return console.error(err); });
}
/* ==============================
   KPI
============================== */
function updateKPI(kpi) {
    var _a, _b, _c, _d, _e;
    document.getElementById("kpiTotalEq").textContent =
        Number((_a = kpi === null || kpi === void 0 ? void 0 : kpi.total_equipment) !== null && _a !== void 0 ? _a : 0).toLocaleString() + " ชิ้น";
    document.getElementById("kpiUsedEq").textContent =
        Number((_b = kpi === null || kpi === void 0 ? void 0 : kpi.used_equipment) !== null && _b !== void 0 ? _b : 0).toLocaleString() + " ชิ้น";
    document.getElementById("kpiUsageRate").textContent =
        Number((_c = kpi === null || kpi === void 0 ? void 0 : kpi.usage_rate) !== null && _c !== void 0 ? _c : 0).toFixed(2) + " %";
    document.getElementById("kpiDamageRate").textContent =
        Number((_d = kpi === null || kpi === void 0 ? void 0 : kpi.damage_rate) !== null && _d !== void 0 ? _d : 0).toFixed(2) + " %";
    document.getElementById("kpiRepairCost").textContent =
        Number((_e = kpi === null || kpi === void 0 ? void 0 : kpi.repair_cost) !== null && _e !== void 0 ? _e : 0).toLocaleString() + " บาท";
}
/* ==============================
   UPDATE CHARTS
============================== */
function updatePopular(data) {
    popularChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    popularChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    popularChart.update();
}
function updateUsage(data) {
    usageChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    usageChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    usageChart.update();
}
function updateDamage(data) {
    damageChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [0, 0];
    damageChart.update();
}
function updateDamageTop(data) {
    damageTopChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    damageTopChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    damageTopChart.update();
}
function updateRepair(data) {
    repairChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    repairChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    repairChart.update();
}
/* ==============================
   DROPDOWN
============================== */
function loadRegions() {
    fetch("/sports_rental_system/executive/api/get_regions.php")
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var select = document.getElementById("regionSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        (res.data || []).forEach(function (r) {
            select.innerHTML += "<option value=\"".concat(r.region_id, "\">").concat(r.region_name, "</option>");
        });
    });
}
function loadProvinces() {
    var _a;
    var regionId = ((_a = document.getElementById("regionSelect")) === null || _a === void 0 ? void 0 : _a.value) || "";
    fetch("/sports_rental_system/executive/api/get_provinces.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region_id: regionId })
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var select = document.getElementById("provinceSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        (res.data || []).forEach(function (p) {
            select.innerHTML += "<option value=\"".concat(p.province_id, "\">").concat(p.name, "</option>");
        });
    });
}
function loadBranches() {
    var _a, _b;
    var regionId = ((_a = document.getElementById("regionSelect")) === null || _a === void 0 ? void 0 : _a.value) || "";
    var provinceId = ((_b = document.getElementById("provinceSelect")) === null || _b === void 0 ? void 0 : _b.value) || "";
    fetch("/sports_rental_system/executive/api/get_branches.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            region_id: regionId,
            province_id: provinceId
        })
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var select = document.getElementById("branchSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        (res.data || []).forEach(function (b) {
            select.innerHTML += "<option value=\"".concat(b.branch_id, "\">").concat(b.name, "</option>");
        });
    });
}
/* ==============================
   INIT CHART
============================== */
function initCharts() {
    var baseOptions = function (unit) {
        if (unit === void 0) { unit = ""; }
        return ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var value = context.raw || 0;
                            return value.toLocaleString() + (unit ? " " + unit : "");
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 0,
                    ticks: {
                        stepSize: 1,
                        precision: 0,
                        callback: function (v) { return (v % 1 === 0 ? v + (unit ? " " + unit : "") : ""); }
                    }
                }
            }
        });
    };
    // 🔵 จำนวนครั้งใช้งาน
    popularChart = new Chart(document.getElementById("popularChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "จำนวนครั้งที่ใช้งาน",
                    data: [],
                    backgroundColor: "#3b82f6"
                }]
        },
        options: baseOptions("ครั้ง")
    });
    // 🟢 การใช้งาน (line)
    usageChart = new Chart(document.getElementById("usageChart"), {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                    label: "การใช้งาน",
                    data: [],
                    borderColor: "#22c55e",
                    fill: false
                }]
        },
        options: baseOptions("ครั้ง")
    });
    // 🟡 สถานะอุปกรณ์ (doughnut)
    damageChart = new Chart(document.getElementById("damageChart"), {
        type: "doughnut",
        data: {
            labels: ["ปกติ", "เสียหาย"],
            datasets: [{
                    data: [0, 0],
                    backgroundColor: ["#22c55e", "#ef4444"]
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var data = context.dataset.data;
                            var total = data.reduce(function (a, b) { return a + b; }, 0);
                            var value = context.raw || 0;
                            var percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                            return "".concat(context.label, ": ").concat(percent, "% (").concat(value.toLocaleString(), " \u0E04\u0E23\u0E31\u0E49\u0E07)");
                        }
                    }
                }
            }
        }
    });
    // 🔴 เสียหายสูงสุด
    damageTopChart = new Chart(document.getElementById("damageTopChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "จำนวนครั้งที่เสียหาย",
                    data: [],
                    backgroundColor: "#ef4444"
                }]
        },
        options: baseOptions("ครั้ง")
    });
    // 🟠 ซ่อม (ค่าใช้จ่าย)
    repairChart = new Chart(document.getElementById("repairChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "ค่าใช้จ่ายในการซ่อม",
                    data: [],
                    backgroundColor: "#f97316"
                }]
        },
        options: baseOptions("บาท") // 👈 เปลี่ยนหน่วย
    });
}
