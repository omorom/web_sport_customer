console.log("🔥 RETURN DETAIL READY 🔥");
var params = new URLSearchParams(window.location.search);
var code = params.get("code");
/* ================= ELEMENTS ================= */
var loading = document.getElementById("loading");
var detailBox = document.getElementById("detailBox");
var bookingCodeEl = document.getElementById("bookingCode");
var itemList = document.getElementById("itemList");
var penaltySummary = document.getElementById("penaltySummary");
var lateInfo = document.getElementById("lateInfo");
var confirmBtn = document.getElementById("confirmBtn");
var items = [];
var conditions = [];
var lateFee = 0;
if (!code) {
    alert("ไม่พบรหัสการจอง");
    window.location.href = "return.html";
}
/* ================= INIT ================= */
bookingCodeEl.textContent = code;
loadDetails();
/* ================= LOAD DETAILS ================= */
function loadDetails() {
    fetch("/sports_rental_system/staff/api/get_returns_details.php?booking_id=".concat(code), {
        credentials: "include"
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        loading.style.display = "none";
        if (!res.success) {
            alert(res.message || "โหลดข้อมูลไม่สำเร็จ");
            return;
        }
        items = res.items || [];
        conditions = res.conditions || [];
        lateFee = parseFloat(res.late_fee) || 0;
        renderItems();
        calculatePenalty();
        detailBox.classList.remove("hidden");
    })
        .catch(function (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    });
}
/* ================= RENDER ITEMS ================= */
function renderItems() {
    itemList.innerHTML = "";
    items.forEach(function (item, index) {
        var options = "";
        conditions.forEach(function (c) {
            options += "\n                <option value=\"".concat(c.condition_id, "\" \n                        data-percent=\"").concat(c.fine_percent, "\">\n                    ").concat(c.name_th, " (").concat(c.fine_percent, "%)\n                </option>\n            ");
        });
        var row = document.createElement("div");
        row.className = "return-row";
        row.innerHTML = "\n            <div class=\"item-left\">\n                <img src=\"".concat(item.image || '', "\" \n                     class=\"item-img\"\n                     onerror=\"this.src='https://via.placeholder.com/120x120?text=No+Image'\">\n                <div class=\"item-info\">\n                    <strong>").concat(item.name, "</strong><br>\n                    \u0E23\u0E2B\u0E31\u0E2A: ").concat(item.instance_code || "-", "<br>\n                    \u0E23\u0E32\u0E04\u0E32: ").concat(item.price_at_booking, " \u0E1A\u0E32\u0E17\n                </div>\n            </div>\n\n            <div class=\"right-zone\">\n\n                <div class=\"top-controls\">\n                    <select data-index=\"").concat(index, "\">\n                        ").concat(options, "\n                    </select>\n\n                    <i class=\"fa-solid fa-pen-to-square note-icon\"\n                    data-note-toggle=\"").concat(index, "\"></i>\n                </div>\n\n                <textarea\n                    class=\"note-input hidden\"\n                    data-note-index=\"").concat(index, "\"\n                    placeholder=\"\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38...\"\n                ></textarea>\n                <div class=\"damage-amount\" id=\"damage-").concat(index, "\"></div>\n            </div>\n\n                <div class=\"damage-amount\" id=\"damage-").concat(index, "\"></div>\n\n            </div>\n        ");
        itemList.appendChild(row);
    });
    /* bind change event */
    var selects = itemList.querySelectorAll("select");
    selects.forEach(function (sel) {
        sel.addEventListener("change", calculatePenalty);
    });
    /* bind note toggle */
    bindNoteToggle();
}
/* ================= NOTE TOGGLE ================= */
function bindNoteToggle() {
    var icons = itemList.querySelectorAll(".note-icon");
    icons.forEach(function (icon) {
        icon.addEventListener("click", function () {
            var index = this.dataset.noteToggle;
            var textarea = itemList.querySelector("[data-note-index=\"".concat(index, "\"]"));
            if (!textarea)
                return;
            textarea.classList.toggle("hidden");
            if (!textarea.classList.contains("hidden")) {
                textarea.focus();
            }
        });
    });
}
/* ================= CALCULATE ================= */
function calculatePenalty() {
    var damageFee = 0;
    var selects = itemList.querySelectorAll("select");
    selects.forEach(function (sel, index) {
        var percent = parseFloat(sel.options[sel.selectedIndex].dataset.percent) || 0;
        var price = parseFloat(items[index].price_at_booking) || 0;
        var itemDamage = (price * percent) / 100;
        damageFee += itemDamage;
        var damageEl = document.getElementById("damage-".concat(index));
        if (damageEl) {
            damageEl.innerHTML =
                itemDamage > 0
                    ? "\u0E40\u0E2A\u0E35\u0E22\u0E2B\u0E32\u0E22 ".concat(itemDamage.toFixed(2), " \u0E1A\u0E32\u0E17")
                    : "";
        }
    });
    var total = damageFee + lateFee;
    lateInfo.innerHTML =
        lateFee > 0
            ? "<p style=\"color:#dc2626;font-weight:600\">\n                \u0E04\u0E48\u0E32\u0E04\u0E37\u0E19\u0E0A\u0E49\u0E32: ".concat(lateFee.toFixed(2), " \u0E1A\u0E32\u0E17\n               </p>")
            : "";
    penaltySummary.innerHTML = "\n        <p>\u0E04\u0E48\u0E32\u0E40\u0E2A\u0E35\u0E22\u0E2B\u0E32\u0E22\u0E23\u0E27\u0E21: ".concat(damageFee.toFixed(2), " \u0E1A\u0E32\u0E17</p>\n        <hr>\n        <strong>\u0E23\u0E27\u0E21\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14: ").concat(total.toFixed(2), " \u0E1A\u0E32\u0E17</strong>\n    ");
    return total;
}
/* ================= CONFIRM ================= */
confirmBtn.addEventListener("click", function () {
    var totalPenalty = calculatePenalty();
    var selects = itemList.querySelectorAll("select");
    var notes = itemList.querySelectorAll(".note-input");
    var returnData = [];
    selects.forEach(function (sel, index) {
        var _a;
        var noteValue = ((_a = notes[index]) === null || _a === void 0 ? void 0 : _a.value) || null;
        returnData.push({
            detail_id: items[index].detail_id,
            condition_id: parseInt(sel.value),
            note: noteValue
        });
    });
    confirmBtn.disabled = true;
    confirmBtn.textContent = "กำลังบันทึก...";
    fetch("/sports_rental_system/staff/api/confirm_return.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            booking_code: code,
            items: returnData
        })
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = "บันทึกการคืน";
        if (!res.success) {
            alert(res.message || "เกิดข้อผิดพลาด");
            return;
        }
        if (res.auto_completed) {
            alert("คืนสำเร็จ ไม่มีค่าปรับ");
            window.location.href = "return.html";
            return;
        }
        if (res.total_penalty > 0) {
            window.location.href =
                "return-payment.html?code=".concat(code, "&penalty=").concat(res.total_penalty);
        }
    })
        .catch(function (err) {
        console.error(err);
        confirmBtn.disabled = false;
        confirmBtn.textContent = "บันทึกการคืน";
        alert("เกิดข้อผิดพลาด");
    });
});
