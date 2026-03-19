// ================= TYPES =================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
// ================= CHART STORE =================
var chartStore = {};
// ================= HELPERS =================
function getVal(id) {
    var _a, _b;
    return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
}
function renderChart(id, config) {
    var canvas = document.getElementById(id);
    if (!canvas)
        return;
    if (chartStore[id]) {
        chartStore[id].destroy();
    }
    config.options = __assign(__assign({}, config.options), { animation: { duration: 400 }, responsive: true, maintainAspectRatio: false });
    chartStore[id] = new Chart(canvas, config);
}
// ================= FETCH =================
function loadDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var params, res, data, error_1;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    params = new URLSearchParams({
                        range: getVal("rangeSelect"),
                        start_date: (_b = (_a = document.getElementById("startDate")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "",
                        end_date: (_d = (_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "",
                        booking_type: getVal("bookingTypeSelect"),
                        user_type: getVal("userTypeSelect"),
                        faculty: getVal("facultySelect"),
                        year: getVal("yearSelect"),
                        category: getVal("categorySelect")
                    });
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/sports_rental_system/rector/api/dashboard_equipment.php?".concat(params.toString()))];
                case 2:
                    res = _e.sent();
                    if (!res.ok)
                        throw new Error("Network response was not ok");
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _e.sent();
                    renderKPI(data);
                    renderTopEquipment(data);
                    renderTopVenue(data);
                    renderCategoryFaculty(data);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _e.sent();
                    console.error("Error loading dashboard:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ================= KPI =================
function renderKPI(data) {
    var _a, _b, _c, _d, _e;
    var kpi = (_a = data.kpi) !== null && _a !== void 0 ? _a : {};
    // อุปกรณ์
    var kpiEq = document.getElementById("kpiEquipment");
    if (kpiEq)
        kpiEq.innerText = ((_b = kpi.total_equipment) !== null && _b !== void 0 ? _b : 0).toLocaleString();
    var kpiEqUtil = document.getElementById("kpiEquipmentUtil");
    if (kpiEqUtil)
        kpiEqUtil.innerText = ((_c = kpi.equipment_util_rate) !== null && _c !== void 0 ? _c : 0).toFixed(2) + "%";
    // สนาม
    var kpiVn = document.getElementById("kpiVenue");
    if (kpiVn)
        kpiVn.innerText = ((_d = kpi.total_venue) !== null && _d !== void 0 ? _d : 0).toLocaleString();
    var kpiVnUtil = document.getElementById("kpiVenueUtil");
    if (kpiVnUtil)
        kpiVnUtil.innerText = ((_e = kpi.venue_util_rate) !== null && _e !== void 0 ? _e : 0).toFixed(2) + "%";
}
// ================= TOP EQUIPMENT =================
function renderTopEquipment(data) {
    var _a, _b, _c, _d;
    renderChart("topEquipmentChart", {
        type: "bar",
        data: {
            labels: (_b = (_a = data.top_equipment) === null || _a === void 0 ? void 0 : _a.labels) !== null && _b !== void 0 ? _b : [],
            datasets: [{
                    label: "จำนวนครั้งที่เช่า",
                    data: (_d = (_c = data.top_equipment) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : [],
                    backgroundColor: "#3b82f6",
                    borderWidth: 2,
                    borderRadius: 8,
                }],
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    });
}
// ================= TOP VENUE =================
function renderTopVenue(data) {
    var _a, _b, _c, _d;
    renderChart("topVenueChart", {
        type: "bar",
        data: {
            labels: (_b = (_a = data.top_venue) === null || _a === void 0 ? void 0 : _a.labels) !== null && _b !== void 0 ? _b : [],
            datasets: [{
                    label: "จำนวนครั้งที่เช่า",
                    data: (_d = (_c = data.top_venue) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : [],
                    backgroundColor: "#22c55e",
                    borderWidth: 2,
                    borderRadius: 8,
                }],
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    });
}
// ================= CATEGORY × FACULTY =================
function renderCategoryFaculty(data) {
    var _a, _b;
    var datasets = ((_a = data.category_faculty) === null || _a === void 0 ? void 0 : _a.datasets) || [];
    var labels = ((_b = data.category_faculty) === null || _b === void 0 ? void 0 : _b.labels) || [];
    if (labels.length === 0)
        return;
    var vibrantPalette = [
        '#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ef4444',
        '#06b6d4', '#eab308', '#ec4899', '#14b8a6', '#6366f1',
        '#84cc16', '#f43f5e', '#0ea5e9', '#8b5cf6'
    ];
    var styledDatasets = datasets.map(function (ds, index) { return (__assign(__assign({}, ds), { backgroundColor: vibrantPalette[index % vibrantPalette.length], borderColor: vibrantPalette[index % vibrantPalette.length], borderWidth: 1, barPercentage: 0.5, categoryPercentage: 0.8, borderRadius: 2 })); });
    renderChart("categoryFacultyChart", {
        type: "bar",
        data: {
            labels: labels,
            datasets: styledDatasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { usePointStyle: true, font: { size: 10 } }
                },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: {
                    stacked: false,
                    grid: { display: false },
                    ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { precision: 0 }
                },
            },
        },
    });
}
// ================= EVENTS =================
function initEvents() {
    var _a, _b;
    var filters = [
        "rangeSelect", "bookingTypeSelect", "userTypeSelect",
        "facultySelect", "yearSelect", "categorySelect",
        "startDate", "endDate"
    ];
    filters.forEach(function (id) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("change", loadDashboard);
    });
    // แสดง/ซ่อนวันที่แบบกำหนดเอง
    (_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", function (e) {
        var customDateBox = document.getElementById("customDateBox");
        if (customDateBox) {
            customDateBox.style.display = e.target.value === "custom" ? "flex" : "none";
        }
    });
    // ปุ่ม Reset
    (_b = document.getElementById("resetFilter")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        filters.forEach(function (id) {
            var el = document.getElementById(id);
            if (!el)
                return;
            if (el instanceof HTMLSelectElement) {
                el.value = (id === "rangeSelect") ? "all" : "";
            }
            else if (el instanceof HTMLInputElement) {
                el.value = "";
            }
        });
        var customDateBox = document.getElementById("customDateBox");
        if (customDateBox)
            customDateBox.style.display = "none";
        loadDashboard();
    });
}
// ================= FILTERS DATA =================
function initFilters() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, years, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/sports_rental_system/rector/api/get_filter.php')];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    fillSelect("facultySelect", data.faculties);
                    fillSelect("categorySelect", data.categories);
                    years = [
                        { id: "1", name: "ปีที่ 1" },
                        { id: "2", name: "ปีที่ 2" },
                        { id: "3", name: "ปีที่ 3" },
                        { id: "4", name: "ปีที่ 4" },
                        { id: "5", name: "ปีที่ 5" },
                        { id: "6", name: "ปีที่ 6" }
                    ];
                    fillSelect("yearSelect", years);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error initializing filters:", error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fillSelect(id, items) {
    var select = document.getElementById(id);
    if (!select)
        return;
    select.innerHTML = '<option value="">ทั้งหมด</option>';
    items.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item.id.toString();
        opt.textContent = item.name;
        select.appendChild(opt);
    });
}
// ================= INIT =================
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, initFilters()];
            case 1:
                _a.sent();
                initEvents();
                loadDashboard();
                return [2 /*return*/];
        }
    });
}); });
