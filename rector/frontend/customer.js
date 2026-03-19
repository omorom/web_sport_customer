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
                    console.error("Session check failed");
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
        var res, data, facSelect_1, yearSelect_1, genSelect_1, err_2;
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
                    if (yearSelect_1 && data.year) {
                        yearSelect_1.innerHTML = '<option value="">ทุกชั้นปี</option>';
                        data.year.forEach(function (y) { return yearSelect_1.add(new Option("\u0E1B\u0E35 ".concat(y), y)); });
                    }
                    genSelect_1 = document.getElementById("genderSelect");
                    if (genSelect_1 && data.gender) {
                        genSelect_1.innerHTML = '<option value="">ทุกเพศ</option>';
                        data.gender.forEach(function (g) { return genSelect_1.add(new Option(g.name, g.id)); });
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
        "facultySelect", "yearSelect", "genderSelect", "startDate", "endDate"
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
    var ids = ["rangeSelect", "bookingTypeSelect", "userTypeSelect", "facultySelect", "yearSelect", "genderSelect", "startDate", "endDate"];
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            if (id === "rangeSelect")
                el.value = "all";
            else
                el.value = "";
        }
    });
    toggleCustomDate();
}
function getFilters() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        range: ((_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value) || "",
        start_date: ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "",
        end_date: ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "",
        booking_type: ((_d = document.getElementById("bookingTypeSelect")) === null || _d === void 0 ? void 0 : _d.value) || "",
        user_type: ((_e = document.getElementById("userTypeSelect")) === null || _e === void 0 ? void 0 : _e.value) || "",
        faculty_id: ((_f = document.getElementById("facultySelect")) === null || _f === void 0 ? void 0 : _f.value) || "",
        year: ((_g = document.getElementById("yearSelect")) === null || _g === void 0 ? void 0 : _g.value) || "",
        gender_id: ((_h = document.getElementById("genderSelect")) === null || _h === void 0 ? void 0 : _h.value) || ""
    };
}
/* ================= LOAD DASHBOARD ================= */
function loadDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var filters, query, res, contentType, text, data, kpi, chartsData, err_3;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    _t.trys.push([0, 5, , 6]);
                    filters = getFilters();
                    query = new URLSearchParams(filters).toString();
                    return [4 /*yield*/, fetch("/sports_rental_system/rector/api/get_executive_overview.php?" + query)];
                case 1:
                    res = _t.sent();
                    contentType = res.headers.get("content-type");
                    if (!(!contentType || !contentType.includes("application/json"))) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.text()];
                case 2:
                    text = _t.sent();
                    console.error("Server returned non-JSON:", text);
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    data = _t.sent();
                    if (!data.success)
                        return [2 /*return*/];
                    kpi = (_a = data.kpi) !== null && _a !== void 0 ? _a : {};
                    updateKpiUI("kpiUsers", kpi.total_users, "");
                    updateKpiUI("kpiPenetration", kpi.student_pct, "%");
                    updateKpiUI("kpiGeneral", kpi.general_pct, "%");
                    updateKpiUI("kpiExternal", kpi.external_pct, "%");
                    chartsData = data.charts;
                    // 1. แนวโน้มการจอง
                    renderChart("trendUsersChart", {
                        type: "line",
                        data: {
                            labels: (_c = (_b = chartsData.trend) === null || _b === void 0 ? void 0 : _b.labels) !== null && _c !== void 0 ? _c : [],
                            datasets: [{
                                    label: "จำนวนผู้เข้าใช้งาน (คน)",
                                    data: (_e = (_d = chartsData.trend) === null || _d === void 0 ? void 0 : _d.data) !== null && _e !== void 0 ? _e : [],
                                    borderColor: "#339af0",
                                    backgroundColor: "rgba(51, 154, 240, 0.1)",
                                    fill: true,
                                    tension: 0.3
                                }]
                        }
                    });
                    // 2. อันดับคณะ
                    renderChart("topFacultyChart", {
                        type: "bar",
                        data: {
                            labels: (_g = (_f = chartsData.top_faculty) === null || _f === void 0 ? void 0 : _f.labels) !== null && _g !== void 0 ? _g : [],
                            datasets: [{
                                    label: "จำนวนนิสิต (คน)",
                                    data: (_j = (_h = chartsData.top_faculty) === null || _h === void 0 ? void 0 : _h.data) !== null && _j !== void 0 ? _j : [],
                                    backgroundColor: "#51cf66"
                                }]
                        },
                        options: {
                            indexAxis: "y",
                            plugins: { legend: { display: false } }
                        }
                    });
                    // 3. สัดส่วนเพศ
                    renderChart("genderChart", {
                        type: "doughnut",
                        data: {
                            labels: (_l = (_k = chartsData.gender) === null || _k === void 0 ? void 0 : _k.labels) !== null && _l !== void 0 ? _l : [],
                            datasets: [{
                                    data: (_o = (_m = chartsData.gender) === null || _m === void 0 ? void 0 : _m.data) !== null && _o !== void 0 ? _o : [],
                                    backgroundColor: ["#4dabf7", "#ff69b4", "#adb5bd"]
                                }]
                        },
                        options: { plugins: { legend: { position: 'bottom' } } }
                    });
                    // 4. สถิติตามชั้นปี
                    renderChart("yearChart", {
                        type: "bar",
                        data: {
                            labels: (_q = (_p = chartsData.year) === null || _p === void 0 ? void 0 : _p.labels) !== null && _q !== void 0 ? _q : [],
                            datasets: [{
                                    label: "จำนวนนิสิต (คน)",
                                    data: (_s = (_r = chartsData.year) === null || _r === void 0 ? void 0 : _r.data) !== null && _s !== void 0 ? _s : [],
                                    backgroundColor: "#ff922b"
                                }]
                        }
                    });
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _t.sent();
                    console.error("Dashboard error:", err_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/* ================= HELPERS ================= */
function updateKpiUI(id, value, unit) {
    var el = document.getElementById(id);
    if (el) {
        var num = Number(value !== null && value !== void 0 ? value : 0);
        var isPercent = ["kpiPenetration", "kpiGeneral", "kpiExternal"].includes(id);
        el.innerText = isPercent
            ? num.toFixed(1) + unit
            : num.toLocaleString() + unit;
    }
}
function renderChart(id, config) {
    var canvas = document.getElementById(id);
    if (!canvas)
        return;
    if (charts[id])
        charts[id].destroy();
    Chart.defaults.font.family = "'Noto Sans Thai', sans-serif";
    var ctx = canvas.getContext("2d");
    if (ctx)
        charts[id] = new Chart(ctx, config);
}
