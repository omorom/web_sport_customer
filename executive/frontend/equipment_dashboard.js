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
var bestEquipmentChart;
var worstEquipmentChart;
var bestVenueChart;
var worstVenueChart;
var expireChart;
var categoryChart;
/* ==============================
   INIT
============================== */
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                initCharts();
                return [4 /*yield*/, loadDropdowns()];
            case 1:
                _a.sent();
                bindFilters();
                loadDashboard();
                return [2 /*return*/];
        }
    });
}); });
/* ==============================
   LOAD DASHBOARD
============================== */
function loadDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var res, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/sports_rental_system/executive/api/equipment_dashboard.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(getFilter())
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    result = _a.sent();
                    if (result.error) {
                        console.error(result.message);
                        return [2 /*return*/];
                    }
                    updateKPI(result.kpi);
                    updateBar(bestEquipmentChart, result.top_best_equipment);
                    updateBar(worstEquipmentChart, result.top_worst_equipment);
                    updateBar(bestVenueChart, result.top_best_venue);
                    updateBar(worstVenueChart, result.top_worst_venue);
                    updateExpire(result.expiring_soon);
                    updateCategory(result.category_popular);
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
   KPI (4 ตัวเท่านั้น)
============================== */
function updateKPI(kpi) {
    var _a, _b, _c, _d;
    if (!kpi)
        return;
    document.getElementById("kpiEquipment").textContent =
        String((_a = kpi.total_equipment) !== null && _a !== void 0 ? _a : "-");
    document.getElementById("kpiVenue").textContent =
        String((_b = kpi.total_venues) !== null && _b !== void 0 ? _b : "-");
    document.getElementById("kpiEquipRating").textContent =
        (_c = kpi.avg_equipment_rating) !== null && _c !== void 0 ? _c : "-";
    document.getElementById("kpiVenueRating").textContent =
        (_d = kpi.avg_venue_rating) !== null && _d !== void 0 ? _d : "-";
}
/* ==============================
   UPDATE BAR CHART
============================== */
function updateBar(chart, data) {
    if (!chart)
        return;
    if (!data || data.length === 0) {
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();
        return;
    }
    chart.data.labels = data.map(function (d) { return d.name; });
    chart.data.datasets[0].data =
        data.map(function (d) { return parseFloat(d.avg_rating); });
    chart.update();
}
/* ==============================
   UPDATE EXPIRE
============================== */
function updateExpire(data) {
    if (!expireChart)
        return;
    if (!data || data.length === 0) {
        expireChart.data.labels = [];
        expireChart.data.datasets[0].data = [];
        expireChart.update();
        return;
    }
    expireChart.data.labels = data.map(function (d) { return d.name; });
    expireChart.data.datasets[0].data =
        data.map(function (d) { return parseInt(d.total); });
    expireChart.update();
}
/* ==============================
   UPDATE CATEGORY PIE
============================== */
function updateCategory(data) {
    if (!categoryChart)
        return;
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
function initCharts() {
    bestEquipmentChart = createBarChart("bestEquipmentChart", "#22c55e");
    worstEquipmentChart = createBarChart("worstEquipmentChart", "#ef4444");
    bestVenueChart = createBarChart("bestVenueChart", "#3b82f6");
    worstVenueChart = createBarChart("worstVenueChart", "#f97316");
    expireChart = createBarChart("expireChart", "#f59e0b");
    categoryChart = new Chart(document.getElementById("categoryChart"), {
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
    });
}
/* ==============================
   BAR FACTORY
============================== */
function createBarChart(id, color) {
    return new Chart(document.getElementById(id), {
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
    });
}
/* ==============================
   FILTER
============================== */
function getFilter() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        range: ((_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value) || "",
        start: ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "",
        end: ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "",
        region_id: ((_d = document.getElementById("regionSelect")) === null || _d === void 0 ? void 0 : _d.value) || "",
        province_id: ((_e = document.getElementById("provinceSelect")) === null || _e === void 0 ? void 0 : _e.value) || "",
        branch_id: ((_f = document.getElementById("branchSelect")) === null || _f === void 0 ? void 0 : _f.value) || "",
        category_id: ((_g = document.getElementById("categorySelect")) === null || _g === void 0 ? void 0 : _g.value) || "",
        equipment_id: ((_h = document.getElementById("equipmentSelect")) === null || _h === void 0 ? void 0 : _h.value) || ""
    };
}
/* ==============================
   DROPDOWNS
============================== */
function loadDropdowns() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadSelect("regionSelect", "/api/get_regions.php", "region_id", "region_name")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loadSelect("provinceSelect", "/api/get_provinces.php", "province_id", "name")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loadSelect("branchSelect", "/api/get_branches.php", "branch_id", "name")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loadSelect("categorySelect", "/api/get_categories.php", "category_id", "name")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loadSelect("equipmentSelect", "/api/get_equipment_master.php", "equipment_id", "name")];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadSelect(id, url, valueKey, textKey) {
    return __awaiter(this, void 0, void 0, function () {
        var res, json, select;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch("/sports_rental_system/executive" + url)];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    json = _b.sent();
                    select = document.getElementById(id);
                    select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
                    (_a = json.data) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                        select.innerHTML += "<option value=\"".concat(item[valueKey], "\">").concat(item[textKey], "</option>");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
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
        "categorySelect",
        "equipmentSelect",
        "startDate",
        "endDate"
    ];
    ids.forEach(function (id) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("change", function () {
            toggleDate();
            loadDashboard();
        });
    });
    (_a = document.getElementById("resetFilter")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () { return location.reload(); });
}
function toggleDate() {
    var _a;
    var box = document.getElementById("customDateBox");
    if (!box)
        return;
    var range = (_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value;
    box.style.display = range === "custom" ? "block" : "none";
}
