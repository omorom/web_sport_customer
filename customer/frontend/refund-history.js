document.addEventListener("DOMContentLoaded", function () {
    loadRefundHistory();
    var closeBtn = document.getElementById("closeModal");
    closeBtn.addEventListener("click", closeModal);
    var modal = document.getElementById("slipModal");
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });
});
function loadRefundHistory() {
    fetch("/sports_rental_system/customer/api/get_customer_refund_history.php", {
        credentials: "include"
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            renderEmpty("ไม่พบข้อมูล");
            return;
        }
        renderTable(res.data);
    })
        .catch(function () {
        renderEmpty("โหลดข้อมูลไม่สำเร็จ");
    });
}
function renderTable(list) {
    var tbody = document.getElementById("refundTable");
    if (!list || list.length === 0) {
        renderEmpty("ไม่มีประวัติการยกเลิก");
        return;
    }
    var html = "";
    list.forEach(function (item) {
        var statusBadge = item.refund_at
            ? "<span class=\"badge-refunded\">\u0E04\u0E37\u0E19\u0E40\u0E07\u0E34\u0E19\u0E41\u0E25\u0E49\u0E27</span>"
            : "<span class=\"badge-waiting\">\u0E23\u0E2D\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23</span>";
        var slipBtn = "-";
        if (item.slip_path) {
            slipBtn = "\n                <button class=\"view-slip-btn\"\n                    data-slip=\"".concat(item.slip_path, "\">\n                    \u0E14\u0E39\u0E2A\u0E25\u0E34\u0E1B\n                </button>\n            ");
        }
        html += "\n            <tr>\n                <td>".concat(item.booking_id, "</td>\n                <td>").concat(item.cancelled_at, "</td>\n                <td>").concat(item.refund_amount, " \u0E1A\u0E32\u0E17</td>\n                <td>").concat(item.refund_at ? item.refund_at : "-", "</td>\n                <td>").concat(statusBadge, "</td>\n                <td>").concat(slipBtn, "</td>\n            </tr>\n        ");
    });
    tbody.innerHTML = html;
    bindSlipButtons();
}
function bindSlipButtons() {
    document.querySelectorAll(".view-slip-btn")
        .forEach(function (btn) {
        btn.addEventListener("click", function () {
            var path = btn.dataset.slip;
            if (!path)
                return;
            openModal(path);
        });
    });
}
function openModal(imagePath) {
    var modal = document.getElementById("slipModal");
    var img = document.getElementById("modalImage");
    img.src = imagePath;
    modal.classList.remove("hidden");
}
function closeModal() {
    var modal = document.getElementById("slipModal");
    modal.classList.add("hidden");
}
function renderEmpty(text) {
    var tbody = document.getElementById("refundTable");
    tbody.innerHTML = "\n        <tr>\n            <td colspan=\"6\">".concat(text, "</td>\n        </tr>\n    ");
}
