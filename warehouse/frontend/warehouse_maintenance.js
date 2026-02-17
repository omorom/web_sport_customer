document.addEventListener("DOMContentLoaded", function () {
    var tableBody = document.getElementById("warehouseList");
    var branchLabel = document.getElementById("selectedBranch");
    var searchInput = document.getElementById("searchInput");
    var statusFilter = document.getElementById("statusFilter");
    var damageFilter = document.getElementById("damageFilter");
    var resetBtn = document.getElementById("resetFilters");
    if (!tableBody)
        return;
    var allData = [];
    var currentLogId = null;
    var currentInstance = null;
    /* =========================
       MODAL
    ========================= */
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = "\n    <div class=\"modal-content\">\n      <h3>\u0E01\u0E23\u0E2D\u0E01\u0E04\u0E48\u0E32\u0E0B\u0E48\u0E2D\u0E21</h3>\n      <input type=\"number\" id=\"repairAmount\" placeholder=\"\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19 (\u0E1A\u0E32\u0E17)\" min=\"1\">\n      <div class=\"modal-actions\">\n        <button id=\"cancelModal\">\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01</button>\n        <button id=\"confirmRepair\" class=\"btn-done\">\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19</button>\n      </div>\n    </div>\n  ";
    document.body.appendChild(modal);
    var amountInput = modal.querySelector("#repairAmount");
    var cancelBtn = modal.querySelector("#cancelModal");
    var confirmBtn = modal.querySelector("#confirmRepair");
    function openModal(logId, instance) {
        currentLogId = logId;
        currentInstance = instance;
        amountInput.value = "";
        modal.classList.add("active");
    }
    function closeModal() {
        modal.classList.remove("active");
        currentLogId = null;
        currentInstance = null;
    }
    cancelBtn.addEventListener("click", closeModal);
    /* =========================
       SESSION CHECK
    ========================= */
    fetch("/sports_rental_system/warehouse/api/check_session.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        if (!data.success) {
            window.location.href = "login.html";
            return;
        }
        if (branchLabel && data.branch_name) {
            branchLabel.textContent = data.branch_name;
        }
        loadMaintenance();
    })
        .catch(function () {
        alert("ไม่สามารถตรวจสอบ session ได้");
    });
    /* =========================
       LOAD DATA
    ========================= */
    function loadMaintenance() {
        tableBody.innerHTML =
            "<tr><td colspan=\"6\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</td></tr>";
        fetch("/sports_rental_system/warehouse/api/get_all_maintenance.php")
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.success || !res.data) {
                tableBody.innerHTML =
                    "<tr><td colspan=\"6\">\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08</td></tr>";
                return;
            }
            allData = res.data;
            applyFilters();
        })
            .catch(function () {
            tableBody.innerHTML =
                "<tr><td colspan=\"6\">\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14</td></tr>";
        });
    }
    /* =========================
       FILTER LOGIC
    ========================= */
    function applyFilters() {
        var filtered = allData.slice();
        var keyword = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";
        var statusValue = statusFilter
            ? statusFilter.value
            : "";
        var damageValue = damageFilter
            ? damageFilter.value
            : "";
        if (keyword) {
            filtered = filtered.filter(function (item) {
                return item.instance_code
                    .toLowerCase()
                    .indexOf(keyword) !== -1;
            });
        }
        if (statusValue) {
            filtered = filtered.filter(function (item) {
                return String(item.status_id) === statusValue;
            });
        }
        if (damageValue) {
            filtered = filtered.filter(function (item) {
                return item.damage_name_th === damageValue;
            });
        }
        renderTable(filtered);
    }
    /* =========================
       RENDER TABLE
    ========================= */
    function renderTable(data) {
        tableBody.innerHTML = "";
        if (!data.length) {
            tableBody.innerHTML =
                "<tr><td colspan=\"6\">\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</td></tr>";
            return;
        }
        data.forEach(function (item) {
            var _a, _b;
            var row = document.createElement("tr");
            row.innerHTML = "\n        <td>".concat(item.instance_code, "</td>\n        <td>").concat((_a = item.description) !== null && _a !== void 0 ? _a : "-", "</td>\n        <td>").concat(item.report_date, "</td>\n        <td>").concat(renderDamage(item.damage_name_th), "</td>\n        <td>\n          <span class=\"badge ").concat(item.status_id === 1 ? "waiting" :
                item.status_id === 2 ? "progress" :
                    item.status_id === 3 ? "done" : "", "\">\n            ").concat((_b = item.status_name_th) !== null && _b !== void 0 ? _b : "-", "\n          </span>\n        </td>\n        <td>\n          ").concat(item.status_id === 1
                ? "<button class=\"btn-start\" data-id=\"".concat(item.log_id, "\">\n                  \u0E40\u0E23\u0E34\u0E48\u0E21\u0E0B\u0E48\u0E2D\u0E21\n                 </button>")
                : item.status_id === 2
                    ? "<button class=\"btn-done\"\n                   data-id=\"".concat(item.log_id, "\"\n                   data-instance=\"").concat(item.instance_code, "\">\n                  \u0E0B\u0E48\u0E2D\u0E21\u0E40\u0E2A\u0E23\u0E47\u0E08\n                 </button>")
                    : "-", "\n        </td>\n      ");
            tableBody.appendChild(row);
        });
    }
    function renderDamage(damage) {
        var damageClass = "";
        if (damage === "เล็กน้อย") {
            damageClass = "low";
        }
        else if (damage === "ปานกลาง") {
            damageClass = "medium";
        }
        else if (damage === "รุนแรง") {
            damageClass = "high";
        }
        return "<span class=\"badge ".concat(damageClass, "\">\n            ").concat(damage !== null && damage !== void 0 ? damage : "-", "\n          </span>");
    }
    /* =========================
       FILTER EVENTS
    ========================= */
    searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", applyFilters);
    statusFilter === null || statusFilter === void 0 ? void 0 : statusFilter.addEventListener("change", applyFilters);
    damageFilter === null || damageFilter === void 0 ? void 0 : damageFilter.addEventListener("change", applyFilters);
    resetBtn === null || resetBtn === void 0 ? void 0 : resetBtn.addEventListener("click", function () {
        if (searchInput)
            searchInput.value = "";
        if (statusFilter)
            statusFilter.value = "";
        if (damageFilter)
            damageFilter.value = "";
        applyFilters();
    });
    /* =========================
       CLICK EVENTS
    ========================= */
    tableBody.addEventListener("click", function (e) {
        var target = e.target;
        // เริ่มซ่อม
        if (target.classList.contains("btn-start")) {
            var logId = target.dataset.id;
            if (!logId)
                return;
            fetch("/sports_rental_system/warehouse/api/update_status.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    log_id: logId,
                    status_id: 2
                })
            })
                .then(function (res) { return res.json(); })
                .then(function () { return loadMaintenance(); });
        }
        // ซ่อมเสร็จ
        if (target.classList.contains("btn-done")) {
            var logId = target.dataset.id;
            var instance = target.dataset.instance;
            if (!logId || !instance)
                return;
            openModal(logId, instance);
        }
    });
    /* =========================
      COMPLETE REPAIR
    ========================= */
    confirmBtn.addEventListener("click", function () {
        if (!currentLogId || !currentInstance) {
            alert("ข้อมูลไม่ครบ");
            return;
        }
        var amount = Number(amountInput.value);
        if (!amount || amount <= 0) {
            alert("กรุณากรอกค่าซ่อมให้ถูกต้อง");
            return;
        }
        fetch("/sports_rental_system/warehouse/api/complete_maintenance.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                log_id: currentLogId,
                instance_code: currentInstance,
                repair_cost: amount
            })
        })
            .then(function (res) { return res.json(); })
            .then(function (res) {
            if (!res.success) {
                alert("บันทึกค่าซ่อมไม่สำเร็จ");
                return;
            }
            closeModal();
            loadMaintenance();
        });
    });
});
