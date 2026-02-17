var allHistory = [];
document.addEventListener("DOMContentLoaded", function () {
    loadHistory();
    bindFilters();
});
/* ================= LOAD ================= */
function loadHistory() {
    fetch("/sports_rental_system/staff/api/get_booking_history.php", {
        credentials: "include"
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            renderEmpty("ไม่พบข้อมูล");
            return;
        }
        allHistory = res.data || [];
        applyFilters();
    })
        .catch(function () {
        renderEmpty("โหลดข้อมูลไม่สำเร็จ");
    });
}
/* ================= BIND FILTERS ================= */
function bindFilters() {
    var searchEl = document.getElementById("searchInput");
    var startEl = document.getElementById("startDate");
    var endEl = document.getElementById("endDate");
    var typeEl = document.getElementById("typeFilter");
    var resetBtn = document.getElementById("resetFilterBtn");
    if (searchEl) {
        searchEl.addEventListener("input", applyFilters);
    }
    if (startEl) {
        startEl.addEventListener("change", applyFilters);
    }
    if (endEl) {
        endEl.addEventListener("change", applyFilters);
    }
    if (typeEl) {
        typeEl.addEventListener("change", applyFilters);
    }
    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            document.getElementById("searchInput").value = "";
            document.getElementById("startDate").value = "";
            document.getElementById("endDate").value = "";
            document.getElementById("typeFilter").value = "ALL";
            applyFilters();
        });
    }
}
/* ================= APPLY FILTER ================= */
function applyFilters() {
    var _a, _b, _c, _d;
    var search = (((_a = document.getElementById("searchInput")) === null || _a === void 0 ? void 0 : _a.value) || "")
        .toLowerCase();
    var start = ((_b = document.getElementById("startDate")) === null || _b === void 0 ? void 0 : _b.value) || "";
    var end = ((_c = document.getElementById("endDate")) === null || _c === void 0 ? void 0 : _c.value) || "";
    var type = ((_d = document.getElementById("typeFilter")) === null || _d === void 0 ? void 0 : _d.value) || "ALL";
    var list = allHistory.slice();
    /* ========= SEARCH ========= */
    if (search) {
        list = list.filter(function (item) {
            var bookingMatch = item.booking_id.toLowerCase().indexOf(search) !== -1;
            var nameMatch = item.customer_name.toLowerCase().indexOf(search) !== -1;
            return bookingMatch || nameMatch;
        });
    }
    /* ========= TYPE ========= */
    if (type !== "ALL") {
        list = list.filter(function (item) {
            return item.status_type === type;
        });
    }
    /* ========= DATE RANGE ========= */
    if (start) {
        list = list.filter(function (item) {
            return item.finished_at >= start;
        });
    }
    if (end) {
        list = list.filter(function (item) {
            return item.finished_at <= end;
        });
    }
    renderTable(list);
}
/* ================= RENDER TABLE ================= */
function renderTable(list) {
    var tbody = document.getElementById("historyTable");
    if (!tbody)
        return;
    if (list.length === 0) {
        renderEmpty("ไม่มีรายการ");
        return;
    }
    var html = "";
    list.forEach(function (item) {
        var badge = "";
        if (item.status_type === "COMPLETED") {
            badge =
                '<span class="badge complete">คืนอุปกรณ์สำเร็จ</span>';
        }
        else if (item.status_type === "REFUNDED") {
            badge =
                '<span class="badge refunded">คืนเงินสำเร็จ</span>';
        }
        html +=
            "<tr>" +
                "<td>" + item.booking_id + "</td>" +
                "<td>" + item.customer_name + "</td>" +
                "<td>" + item.finished_at + "</td>" +
                "<td>" + item.net_amount + " บาท</td>" +
                "<td>" + badge + "</td>" +
                "</tr>";
    });
    tbody.innerHTML = html;
}
/* ================= EMPTY ================= */
function renderEmpty(text) {
    var tbody = document.getElementById("historyTable");
    if (!tbody)
        return;
    tbody.innerHTML =
        "<tr>" +
            "<td colspan='5' class='empty-row'>" + text + "</td>" +
            "</tr>";
}
