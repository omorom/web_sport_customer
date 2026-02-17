document.addEventListener("DOMContentLoaded", function () {
    var tableBody = document.getElementById("equipmentTableBody");
    var searchInput = document.getElementById("searchInput");
    var statusFilter = document.getElementById("statusFilter");
    var categoryFilter = document.getElementById("categoryFilter");
    var resetBtn = document.getElementById("resetFilters");
    var selectedBranchId = null;
    var searchKeyword = "";
    var selectedStatus = "";
    var selectedCategory = "";
    // ===============================
    // โหลดสาขาที่เลือก (เหมือนหน้าเช่า)
    // ===============================
    fetch("/sports_rental_system/staff/api/get_selected_branch.php")
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var _a;
        if (!res || res.success === false) {
            window.location.href = "branches.html";
            return;
        }
        var data = (_a = res.data) !== null && _a !== void 0 ? _a : res;
        selectedBranchId = data.branch_id;
        loadEquipment();
    });
    // ===============================
    // โหลดหมวดหมู่
    // ===============================
    fetch("/sports_rental_system/staff/api/get_categories.php")
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
    // ===============================
    // FILTER EVENTS
    // ===============================
    searchInput.addEventListener("input", function () {
        searchKeyword = searchInput.value.trim();
        loadEquipment();
    });
    statusFilter.addEventListener("change", function () {
        selectedStatus = statusFilter.value;
        loadEquipment();
    });
    categoryFilter.addEventListener("change", function () {
        selectedCategory = categoryFilter.value;
        loadEquipment();
    });
    resetBtn.addEventListener("click", function () {
        searchKeyword = "";
        selectedStatus = "";
        selectedCategory = "";
        searchInput.value = "";
        statusFilter.value = "";
        categoryFilter.value = "";
        loadEquipment();
    });
    // ===============================
    // LOAD EQUIPMENT
    // ===============================
    function loadEquipment() {
        if (!selectedBranchId || !tableBody)
            return;
        var params = new URLSearchParams();
        // ⭐ สำคัญ: ส่ง branch_id ไปเหมือนหน้าเช่า
        params.set("branch_id", selectedBranchId);
        if (searchKeyword !== "")
            params.set("q", searchKeyword);
        if (selectedStatus !== "")
            params.set("status", selectedStatus);
        if (selectedCategory !== "")
            params.set("category_id", selectedCategory);
        tableBody.innerHTML =
            "<tr><td colspan=\"6\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</td></tr>";
        fetch("/sports_rental_system/staff/api/get_equipment_list.php?"
            + params.toString())
            .then(function (res) { return res.json(); })
            .then(function (res) {
            tableBody.innerHTML = "";
            if (!res.success || res.data.length === 0) {
                tableBody.innerHTML =
                    "<tr><td colspan=\"6\">\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</td></tr>";
                return;
            }
            res.data.forEach(function (item) {
                var tr = document.createElement("tr");
                tr.innerHTML = "\n                        <td>".concat(item.instance_code, "</td>\n                        <td>").concat(item.name, "</td>\n                        <td>").concat(item.category_name, "</td>\n                        <td>").concat(item.branch_name, "</td>\n                        <td>").concat(renderStatus(item.status), "</td>\n                        <td>").concat(item.price_per_unit, " \u0E1A\u0E32\u0E17</td>\n                    ");
                tableBody.appendChild(tr);
            });
        });
    }
    // ===============================
    // STATUS RENDER
    // ===============================
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
});
