var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var trendChart;
var topChart;
var paymentChart;
var bookingRatioChart;
var profitChart;
var channelChart;
/* ==============================
     INIT
============================== */
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                initCharts();
                return [4 /*yield*/, loadRegions()];
            case 1:
                _a.sent();
                return [4 /*yield*/, loadProvinces()];
            case 2:
                _a.sent();
                return [4 /*yield*/, loadBranches()];
            case 3:
                _a.sent();
                bindFilters();
                loadAll();
                return [2 /*return*/];
        }
    });
}); });
/* ==============================
     BIND EVENTS
============================== */
function bindFilters() {
    var _a;
    var ids = [
        "rangeSelect",
        "regionSelect",
        "provinceSelect",
        "branchSelect",
        "bookingTypeSelect",
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
            loadAll();
        });
    });
    (_a = document
        .getElementById("resetFilter")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", resetFilter);
}
function getFilter() {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        range: ((_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value) || "",
        start: ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "",
        end: ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "",
        region_id: ((_d = document.getElementById("regionSelect")) === null || _d === void 0 ? void 0 : _d.value) || "",
        province_id: ((_e = document.getElementById("provinceSelect")) === null || _e === void 0 ? void 0 : _e.value) || "",
        branch_id: ((_f = document.getElementById("branchSelect")) === null || _f === void 0 ? void 0 : _f.value) || "",
        booking_type_id: ((_g = document.getElementById("bookingTypeSelect")) === null || _g === void 0 ? void 0 : _g.value) || ""
    };
}
function toggleCustomDate() {
    var range = document.getElementById("rangeSelect").value;
    var box = document.getElementById("customDateBox");
    box.style.display = range === "custom" ? "block" : "none";
}
function resetFilter() {
    document.getElementById("rangeSelect").value = "30days";
    document.getElementById("regionSelect").value = "";
    document.getElementById("provinceSelect").value = "";
    document.getElementById("branchSelect").value = "";
    document.getElementById("bookingTypeSelect").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";
    loadAll();
}
/* ==============================
     LOAD DASHBOARD
============================== */
function loadAll() {
    return __awaiter(this, void 0, void 0, function () {
        var res, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/sports_rental_system/executive/api/dashboard_summary.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(getFilter())
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    result = _a.sent();
                    updateKPI(result.kpi);
                    updateTrend(result.trend);
                    updateProfit(result.profit_trend);
                    updatePayment(result.payment_ratio);
                    updateBookingRatio(result.booking_ratio);
                    updateTop5(result.top5);
                    updateChannelDaily(result.channel_daily);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("โหลด Dashboard ไม่สำเร็จ", err_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* ==============================
     KPI
============================== */
function updateKPI(kpi) {
    var _a, _b, _c, _d;
    document.getElementById("kpiBookings").textContent =
        String((_a = kpi === null || kpi === void 0 ? void 0 : kpi.total_bookings) !== null && _a !== void 0 ? _a : 0);
    document.getElementById("kpiRevenue").textContent =
        Number((_b = kpi === null || kpi === void 0 ? void 0 : kpi.total_revenue) !== null && _b !== void 0 ? _b : 0).toLocaleString() + " บาท";
    document.getElementById("kpiExpense").textContent =
        Number((_c = kpi === null || kpi === void 0 ? void 0 : kpi.total_expense) !== null && _c !== void 0 ? _c : 0).toLocaleString() + " บาท";
    document.getElementById("kpiProfit").textContent =
        Number((_d = kpi === null || kpi === void 0 ? void 0 : kpi.net_profit) !== null && _d !== void 0 ? _d : 0).toLocaleString() + " บาท";
}
/* ==============================
     TREND
============================== */
function updateTrend(trend) {
    trendChart.data.labels = (trend === null || trend === void 0 ? void 0 : trend.labels) || [];
    trendChart.data.datasets[0].data = (trend === null || trend === void 0 ? void 0 : trend.bookings) || [];
    trendChart.data.datasets[1].data = (trend === null || trend === void 0 ? void 0 : trend.revenue) || [];
    trendChart.update();
}
/* ==============================
     PROFIT
============================== */
function updateProfit(data) {
    profitChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    profitChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.revenue) || [];
    profitChart.data.datasets[1].data = (data === null || data === void 0 ? void 0 : data.expense) || [];
    profitChart.update();
}
/* ==============================
     PAYMENT PIE
============================== */
function updatePayment(data) {
    paymentChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    paymentChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    paymentChart.update();
}
/* ==============================
     BOOKING RATIO PIE
============================== */
function updateBookingRatio(data) {
    bookingRatioChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    bookingRatioChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    bookingRatioChart.update();
}
/* ==============================
     DROPDOWNS (FIXED)
============================== */
function loadRegions() {
    return __awaiter(this, void 0, void 0, function () {
        var res, json, data, select;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/sports_rental_system/executive/api/get_regions.php")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.sent();
                    data = Array.isArray(json) ? json : json.data;
                    select = document.getElementById("regionSelect");
                    select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
                    if (!data)
                        return [2 /*return*/];
                    data.forEach(function (r) {
                        select.innerHTML += "<option value=\"".concat(r.region_id, "\">").concat(r.region_name, "</option>");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function loadProvinces() {
    return __awaiter(this, void 0, void 0, function () {
        var res, json, data, select;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/sports_rental_system/executive/api/get_provinces.php")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.sent();
                    data = Array.isArray(json) ? json : json.data;
                    select = document.getElementById("provinceSelect");
                    select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
                    if (!data)
                        return [2 /*return*/];
                    data.forEach(function (p) {
                        select.innerHTML += "<option value=\"".concat(p.province_id, "\">").concat(p.name, "</option>");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function loadBranches() {
    return __awaiter(this, void 0, void 0, function () {
        var res, json, data, select;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/sports_rental_system/executive/api/get_branches.php")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _a.sent();
                    data = Array.isArray(json) ? json : json.data;
                    select = document.getElementById("branchSelect");
                    select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
                    if (!data)
                        return [2 /*return*/];
                    data.forEach(function (b) {
                        select.innerHTML += "<option value=\"".concat(b.branch_id, "\">").concat(b.name, "</option>");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function updateTop5(top) {
    var _a;
    var count = ((_a = top === null || top === void 0 ? void 0 : top.counts) === null || _a === void 0 ? void 0 : _a.length) || 0;
    var colors = [];
    for (var i = 0; i < count; i++) {
        var opacity = 1 - (i * 0.05);
        colors.push("rgba(255,122,0,".concat(opacity, ")"));
    }
    topChart.data.labels = (top === null || top === void 0 ? void 0 : top.labels) || [];
    topChart.data.datasets[0].data = (top === null || top === void 0 ? void 0 : top.counts) || [];
    topChart.data.datasets[0].backgroundColor = colors;
    topChart.update();
}
function updateChannelDaily(data) {
    channelChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    channelChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.online) || [];
    channelChart.data.datasets[1].data = (data === null || data === void 0 ? void 0 : data.walkin) || [];
    channelChart.update();
}
/* ==============================
     INIT CHARTS
============================== */
function initCharts() {
    trendChart = new Chart(document.getElementById("trendChart"), {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "จำนวนการจอง",
                    data: [],
                    borderColor: "#ff7a00",
                    yAxisID: "yBookings",
                    tension: 0.3
                },
                {
                    label: "รายได้",
                    data: [],
                    borderColor: "#3b82f6",
                    yAxisID: "yRevenue",
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                yBookings: {
                    type: "linear",
                    position: "left",
                    title: {
                        display: true,
                        text: "จำนวนการจอง"
                    }
                },
                yRevenue: {
                    type: "linear",
                    position: "right",
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: "รายได้ (บาท)"
                    }
                }
            }
        }
    });
    topChart = new Chart(document.getElementById("topChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                { label: "จำนวนครั้งที่ถูกจอง", data: [] }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" }
            }
        }
    });
    paymentChart = new Chart(document.getElementById("paymentChart"), {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{
                    data: [],
                    backgroundColor: [
                        "#22c55e",
                        "#8b5cf6"
                    ],
                    borderWidth: 0
                }]
        },
        options: {
            cutout: "65%",
            plugins: {
                legend: { position: "top" }
            }
        }
    });
    bookingRatioChart = new Chart(document.getElementById("bookingRatioChart"), {
        type: "pie",
        data: {
            labels: [],
            datasets: [{
                    data: [],
                    backgroundColor: [
                        "#ff53d7",
                        "#1ea9ff"
                    ]
                }]
        }
    });
    profitChart = new Chart(document.getElementById("profitChart"), {
        type: "line",
        data: {
            labels: [],
            datasets: [
                { label: "รายได้", data: [], borderColor: "#22c55e" },
                { label: "ค่าใช้จ่าย", data: [], borderColor: "#ef4444" }
            ]
        }
    });
    channelChart = new Chart(document.getElementById("channelChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "ออนไลน์",
                    data: [],
                    backgroundColor: "#1ea9ff"
                },
                {
                    label: "หน้าร้าน",
                    data: [],
                    backgroundColor: "#ff53d7"
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" }
            }
        }
    });
}
