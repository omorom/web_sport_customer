console.log("🔥 STAFF RETURN LIST READY 🔥");
var listBox = document.getElementById("returnList");
var tabs = document.querySelectorAll(".status-tab");
var currentStatus = "IN_USE";
/* ================= INIT ================= */
tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        tabs.forEach(function (t) { return t.classList.remove("active"); });
        tab.classList.add("active");
        currentStatus =
            tab.getAttribute("data-status") || "IN_USE";
        loadReturns();
    });
});
loadReturns();
updateTabCountFromAPI();
/* ================= LOAD BOOKINGS ================= */
function loadReturns() {
    listBox.innerHTML =
        "<p class=\"loading\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</p>";
    fetch("/sports_rental_system/staff/api/get_returns.php?status=".concat(currentStatus), { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            listBox.innerHTML =
                "<p class=\"empty\">\u0E42\u0E2B\u0E25\u0E14\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08</p>";
            return;
        }
        renderList(res.data || []);
        updateTabCountFromAPI();
    });
}
/* ================= UPDATE TAB COUNT ================= */
function updateTabCountFromAPI() {
    fetch("/sports_rental_system/staff/api/get_returns.php?status=ALL", { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success)
            return;
        var inUse = 0;
        var overdue = 0;
        var now = new Date();
        (res.data || []).forEach(function (r) {
            var dueDate = new Date(r.due_return_time);
            if (now.getTime() > dueDate.getTime()) {
                overdue++;
            }
            else {
                inUse++;
            }
        });
        var inUseTab = document.querySelector('[data-status="IN_USE"]');
        var overdueTab = document.querySelector('[data-status="OVERDUE"]');
        if (inUseTab)
            inUseTab.textContent =
                "กำลังใช้งาน (" + inUse + ")";
        if (overdueTab)
            overdueTab.textContent =
                "เกินกำหนด (" + overdue + ")";
    });
}
/* ================= RENDER LIST ================= */
function renderList(rows) {
    if (!rows.length) {
        listBox.innerHTML =
            "<p class=\"empty\">\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23</p>";
        return;
    }
    listBox.innerHTML = "";
    var now = new Date();
    rows.forEach(function (r) {
        var _a;
        var dueDate = new Date(r.due_return_time);
        var isOverdue = now.getTime() > dueDate.getTime();
        var statusClass = isOverdue
            ? "status overdue"
            : "status active";
        var statusText = isOverdue
            ? "เกินกำหนด"
            : "กำลังใช้งาน";
        var card = document.createElement("div");
        card.className = "booking-card";
        card.innerHTML = "\n            <div class=\"booking-info\">\n                <span class=\"".concat(statusClass, "\">\n                    ").concat(statusText, "\n                </span>\n\n                <h4>\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07: ").concat(r.booking_id, "</h4>\n                <p>\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32: ").concat(r.customer_name, "</p>\n                <p>\u0E04\u0E23\u0E1A\u0E01\u0E33\u0E2B\u0E19\u0E14: ").concat(r.due_return_time, "</p>\n\n            </div>\n\n            <div class=\"booking-actions\">\n                <button class=\"btn-return\"\n                        data-code=\"").concat(r.booking_id, "\">\n                    \u0E23\u0E31\u0E1A\u0E04\u0E37\u0E19\n                </button>\n            </div>\n        ");
        (_a = card.querySelector(".btn-return")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
            var confirmReturn = confirm("\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E04\u0E37\u0E19\u0E23\u0E2B\u0E31\u0E2A ".concat(r.booking_id, " ?"));
            if (!confirmReturn)
                return;
            window.location.href =
                "return-detail.html?code=".concat(r.booking_id);
        });
        listBox.appendChild(card);
    });
}
