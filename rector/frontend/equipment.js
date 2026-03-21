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
/* ==============================
   GLOBAL
============================== */
var chartStore = {};
/* ==============================
   INIT
============================== */
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
/* ==============================
   FILTER EVENTS
============================== */
function initEvents() {
    var _a, _b;
    var filters = [
        "rangeSelect",
        "bookingTypeSelect",
        "userTypeSelect",
        "facultySelect",
        "yearSelect",
        "categorySelect",
        "startDate",
        "endDate"
    ];
    // change event
    filters.forEach(function (id) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("change", loadDashboard);
    });
    // toggle custom date
    (_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", function (e) {
        var box = document.getElementById("customDateBox");
        if (!box)
            return;
        box.style.display = e.target.value === "custom"
            ? "block"
            : "none";
    });
    // reset
    (_b = document.getElementById("resetFilter")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", resetFilters);
}
/* ==============================
   FILTER LOGIC
============================== */
function getVal(id) {
    var _a, _b;
    return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "";
}
function getFilters() {
    var _a, _b, _c, _d;
    return {
        range: getVal("rangeSelect"),
        start_date: (_b = (_a = document.getElementById("startDate")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "",
        end_date: (_d = (_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "",
        booking_type: getVal("bookingTypeSelect"),
        user_type: getVal("userTypeSelect"),
        faculty: getVal("facultySelect"),
        year: getVal("yearSelect"),
        category: getVal("categorySelect")
    };
}
function resetFilters() {
    var ids = [
        "rangeSelect",
        "bookingTypeSelect",
        "userTypeSelect",
        "facultySelect",
        "yearSelect",
        "categorySelect",
        "startDate",
        "endDate"
    ];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el instanceof HTMLSelectElement) {
            el.value = (id === "rangeSelect") ? "all" : "";
        }
        if (el instanceof HTMLInputElement) {
            el.value = "";
        }
    });
    var box = document.getElementById("customDateBox");
    if (box)
        box.style.display = "none";
    loadDashboard();
}
/* ==============================
   DROPDOWNS
============================== */
function initFilters() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, years, error_1;
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
                        { id: "1", name: "ปี 1" },
                        { id: "2", name: "ปี 2" },
                        { id: "3", name: "ปี 3" },
                        { id: "4", name: "ปี 4" },
                        { id: "5", name: "ปี 5" },
                        { id: "6", name: "ปี 6" }
                    ];
                    fillSelect("yearSelect", years);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error initializing filters:", error_1);
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
/* ==============================
   LOAD DASHBOARD
============================== */
function loadDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var params, res, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = new URLSearchParams(getFilters());
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("/sports_rental_system/rector/api/dashboard_equipment.php?".concat(params))];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Network response was not ok");
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    updateKPI(data);
                    updateTopEquipment(data);
                    updateTopVenue(data);
                    updateCategoryFaculty(data);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Error loading dashboard:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/* ==============================
   KPI
============================== */
function updateKPI(data) {
    var _a, _b, _c, _d, _e;
    var kpi = (_a = data.kpi) !== null && _a !== void 0 ? _a : {};
    // Equipment
    document.getElementById("kpiEquipment").innerText =
        ((_b = kpi.total_equipment) !== null && _b !== void 0 ? _b : 0).toLocaleString();
    document.getElementById("kpiEquipmentUtil").innerText =
        ((_c = kpi.equipment_util_rate) !== null && _c !== void 0 ? _c : 0).toFixed(2) + "%";
    // Venue
    document.getElementById("kpiVenue").innerText =
        ((_d = kpi.total_venue) !== null && _d !== void 0 ? _d : 0).toLocaleString();
    document.getElementById("kpiVenueUtil").innerText =
        ((_e = kpi.venue_util_rate) !== null && _e !== void 0 ? _e : 0).toFixed(2) + "%";
}
/* ==============================
   UPDATE CHARTS
============================== */
function updateTopEquipment(data) {
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
                }]
        },
        options: barOptions("ครั้ง")
    });
}
function updateTopVenue(data) {
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
                }]
        },
        options: barOptions("ครั้ง")
    });
}
function updateCategoryFaculty(data) {
    var _a, _b;
    var datasets = ((_a = data.category_faculty) === null || _a === void 0 ? void 0 : _a.datasets) || [];
    var labels = ((_b = data.category_faculty) === null || _b === void 0 ? void 0 : _b.labels) || [];
    if (labels.length === 0)
        return;
    var palette = [
        '#f97316', '#3b82f6',
        '#22c55e', '#a855f7',
        '#ef4444', '#06b6d4',
        '#eab308', '#ec4899',
        '#6366f1', '#14b8a6',
        '#f43f5e', '#8b5cf6',
        '#f59e0b', '#64748b'
    ];
    var styled = datasets.map(function (ds, i) { return (__assign(__assign({}, ds), { backgroundColor: palette[i % palette.length], borderWidth: 0, barPercentage: 0.6, categoryPercentage: 0.8 })); });
    renderChart("categoryFacultyChart", {
        type: "bar",
        data: { labels: labels, datasets: styled },
        options: stackedOptions()
    });
}
/* ==============================
   CHART UTIL
============================== */
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
function barOptions(unit) {
    return {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        return " ".concat(ctx.dataset.label, ": ").concat(ctx.raw, " ").concat(unit);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    callback: function (v) { return v + " " + unit; }
                }
            }
        }
    };
}
function stackedOptions() {
    return {
        plugins: {
            legend: { position: "bottom" },
            tooltip: { mode: "index", intersect: false }
        },
        scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (v) { return v + " ชิ้น"; }
                }
            }
        }
    };
}
