document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("equipmentGrid");
    var searchInput = document.getElementById("searchInput");
    var totalCount = document.getElementById("totalCount");
    var readyCount = document.getElementById("readyCount");
    var rentedCount = document.getElementById("rentedCount");
    var repairCount = document.getElementById("repairCount");
    var lostCount = document.getElementById("lostCount");
    var branchLabel = document.getElementById("selectedBranch");
    if (!grid)
        return;
    var allData = [];
    // ==========================
    // ตรวจสอบ Session ก่อน
    // ==========================
    fetch("/sports_rental_system/warehouse/api/check_session.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (!data.success) {
            window.location.href = "login.html";
            return;
        }
        if (branchLabel) {
            branchLabel.textContent = data.branch_name;
        }
        loadInventory(); // โหลดหลังผ่าน session เท่านั้น
    });
    // ==========================
    // โหลดข้อมูล
    // ==========================
    function loadInventory() {
        grid.innerHTML = "<p>\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...</p>";
        fetch("/sports_rental_system/warehouse/api/get_equipment.php")
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.success) {
                grid.innerHTML = "<p>\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E14\u0E49</p>";
                return;
            }
            allData = res.data;
            updateSummary(allData);
            renderData(allData);
        })
            .catch(function () {
            grid.innerHTML = "<p>\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14</p>";
        });
    }
    // ==========================
    // ค้นหา
    // ==========================
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", function () {
        var keyword = searchInput.value.trim();
        renderData(filterData(keyword));
    });
    function filterData(keyword) {
        if (!keyword)
            return allData;
        return allData.filter(function (item) {
            return item.instance_code.toLowerCase().includes(keyword.toLowerCase()) ||
                item.equipment_name.toLowerCase().includes(keyword.toLowerCase());
        });
    }
    // ==========================
    // แสดง Card
    // ==========================
    function renderData(data) {
        grid.innerHTML = "";
        if (data.length === 0) {
            grid.innerHTML = "<p>ไม่พบข้อมูล</p>";
            return;
        }
        var grouped = groupByCategory(data);
        var today = new Date();
        var thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        Object.keys(grouped).forEach(function (category) {
            var items = grouped[category];
            var ready = items.filter(function (i) { return i.status === "Ready"; }).length;
            var rented = items.filter(function (i) { return i.status === "Rented"; }).length;
            var repair = items.filter(function (i) { return i.status === "Damaged"; }).length;
            var lost = items.filter(function (i) { return i.status === "Lost"; }).length;
            var expiringSoonItems = items.filter(function (i) {
                if (!i.expiry_date)
                    return false;
                var expDate = new Date(i.expiry_date);
                return expDate > today && expDate <= thirtyDaysFromNow;
            }).length;
            var equipmentCounts = {};
            items.forEach(function (item) {
                var name = item.equipment_name;
                equipmentCounts[name] = (equipmentCounts[name] || 0) + 1;
            });
            var categoryCard = document.createElement("div");
            categoryCard.className = "category-card";
            categoryCard.innerHTML = "\n            <div class=\"category-header\">\n                <h3>".concat(category, "</h3>\n                <span class=\"category-total\">").concat(items.length, " \u0E0A\u0E34\u0E49\u0E19</span>\n            </div>\n\n            <div class=\"status-summary-grid\">\n                <div class=\"status-item ready\">\n                    <span class=\"status-label\">\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</span>\n                    <span class=\"status-value\">").concat(ready, "</span>\n                </div>\n                <div class=\"status-item rented\">\n                    <span class=\"status-label\">\u0E16\u0E39\u0E01\u0E40\u0E0A\u0E48\u0E32</span>\n                    <span class=\"status-value\">").concat(rented, "</span>\n                </div>\n                <div class=\"status-item repair\">\n                    <span class=\"status-label\">\u0E0A\u0E33\u0E23\u0E38\u0E14</span>\n                    <span class=\"status-value\">").concat(repair, "</span>\n                </div>\n                <div class=\"status-item lost\">\n                    <span class=\"status-label\">\u0E2A\u0E39\u0E0D\u0E2B\u0E32\u0E22</span>\n                    <span class=\"status-value\">").concat(lost, "</span>\n                </div>\n            </div>\n\n\t\t\t<div class=\"info-section\">\n                <p class=\"section-title\">\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21:</p>\n                <div class=\"info-alert-container\">\n                    ").concat(repair > 0
                ? "<div class=\"info-alert\"><i class=\"alert-icon\">!</i> \u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2B\u0E19\u0E31\u0E01: ".concat(repair, " \u0E0A\u0E34\u0E49\u0E19</div>")
                : '', "\n                    ").concat(expiringSoonItems > 0
                ? "<div class=\"info-alert warning\"><i class=\"alert-icon\">!</i> \u0E43\u0E01\u0E25\u0E49\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19: ".concat(expiringSoonItems, " \u0E0A\u0E34\u0E49\u0E19</div>")
                : '', "\n                    ").concat(repair === 0 && expiringSoonItems === 0
                ? '<div class="info-empty">ไม่มีรายการที่ต้องเฝ้าระวัง</div>'
                : '', "\n                </div>\n            </div>\n\n\t\t\t<div class=\"list-section\">\n                <p class=\"section-title\">\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C:</p>\n                <div class=\"equipment-list-minimal\">\n                    ").concat(Object.entries(equipmentCounts).map(function (_a) {
                var name = _a[0], count = _a[1];
                return "\n                        <div class=\"equipment-row-minimal\">\n                            <span class=\"dot\"></span>\n                            <span class=\"name\">".concat(name, " <span class=\"count\">(").concat(count, ")</span></span>\n                        </div>\n                    ");
            }).join(""), "\n                </div>\n            </div>\n        ");
            grid.appendChild(categoryCard);
        });
    }
    // ==========================
    // อัปเดต Summary
    // ==========================
    function updateSummary(data) {
        var total = data.length;
        var ready = data.filter(function (i) { return i.status === "Ready"; }).length;
        var rented = data.filter(function (i) { return i.status === "Rented"; }).length;
        var repair = data.filter(function (i) { return i.status === "Maintenance"; }).length;
        var lost = data.filter(function (i) { return i.status === "Lost"; }).length;
        if (totalCount)
            totalCount.parentElement.innerHTML = "\n        <div><h4>\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14</h4><p>".concat(total, " \u0E0A\u0E34\u0E49\u0E19</p></div>\n        <div class=\"summary-icon orange\">\uD83D\uDCE6</div>");
        if (readyCount)
            readyCount.parentElement.innerHTML = "\n        <div><h4>\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19</h4><p class=\"text-green\">".concat(ready, " \u0E0A\u0E34\u0E49\u0E19</p></div>\n        <div class=\"summary-icon green\">\u2705</div>");
        if (rentedCount)
            rentedCount.parentElement.innerHTML = "\n        <div><h4>\u0E16\u0E39\u0E01\u0E40\u0E0A\u0E48\u0E32</h4><p class=\"text-blue\">".concat(rented, " \u0E0A\u0E34\u0E49\u0E19</p></div>\n        <div class=\"summary-icon blue\">\uD83D\uDC64</div>");
        if (repairCount)
            repairCount.parentElement.innerHTML = "\n        <div><h4>\u0E0A\u0E33\u0E23\u0E38\u0E14</h4><p class=\"text-orange\">".concat(repair, " \u0E0A\u0E34\u0E49\u0E19</p></div>\n        <div class=\"summary-icon yellow\">\u26A0\uFE0F</div>");
        if (lostCount)
            lostCount.parentElement.innerHTML = "\n        <div><h4>\u0E2A\u0E39\u0E0D\u0E2B\u0E32\u0E22</h4><p class=\"text-red\">".concat(lost, " \u0E0A\u0E34\u0E49\u0E19</p></div>\n        <div class=\"summary-icon red\">\u274C</div>");
    }
    function groupByCategory(data) {
        var grouped = {};
        data.forEach(function (item) {
            var category = item.category_name || "ไม่ระบุหมวด";
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(item);
        });
        return grouped;
    }
});
