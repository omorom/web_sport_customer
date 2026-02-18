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
var genderChart = null;
var facultyChart = null;
var topUserChart = null;
var yearChart = null;
var branchChart = null;
/* ==============================
   SAFE FETCH
============================== */
function safeFetch(url, options) {
    return __awaiter(this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, options)];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("HTTP error " + res.status);
                    return [2 /*return*/, res.json()];
            }
        });
    });
}
/* ==============================
   INIT
============================== */
document.addEventListener("DOMContentLoaded", function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                initCharts();
                return [4 /*yield*/, Promise.all([
                        loadRegions(),
                        loadProvinces(),
                        loadBranches(),
                        loadFaculties()
                    ])];
            case 1:
                _a.sent();
                bindEvents();
                toggleCustomDate();
                loadDashboard();
                return [2 /*return*/];
        }
    });
}); });
/* ==============================
   BIND EVENTS
============================== */
function bindEvents() {
    var _a;
    var ids = [
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
    ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el)
            return;
        el.addEventListener("change", function () {
            if (id === "rangeSelect")
                toggleCustomDate();
            loadDashboard();
        });
    });
    (_a = document
        .getElementById("resetFilter")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", resetFilter);
}
/* ==============================
   FILTER
============================== */
function getFilter() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return {
        range: ((_a = document.getElementById("rangeSelect")) === null || _a === void 0 ? void 0 : _a.value) || "",
        start: ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "",
        end: ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "",
        region_id: ((_d = document.getElementById("regionSelect")) === null || _d === void 0 ? void 0 : _d.value) || "",
        province_id: ((_e = document.getElementById("provinceSelect")) === null || _e === void 0 ? void 0 : _e.value) || "",
        branch_id: ((_f = document.getElementById("branchSelect")) === null || _f === void 0 ? void 0 : _f.value) || "",
        customer_type: ((_g = document.getElementById("customerTypeSelect")) === null || _g === void 0 ? void 0 : _g.value) || "",
        faculty_id: ((_h = document.getElementById("facultySelect")) === null || _h === void 0 ? void 0 : _h.value) || "",
        study_year: ((_j = document.getElementById("studyYearSelect")) === null || _j === void 0 ? void 0 : _j.value) || ""
    };
}
function toggleCustomDate() {
    var rangeEl = document.getElementById("rangeSelect");
    var box = document.getElementById("customDateBox");
    if (!rangeEl || !box)
        return;
    box.style.display = rangeEl.value === "custom" ? "block" : "none";
}
function resetFilter() {
    var setValue = function (id, value) {
        var el = document.getElementById(id);
        if (el)
            el.value = value;
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
function loadDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, safeFetch("/sports_rental_system/executive/api/user_dashboard.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(getFilter())
                        })];
                case 1:
                    result = _a.sent();
                    updateKPI((result === null || result === void 0 ? void 0 : result.kpi) || {});
                    updateGender((result === null || result === void 0 ? void 0 : result.gender_ratio) || {});
                    updateFaculty((result === null || result === void 0 ? void 0 : result.top_faculty) || {});
                    updateTopUser((result === null || result === void 0 ? void 0 : result.top_users) || {});
                    updateYear((result === null || result === void 0 ? void 0 : result.user_by_year) || {});
                    updateBranch((result === null || result === void 0 ? void 0 : result.user_by_branch) || {});
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error("โหลด user dashboard ไม่สำเร็จ", err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/* ==============================
   KPI (UPDATED)
============================== */
function setText(id, value) {
    var el = document.getElementById(id);
    if (el)
        el.textContent = value;
}
function updateKPI(kpi) {
    var _a, _b, _c, _d;
    setText("totalUsers", String((_a = kpi === null || kpi === void 0 ? void 0 : kpi.total_users) !== null && _a !== void 0 ? _a : 0));
    setText("studentPercent", String((_b = kpi === null || kpi === void 0 ? void 0 : kpi.student_percent) !== null && _b !== void 0 ? _b : 0) + "%");
    setText("externalPercent", String((_c = kpi === null || kpi === void 0 ? void 0 : kpi.external_percent) !== null && _c !== void 0 ? _c : 0) + "%");
    setText("avgBooking", String((_d = kpi === null || kpi === void 0 ? void 0 : kpi.avg_booking) !== null && _d !== void 0 ? _d : 0));
}
/* ==============================
   UPDATE CHARTS
============================== */
function updateGender(data) {
    if (!genderChart)
        return;
    genderChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    genderChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    genderChart.update();
}
function updateFaculty(data) {
    if (!facultyChart)
        return;
    facultyChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    facultyChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    facultyChart.update();
}
function updateTopUser(data) {
    if (!topUserChart)
        return;
    topUserChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    topUserChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    topUserChart.update();
}
function updateYear(data) {
    if (!yearChart)
        return;
    yearChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    yearChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    yearChart.update();
}
function updateBranch(data) {
    if (!branchChart)
        return;
    branchChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    branchChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    branchChart.update();
}
/* ==============================
   INIT CHARTS
============================== */
function initCharts() {
    var genderEl = document.getElementById("genderChart");
    var facultyEl = document.getElementById("facultyChart");
    var topUserEl = document.getElementById("topUserChart");
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
    var yearEl = document.getElementById("yearChart");
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
    var branchEl = document.getElementById("branchChart");
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
                indexAxis: "y" // ทำเป็นแนวนอน อ่านง่ายกว่า
            }
        });
    }
}
/* ==============================
   DROPDOWN
============================== */
function loadDropdown(url, selectId, valueKey, labelKey) {
    return __awaiter(this, void 0, void 0, function () {
        var json, data, select_1, defaultOption, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, safeFetch(url)];
                case 1:
                    json = _a.sent();
                    data = Array.isArray(json) ? json : json === null || json === void 0 ? void 0 : json.data;
                    select_1 = document.getElementById(selectId);
                    if (!select_1)
                        return [2 /*return*/];
                    select_1.innerHTML = "";
                    defaultOption = document.createElement("option");
                    defaultOption.value = "";
                    defaultOption.textContent = "ทั้งหมด";
                    select_1.appendChild(defaultOption);
                    if (!Array.isArray(data))
                        return [2 /*return*/];
                    data.forEach(function (item) {
                        var option = document.createElement("option");
                        option.value = item[valueKey];
                        option.textContent = item[labelKey];
                        select_1.appendChild(option);
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error("Dropdown error:", err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function loadRegions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDropdown("/sports_rental_system/executive/api/get_regions.php", "regionSelect", "region_id", "region_name")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadProvinces() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDropdown("/sports_rental_system/executive/api/get_provinces.php", "provinceSelect", "province_id", "name")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadBranches() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDropdown("/sports_rental_system/executive/api/get_branches.php", "branchSelect", "branch_id", "name")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function loadFaculties() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadDropdown("/sports_rental_system/executive/api/get_faculty.php", "facultySelect", "id", "name")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
