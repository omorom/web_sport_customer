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
var bookingTrendChart;
var revenueTrendChart;
var channelChart;
var bookingRatioChart;
var branchChart;
var overviewChart;
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
/* ==============================
     LOAD DASHBOARD
============================== */
function loadAll() {
    fetch("/sports_rental_system/executive/api/dashboard_summary.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(getFilter())
    })
        .then(function (res) { return res.json(); })
        .then(function (result) {
        updateKPI(result.kpi);
        updateOverview(result.trend_finance);
        updateBookingTrend(result.trend_booking);
        updateRevenueTrend(result.trend_revenue);
        updateChannel(result.channel);
        updateBookingRatio(result.booking_ratio);
        updateBranches(result.branches);
    })
        .catch(function (err) { return console.error("โหลด Dashboard ไม่สำเร็จ", err); });
}
/* ==============================
     KPI
============================== */
function updateKPI(kpi) {
    var _a, _b, _c, _d, _e, _f;
    document.getElementById("kpiBookings").textContent =
        Number((_a = kpi === null || kpi === void 0 ? void 0 : kpi.total_bookings) !== null && _a !== void 0 ? _a : 0).toLocaleString() + " รายการ";
    document.getElementById("kpiRevenue").textContent =
        Number((_b = kpi === null || kpi === void 0 ? void 0 : kpi.total_revenue) !== null && _b !== void 0 ? _b : 0).toLocaleString() + " บาท";
    document.getElementById("kpiAvg").textContent =
        Number((_c = kpi === null || kpi === void 0 ? void 0 : kpi.revenue_per_booking) !== null && _c !== void 0 ? _c : 0)
            .toLocaleString(undefined, { maximumFractionDigits: 2 }) + " บาท/ครั้ง";
    document.getElementById("kpiCancel").textContent =
        Number((_d = kpi === null || kpi === void 0 ? void 0 : kpi.cancellation_rate) !== null && _d !== void 0 ? _d : 0).toFixed(2) + " %";
    document.getElementById("kpiExpense").textContent =
        Number((_e = kpi === null || kpi === void 0 ? void 0 : kpi.total_expense) !== null && _e !== void 0 ? _e : 0).toLocaleString() + " บาท";
    document.getElementById("kpiProfit").textContent =
        Number((_f = kpi === null || kpi === void 0 ? void 0 : kpi.net_profit) !== null && _f !== void 0 ? _f : 0).toLocaleString() + " บาท";
}
/* ==============================
     UPDATE CHARTS
============================== */
function updateBookingTrend(data) {
    bookingTrendChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    bookingTrendChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    bookingTrendChart.update();
}
function updateRevenueTrend(data) {
    revenueTrendChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    revenueTrendChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    revenueTrendChart.update();
}
function updateChannel(data) {
    channelChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    channelChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
    channelChart.update();
}
function updateOverview(data) {
    overviewChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    overviewChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.revenue) || [];
    overviewChart.data.datasets[1].data = (data === null || data === void 0 ? void 0 : data.expense) || [];
    overviewChart.data.datasets[2].data = (data === null || data === void 0 ? void 0 : data.profit) || [];
    overviewChart.update();
}
function updateBookingRatio(data) {
    var labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    var values = (data === null || data === void 0 ? void 0 : data.data) || [];
    var colors = labels.map(function (label) {
        if (label === "สำเร็จ")
            return "#22c55e";
        if (label === "ยกเลิก")
            return "#ef4444";
        return "#9ca3af";
    });
    bookingRatioChart.data.labels = labels;
    bookingRatioChart.data.datasets[0].data = values;
    bookingRatioChart.data.datasets[0].backgroundColor = colors;
    bookingRatioChart.update();
}
function updateBranches(data) {
    branchChart.data.labels = (data === null || data === void 0 ? void 0 : data.labels) || [];
    branchChart.data.datasets[0].data = (data === null || data === void 0 ? void 0 : data.data) || [];
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
        var data = res.data || [];
        var select = document.getElementById("branchSelect");
        select.innerHTML = "<option value=\"\">\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</option>";
        data.forEach(function (b) {
            select.innerHTML += "<option value=\"".concat(b.branch_id, "\">").concat(b.name, "</option>");
        });
    });
}
function initCharts() {
    var baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom"
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        var _a;
                        var label = context.dataset.label || "";
                        var value = (_a = context.raw) !== null && _a !== void 0 ? _a : 0;
                        // 👉 ใส่หน่วยตาม label
                        if (label.includes("รายได้")) {
                            return "".concat(label, ": ").concat(value.toLocaleString(), " \u0E1A\u0E32\u0E17");
                        }
                        return "".concat(label, ": ").concat(value.toLocaleString(), " \u0E04\u0E23\u0E31\u0E49\u0E07");
                    }
                }
            }
        }
    };
    overviewChart = new Chart(document.getElementById("overviewChart"), {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "รายได้",
                    data: [],
                    borderColor: "#22c55e",
                    backgroundColor: "rgba(34,197,94,0.1)",
                    tension: 0.4
                },
                {
                    label: "ค่าใช้จ่าย",
                    data: [],
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    tension: 0.4
                },
                {
                    label: "กำไรสุทธิ",
                    data: [],
                    borderColor: "#8b5cf6",
                    backgroundColor: "rgba(139,92,246,0.1)",
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (v) {
                            var num = Number(v !== null && v !== void 0 ? v : 0);
                            return num.toLocaleString() + " บาท";
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var _a;
                            var value = Number((_a = context.raw) !== null && _a !== void 0 ? _a : 0);
                            return "".concat(context.dataset.label, ": ").concat(value.toLocaleString(), " \u0E1A\u0E32\u0E17");
                        }
                    }
                }
            }
        }
    });
    // 📊 BOOKING TREND
    bookingTrendChart = new Chart(document.getElementById("bookingTrendChart"), {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                    label: "จำนวนการจอง",
                    data: [],
                    borderColor: "#ff7a00",
                    backgroundColor: "rgba(255,122,0,0.15)",
                    fill: true,
                    tension: 0.4
                }]
        },
        options: __assign(__assign({}, baseOptions), { scales: {
                y: {
                    ticks: {
                        callback: function (v) { return v + " ครั้ง"; }
                    }
                }
            } })
    });
    // 📈 REVENUE TREND
    revenueTrendChart = new Chart(document.getElementById("revenueTrendChart"), {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                    label: "รายได้",
                    data: [],
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59,130,246,0.15)",
                    fill: true,
                    tension: 0.4
                }]
        },
        options: __assign(__assign({}, baseOptions), { scales: {
                y: {
                    ticks: {
                        callback: function (v) { return v.toLocaleString() + " บาท"; }
                    }
                }
            } })
    });
    // 📊 CHANNEL
    channelChart = new Chart(document.getElementById("channelChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "รายได้",
                    data: [],
                    backgroundColor: ["#3b82f6", "#22c55e"]
                }]
        },
        options: __assign(__assign({}, baseOptions), { scales: {
                y: {
                    ticks: {
                        callback: function (v) { return v.toLocaleString() + " บาท"; }
                    }
                }
            } })
    });
    // 🥧 STATUS
    bookingRatioChart = new Chart(document.getElementById("bookingRatioChart"), {
        type: "doughnut",
        data: {
            labels: [],
            datasets: [{
                    data: [],
                    backgroundColor: []
                }]
        },
        options: __assign(__assign({}, baseOptions), { cutout: "65%", plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var label = context.label || "";
                            var val = context.raw || 0;
                            return "".concat(label, ": ").concat(val.toLocaleString(), " \u0E04\u0E23\u0E31\u0E49\u0E07");
                        }
                    }
                }
            } })
    });
    // 🏢 ALL BRANCHES (รายได้สุทธิ)
    branchChart = new Chart(document.getElementById("topChart"), {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                    label: "รายได้สุทธิ", // ✅ เปลี่ยน label
                    data: [],
                    backgroundColor: "#ff7a00"
                }]
        },
        options: __assign(__assign({}, baseOptions), { indexAxis: "y", scales: {
                x: {
                    ticks: {
                        callback: function (v) { return v.toLocaleString() + " บาท"; } // ✅ format เงิน
                    }
                }
            }, plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var val = context.raw || 0;
                            return "\u0E23\u0E32\u0E22\u0E44\u0E14\u0E49: ".concat(val.toLocaleString(), " \u0E1A\u0E32\u0E17"); // ✅ tooltip เป็นเงิน
                        }
                    }
                }
            } })
    });
}
