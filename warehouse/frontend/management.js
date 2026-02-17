document.addEventListener("DOMContentLoaded", function () {
    var tableBody = document.getElementById("equipmentTableBody");
    var branchLabel = document.getElementById("selectedBranch");
    var searchInput = document.getElementById("searchInput");
    var statusFilter = document.getElementById("statusFilter");
    var categoryFilter = document.getElementById("categoryFilter");
    var expiryFilter = document.getElementById("expiryFilter");
    var minPriceInput = document.getElementById("minPrice");
    var maxPriceInput = document.getElementById("maxPrice");
    var sortFilter = document.getElementById("sortFilter");
    var resetBtn = document.getElementById("resetFilters");
    var totalCount = document.getElementById("totalCount");
    if (!tableBody)
        return;
    /* =========================
       SESSION CHECK
    ========================= */
    fetch("/sports_rental_system/warehouse/api/check_session.php", {
        credentials: "include"
    })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (!data.success) {
            window.location.href = "login.html";
            return;
        }
        if (branchLabel && data.branch_name) {
            branchLabel.textContent = data.branch_name;
        }
        loadCategories();
        loadEquipment();
    });
    /* =========================
       LOAD CATEGORIES
    ========================= */
    function loadCategories() {
        fetch("/sports_rental_system/warehouse/api/get_categories.php", {
            credentials: "include"
        })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.success)
                return;
            res.data.forEach(function (cat) {
                var opt = document.createElement("option");
                opt.value = cat.category_id;
                opt.textContent = cat.name;
                categoryFilter.appendChild(opt);
            });
        });
    }
    /* =========================
       LOAD EQUIPMENT
    ========================= */
    function loadEquipment() {
        var params = new URLSearchParams();
        if (searchInput.value.trim())
            params.set("q", searchInput.value.trim());
        if (statusFilter.value)
            params.set("status", statusFilter.value);
        if (categoryFilter.value)
            params.set("category_id", categoryFilter.value);
        if (expiryFilter.value)
            params.set("expiry", expiryFilter.value);
        if (minPriceInput.value)
            params.set("min_price", minPriceInput.value);
        if (maxPriceInput.value)
            params.set("max_price", maxPriceInput.value);
        if (sortFilter.value)
            params.set("sort", sortFilter.value);
        tableBody.innerHTML =
            "<tr><td colspan=\"8\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</td></tr>";
        fetch("/sports_rental_system/warehouse/api/get_equipment_list.php?"
            + params.toString(), { credentials: "include" })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            tableBody.innerHTML = "";
            if (!res.success || !res.data || !res.data.length) {
                tableBody.innerHTML =
                    "<tr><td colspan=\"8\">\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</td></tr>";
                totalCount.textContent = "0";
                return;
            }
            totalCount.textContent = res.data.length;
            res.data.forEach(function (item) {
                var state = getExpiryState(item.expiry_date);
                var row = document.createElement("tr");
                row.innerHTML = "\n            <td>".concat(item.instance_code, "</td>\n            <td>").concat(item.name, "</td>\n            <td>").concat(item.category_name, "</td>\n            <td>").concat(renderStatus(item.status), "</td>\n            <td>").concat(item.price_per_unit, " \u0E1A\u0E32\u0E17</td>\n            <td class=\"").concat(state, "\">\n              ").concat(formatDate(item.expiry_date), "\n            </td>\n            <td>\n              ").concat(renderActionButton(item, state), "\n            </td>\n          ");
                tableBody.appendChild(row);
            });
        });
    }
    /* =========================
       EXPIRY STATE
    ========================= */
    function getExpiryState(dateStr) {
        var today = new Date();
        var expiry = new Date(dateStr);
        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);
        var diffDays = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 0)
            return "expired";
        if (diffDays <= 30)
            return "warning";
        return "";
    }
    function renderActionButton(item, state) {
        if (state === "expired" && item.status === "Ready") {
            return "\n        <button class=\"btn-expired\"\n          data-code=\"".concat(item.instance_code, "\">\n          \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38\n        </button>\n      ");
        }
        return "-";
    }
    tableBody.addEventListener("click", function (e) {
        var target = e.target;
        if (target.classList.contains("btn-expired")) {
            var code = target.dataset.code;
            if (!code)
                return;
            if (!confirm("ยืนยันการหมดอายุของอุปกรณ์?"))
                return;
            fetch("/sports_rental_system/warehouse/api/mark_expired.php", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ instance_code: code })
            })
                .then(function (res) { return res.json(); })
                .then(function (res) {
                if (!res.success) {
                    alert("ไม่สามารถอัปเดตได้");
                    return;
                }
                loadEquipment();
            });
        }
    });
    /* =========================
       STATUS RENDER
    ========================= */
    function renderStatus(status) {
        switch (status) {
            case "Ready":
                return "<span class=\"status-badge status-ready\">\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>";
            case "Rented":
                return "<span class=\"status-badge status-inuse\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>";
            case "Maintenance":
                return "<span class=\"status-badge status-maintenance\">\u0E1A\u0E33\u0E23\u0E38\u0E07\u0E23\u0E31\u0E01\u0E29\u0E32</span>";
            case "Lost":
                return "<span class=\"status-badge status-lost\">\u0E2A\u0E39\u0E0D\u0E2B\u0E32\u0E22</span>";
            case "Expired":
                return "<span class=\"status-badge status-expired\">\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38</span>";
            default:
                return status;
        }
    }
    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("th-TH");
    }
    /* =========================
       FILTER EVENTS
    ========================= */
    searchInput.addEventListener("input", loadEquipment);
    statusFilter.addEventListener("change", loadEquipment);
    categoryFilter.addEventListener("change", loadEquipment);
    expiryFilter.addEventListener("change", loadEquipment);
    minPriceInput.addEventListener("input", loadEquipment);
    maxPriceInput.addEventListener("input", loadEquipment);
    sortFilter.addEventListener("change", loadEquipment);
    resetBtn.addEventListener("click", function () {
        searchInput.value = "";
        statusFilter.value = "";
        categoryFilter.value = "";
        expiryFilter.value = "";
        minPriceInput.value = "";
        maxPriceInput.value = "";
        sortFilter.value = "";
        loadEquipment();
    });
});
