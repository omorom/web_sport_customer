var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var bookingTrendChart;
var revenueTrendChart;
var channelChart;
var bookingRatioChart;
var branchChart;
/* ============================== */
document.addEventListener("DOMContentLoaded", function () {
    initCharts();
    loadRegions();
    loadProvinces();
    loadBranches();
    bindFilters();
    toggleDateInput();
    loadAll();
});
function toggleDateInput() {
    var _a;
    var range = (_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value;
    var box = document.getElementById("customDateBox");
    if (!box)
        return;
    if (range === "custom") {
        box.style.display = "block";
    }
    else {
        box.style.display = "none";
    }
}
/* ============================== FILTER */
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
            if (id === "rangeSelect") {
                toggleCustomDate();
            }
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
     FILTER LOGIC
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
    loadAll();
}
/* ============================== UTIL */
function safeArray(arr) {
    return Array.isArray(arr) ? arr : [];
}
function getNiceMax(data) {
    var max = Math.max.apply(Math, __spreadArray(__spreadArray([], data, false), [0], false));
    if (max === 0)
        return 5;
    var pow = Math.pow(10, Math.floor(Math.log(max) / Math.LN10));
    return Math.ceil(max / pow) * pow;
}
/* ============================== LOAD */
function loadAll() {
    fetch("/sports_rental_system/executive/api/user_dashboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFilter())
    })
        .then(function (res) { return res.json(); })
        .then(function (result) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (result.error) {
            console.error(result.message);
            return;
        }
        var charts = result.charts || {};
        updateKPI(result.kpi);
        /* donut */
        updateBookingTrend({
            labels: ["ลูกค้าใหม่", "ลูกค้าเดิม"],
            bookings: [
                (_b = (_a = charts.new_vs_returning) === null || _a === void 0 ? void 0 : _a.new) !== null && _b !== void 0 ? _b : 0,
                (_d = (_c = charts.new_vs_returning) === null || _c === void 0 ? void 0 : _c.returning) !== null && _d !== void 0 ? _d : 0
            ]
        });
        updateRevenueTrend({
            labels: (_f = (_e = charts.booking_group) === null || _e === void 0 ? void 0 : _e.labels) !== null && _f !== void 0 ? _f : [],
            revenue: (_h = (_g = charts.booking_group) === null || _g === void 0 ? void 0 : _g.data) !== null && _h !== void 0 ? _h : []
        });
        updateChannel({
            labels: safeArray((_j = charts.revenue_by_type) === null || _j === void 0 ? void 0 : _j.labels),
            data: safeArray((_k = charts.revenue_by_type) === null || _k === void 0 ? void 0 : _k.data)
        });
        updateBookingRatio({
            labels: safeArray((_l = charts.cancel_by_type) === null || _l === void 0 ? void 0 : _l.labels),
            data: safeArray((_m = charts.cancel_by_type) === null || _m === void 0 ? void 0 : _m.data)
        });
        updateBranches({
            labels: safeArray((_o = charts.customers_by_branch) === null || _o === void 0 ? void 0 : _o.labels),
            data: safeArray((_p = charts.customers_by_branch) === null || _p === void 0 ? void 0 : _p.data)
        });
    })
        .catch(function (err) { return console.error(err); });
}
/* ============================== KPI */
function updateKPI(kpi) {
    var _a, _b, _c, _d;
    document.getElementById("kpiBookings").textContent =
        (Number((_a = kpi === null || kpi === void 0 ? void 0 : kpi.total_customers) !== null && _a !== void 0 ? _a : 0)).toLocaleString() + " คน";
    document.getElementById("kpiRevenue").textContent =
        (Number((_b = kpi === null || kpi === void 0 ? void 0 : kpi.repeat_rate) !== null && _b !== void 0 ? _b : 0)).toFixed(2) + " %";
    document.getElementById("kpiAvg").textContent =
        (Number((_c = kpi === null || kpi === void 0 ? void 0 : kpi.avg_booking) !== null && _c !== void 0 ? _c : 0)).toLocaleString() + " ครั้ง/คน";
    document.getElementById("kpiCancel").textContent =
        (Number((_d = kpi === null || kpi === void 0 ? void 0 : kpi.arpu) !== null && _d !== void 0 ? _d : 0)).toLocaleString() + " บาท";
}
/* ============================== CHART UPDATE */
function updateRevenueTrend(data) {
    if (!revenueTrendChart)
        return;
    var standardLabels = [
        "(1–4 ครั้ง)",
        "(5–10 ครั้ง)",
        "(11 ครั้งขึ้นไป)"
    ];
    var map = {};
    // map ค่าที่มีอยู่
    ((data === null || data === void 0 ? void 0 : data.labels) || []).forEach(function (label, i) {
        map[label] = data.revenue[i];
    });
    var finalData = standardLabels.map(function (label) { var _a; return (_a = map[label]) !== null && _a !== void 0 ? _a : 0; });
    var maxY = getNiceMax(finalData);
    revenueTrendChart.options.scales.y.min = 0;
    revenueTrendChart.options.scales.y.max = maxY;
    revenueTrendChart.data.labels = standardLabels;
    revenueTrendChart.data.datasets[0].data = finalData;
    revenueTrendChart.update();
}
function updateChannel(data) {
    var _a;
    if (!channelChart)
        return;
    var labelMap = {
        general: "บุคคลทั่วไป",
        student: "นิสิต/นักศึกษา"
    };
    var labels = ((data === null || data === void 0 ? void 0 : data.labels) || []).map(function (l) { return labelMap[l] || l; });
    var values = ((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.length) ? data.data : [0];
    var colorMap = {
        "บุคคลทั่วไป": "#6366f1", // ม่วง
        "นิสิต/นักศึกษา": "#f59e0b" // ส้ม
    };
    var colors = labels.map(function (l) { return colorMap[l] || "#94a3b8"; });
    var maxY = getNiceMax(values);
    channelChart.options.scales.y.min = 0;
    channelChart.options.scales.y.max = maxY;
    channelChart.data.labels = labels;
    channelChart.data.datasets[0].data = values;
    channelChart.data.datasets[0].backgroundColor = colors;
    channelChart.update();
}
function updateBookingTrend(data) {
    var _a, _b;
    if (!bookingTrendChart)
        return;
    bookingTrendChart.data.labels = (_a = data === null || data === void 0 ? void 0 : data.labels) !== null && _a !== void 0 ? _a : [];
    bookingTrendChart.data.datasets[0].data = (_b = data === null || data === void 0 ? void 0 : data.bookings) !== null && _b !== void 0 ? _b : [];
    bookingTrendChart.update();
}
function updateBookingRatio(data) {
    var _a;
    if (!bookingRatioChart)
        return;
    var values = (_a = data === null || data === void 0 ? void 0 : data.data) !== null && _a !== void 0 ? _a : [];
    if (!values.length)
        values = [1];
    var labelMap = {
        general: "บุคคลทั่วไป",
        student: "นิสิต/นักศึกษา"
    };
    var labels = ((data === null || data === void 0 ? void 0 : data.labels) || []).map(function (l) { return labelMap[l] || l; });
    bookingRatioChart.data.labels = labels;
    bookingRatioChart.data.datasets[0].data = values;
    bookingRatioChart.update();
}
function updateBranches(data) {
    var _a, _b;
    if (!branchChart)
        return;
    var labels = ((_a = data === null || data === void 0 ? void 0 : data.labels) === null || _a === void 0 ? void 0 : _a.length) ? data.labels : ["ไม่มีข้อมูล"];
    var values = ((_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.length) ? data.data : [0];
    var maxY = getNiceMax(values);
    branchChart.options.scales.y.min = 0;
    branchChart.options.scales.y.max = maxY;
    branchChart.data.labels = labels;
    branchChart.data.datasets[0].data = values;
    branchChart.update();
}
/* ==============================
     DROPDOWNS
============================== */
function loadRegions() {
    fetch("/sports_rental_system/executive/api/get_regions.php")
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var data = res.data || [];
        var select = document.getElementById("regionSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        data.forEach(function (r) {
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
        var data = res.data || [];
        var select = document.getElementById("provinceSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        data.forEach(function (p) {
            select.innerHTML += "<option value=\"".concat(p.province_id, "\">").concat(p.name, "</option>");
        });
    });
}
function loadBranches() {
    var _a, _b;
    var regionId = ((_a = document.getElementById("regionSelect")) === null || _a === void 0 ? void 0 : _a.value) || "";
    var provinceId = ((_b = document.getElementById("provinceSelect")) === null || _b === void 0 ? void 0 : _b.value) || "";
    return fetch("/sports_rental_system/executive/api/get_branches.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            region_id: regionId,
            province_id: provinceId
        })
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var data = res.data || [];
        var select = document.getElementById("branchSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        data.forEach(function (b) {
            select.innerHTML += "<option value=\"".concat(b.branch_id, "\">").concat(b.name, "</option>");
        });
    });
}
/* ============================== INIT CHART */
function initCharts() {
    var baseOptions = function (unit) {
        if (unit === void 0) { unit = ""; }
        return ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    backgroundColor: "#111827",
                    titleColor: "#ffffff",
                    bodyColor: "#e5e7eb",
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        title: function (context) {
                            return context[0].label || "";
                        },
                        label: function (context) {
                            var label = context.dataset.label || "";
                            var value = context.raw || 0;
                            return "".concat(label, ": ").concat(value.toLocaleString()).concat(unit ? " " + unit : "");
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
                        callback: function (v) {
                            return v % 1 === 0 ? v.toLocaleString() + (unit ? " " + unit : "") : "";
                        }
                    }
                }
            }
        });
    };
    // 🟢 แนวโน้มลูกค้า
    bookingTrendChart = new Chart(document.getElementById("bookingTrendChart"), {
        type: "doughnut",
        data: {
            labels: ["ลูกค้าใหม่", "ลูกค้าเดิม"],
            datasets: [{
                    data: [],
                    backgroundColor: ["#00ff5e", "#0062ff"]
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    backgroundColor: "#111827",
                    titleColor: "#fff",
                    bodyColor: "#e5e7eb",
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            var data = context.dataset.data;
                            var total = data.reduce(function (a, b) { return a + b; }, 0);
                            var value = context.raw || 0;
                            var percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return "".concat(context.label, "\n\u2192 ").concat(value.toLocaleString(), " \u0E04\u0E19 (").concat(percent, "%)");
                        }
                    }
                }
            }
        }
    });
    // 🔵 จำนวนลูกค้าแบ่งตามระดับ
    revenueTrendChart = new Chart(document.getElementById("revenueTrendChart"), {
        type: "bar",
        data: {
            labels: ["ใช้งานน้อย", "ปานกลาง", "สูง"],
            datasets: [{
                    label: "จำนวนการใช้งาน",
                    data: [],
                    backgroundColor: ["#b0cdff", "#4588fb", "#005bf9"]
                }]
        },
        options: baseOptions("คน")
    });
    // 🟣 รายได้ตามช่องทาง
    channelChart = new Chart(document.getElementById("channelChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "รายได้",
                    data: [],
                    backgroundColor: ["#6366f1", "#f59e0b"]
                }]
        },
        options: baseOptions("บาท")
    });
    // 🟡 สัดส่วนประเภทลูกค้า
    bookingRatioChart = new Chart(document.getElementById("bookingRatioChart"), {
        type: "doughnut",
        data: {
            labels: ["บุคคลทั่วไป", "นิสิต/นักศึกษา"],
            datasets: [{
                    data: [],
                    backgroundColor: ["#6366f1", "#f59e0b"]
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    backgroundColor: "#111827",
                    titleColor: "#fff",
                    bodyColor: "#e5e7eb",
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            var data = context.dataset.data;
                            var total = data.reduce(function (a, b) { return a + b; }, 0);
                            var value = context.raw || 0;
                            var percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return "".concat(context.label, "\n\u2192 ").concat(value.toLocaleString(), " \u0E04\u0E19 (").concat(percent, "%)");
                        }
                    }
                }
            }
        }
    });
    // 🔷 ลูกค้าตามสาขา
    branchChart = new Chart(document.getElementById("topChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "จำนวนลูกค้า",
                    data: [],
                    backgroundColor: "#3b82f6"
                }]
        },
        options: baseOptions("คน")
    });
}
