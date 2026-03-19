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
var charts = {};
var dashboardTimer = null;
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, checkSession()];
            case 1:
                _a.sent();
                return [4 /*yield*/, loadFilterOptions()];
            case 2:
                _a.sent();
                initFilterEvents();
                toggleCustomDate();
                return [4 /*yield*/, loadDashboard()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
/* ================= SESSION CHECK ================= */
function checkSession() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/sports_rental_system/rector/api/check_session.php")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    if (!data.success) {
                        window.location.href = "login.html";
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    window.location.href = "login.html";
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* ================= LOAD FILTER OPTIONS ================= */
function loadFilterOptions() {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, facSelect_1, yearSelect_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/sports_rental_system/rector/api/get_executive_overview.php")];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    facSelect_1 = document.getElementById("facultySelect");
                    if (facSelect_1 && data.faculty) {
                        facSelect_1.innerHTML = '<option value="">ทุกคณะ</option>';
                        data.faculty.forEach(function (f) { return facSelect_1.add(new Option(f.name, f.id)); });
                    }
                    yearSelect_1 = document.getElementById("yearSelect");
                    if (yearSelect_1) {
                        yearSelect_1.innerHTML = '<option value="">ทุกชั้นปี</option>';
                        [1, 2, 3, 4, 5, 6].forEach(function (y) { return yearSelect_1.add(new Option("\u0E1B\u0E35 ".concat(y), y)); });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error("Filter options error:", err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* ================= INIT FILTER EVENTS ================= */
function initFilterEvents() {
    var _a;
    var filterIds = [
        "rangeSelect", "bookingTypeSelect", "userTypeSelect",
        "facultySelect", "yearSelect", "startDate", "endDate"
    ];
    filterIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", function () {
                if (id === "rangeSelect")
                    toggleCustomDate();
                debounceLoad();
            });
        }
    });
    (_a = document.getElementById("resetFilter")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        resetFilters();
        loadDashboard();
    });
}
function debounceLoad() {
    clearTimeout(dashboardTimer);
    dashboardTimer = setTimeout(function () { return loadDashboard(); }, 300);
}
function toggleCustomDate() {
    var rangeEl = document.getElementById("rangeSelect");
    var box = document.getElementById("customDateBox");
    if (rangeEl && box) {
        box.style.display = rangeEl.value === "custom" ? "flex" : "none";
    }
}
function resetFilters() {
    var ids = ["rangeSelect", "bookingTypeSelect", "userTypeSelect", "facultySelect", "yearSelect", "startDate", "endDate"];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.value = (id === "rangeSelect") ? "all" : "";
        }
    });
    toggleCustomDate();
}
function getFilters() {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        range: ((_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value) || "",
        start_date: ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "",
        end_date: ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "",
        booking_type: ((_d = document.getElementById("bookingTypeSelect")) === null || _d === void 0 ? void 0 : _d.value) || "",
        user_type: ((_e = document.getElementById("userTypeSelect")) === null || _e === void 0 ? void 0 : _e.value) || "",
        faculty_id: ((_f = document.getElementById("facultySelect")) === null || _f === void 0 ? void 0 : _f.value) || "",
        year: ((_g = document.getElementById("yearSelect")) === null || _g === void 0 ? void 0 : _g.value) || ""
    };
}
/* ================= LOAD DASHBOARD ================= */
function loadDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var filters, query, res, data, kpi, err_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    filters = getFilters();
                    query = new URLSearchParams(filters).toString();
                    return [4 /*yield*/, fetch("/sports_rental_system/rector/api/overview.php?" + query)];
                case 1:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _b.sent();
                    if (!data.success)
                        return [2 /*return*/];
                    kpi = (_a = data.kpi) !== null && _a !== void 0 ? _a : {};
                    document.getElementById("kpiRevenue").innerText = kpi.revenue || "0";
                    document.getElementById("kpiUsers").innerText = (kpi.users || 0).toLocaleString();
                    document.getElementById("kpiBookings").innerText = (kpi.bookings || 0).toLocaleString();
                    document.getElementById("kpiUtil").innerText = (kpi.util || 0) + "%";
                    // 2. กราฟแนวโน้ม (Booking Trend)
                    renderChart("bookingTrendChart", {
                        type: "line",
                        data: {
                            labels: data.charts.trend.labels,
                            datasets: [{
                                    label: "จำนวนการจอง",
                                    data: data.charts.trend.data,
                                    borderColor: "#ff7a00",
                                    backgroundColor: "rgba(255, 122, 0, 0.1)",
                                    fill: true,
                                    tension: 0.4
                                }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                    // 3. กราฟสัดส่วน Online vs Walk-in
                    renderChart("bookingSourceChart", {
                        type: "doughnut",
                        data: {
                            labels: ["Online", "Walk-in"],
                            datasets: [{
                                    data: [data.charts.source.online, data.charts.source.walkin],
                                    backgroundColor: ["#43a43b", "#3d74c1"]
                                }]
                        },
                        options: {
                            plugins: { legend: { position: 'bottom' } },
                            cutout: '70%',
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });
                    // 4. วาดกราฟแท่ง Peak Time (ใช้ข้อมูลจาก heatmap มารวมกัน)
                    if (data.charts && data.charts.heatmap) {
                        renderPeakBarChart(data.charts.heatmap);
                    }
                    // 5. อัปเดตตัวเลขสรุป Peak Time
                    if (data.peak_summary) {
                        document.getElementById("peakMorning").innerText = data.peak_summary.morning.hour || "--:--";
                        document.getElementById("peakAfternoon").innerText = data.peak_summary.afternoon.hour || "--:--";
                        document.getElementById("peakEvening").innerText = data.peak_summary.evening.hour || "--:--";
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _b.sent();
                    console.error("Dashboard error:", err_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderChart(id, config) {
    var canvas = document.getElementById(id);
    if (!canvas)
        return;
    if (charts[id]) {
        charts[id].destroy();
    }
    var ctx = canvas.getContext("2d");
    charts[id] = new Chart(ctx, config);
}
/* ================= ฟังก์ชันสำหรับกราฟแท่ง Peak Time ================= */
function renderPeakBarChart(heatData) {
    var hours = Array.from({ length: 14 }, function (_, i) { return i + 8; });
    var hourlyTotals = hours.map(function (h) {
        var total = 0;
        for (var d = 1; d <= 7; d++) {
            if (heatData[d] && heatData[d][h]) {
                total += parseInt(heatData[d][h]);
            }
        }
        return total;
    });
    var backgroundColors = hours.map(function (h) {
        if (h <= 12)
            return '#ec5b75';
        if (h <= 17)
            return '#bf2bff';
        return '#ea2323';
    });
    renderChart("peakHourBarChart", {
        type: 'bar',
        data: {
            labels: hours.map(function (h) { return "".concat(h, ":00"); }),
            datasets: [{
                    label: 'จำนวนการจองรวม',
                    data: hourlyTotals,
                    backgroundColor: backgroundColors,
                    borderRadius: 6
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}
