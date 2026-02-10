console.log("🔥 RECEIVE EQUIPMENT READY 🔥");
/* ===============================
PARAMS
================================ */
var params = new URLSearchParams(window.location.search);
var bookingId = params.get("code");
if (!bookingId) {
    alert("ไม่พบ booking id");
    throw new Error("missing booking id");
}
/* ===============================
DOM
================================ */
var bookingCodeEl = document.getElementById("bookingCode");
var itemsBox = document.getElementById("receiveItems");
var confirmBtn = document.getElementById("confirmReceiveBtn");
var backBtn = document.getElementById("backBtn");
/* ===============================
STATE
================================ */
var receiveRows = [];
/* ===============================
INIT
================================ */
document.addEventListener("DOMContentLoaded", function () {
    bookingCodeEl.textContent = bookingId;
    backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener("click", function () {
        window.location.href = "bookings.html";
    });
    loadBookingItems();
    bindConfirm();
});
/* ===============================
LOAD BOOKING ITEMS
================================ */
function loadBookingItems() {
    fetch("/sports_rental_system/staff/api/get_receive_booking_items.php?booking_id=".concat(bookingId), { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            alert(res.message || "โหลดรายการไม่ได้");
            return;
        }
        prepareRows(res.items || []);
        renderItems();
    })
        .catch(function (err) {
        console.error(err);
        alert("server error");
    });
}
/* ===============================
EXPAND QUANTITY
================================ */
function prepareRows(items) {
    receiveRows = [];
    items.forEach(function (item) {
        var qty = Number(item.quantity || 1);
        for (var i = 0; i < qty; i++) {
            receiveRows.push({
                detail_id: item.detail_id,
                equipment_id: item.equipment_id,
                venue_id: item.venue_id,
                equipment_name: item.equipment_name,
                venue_name: item.venue_name,
                image: item.image || item.venue_image,
                instance_code: ""
            });
        }
    });
    console.log("RECEIVE ROWS =", receiveRows);
}
/* ===============================
RENDER
================================ */
function renderItems() {
    itemsBox.innerHTML = "";
    if (!receiveRows.length) {
        itemsBox.innerHTML = "<p class=\"empty\">\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23</p>";
        return;
    }
    receiveRows.forEach(function (item, index) {
        var row = document.createElement("div");
        row.className = "receive-item";
        var img = item.image || "images/no-image.png";
        row.innerHTML = "\n            <div class=\"item-left\">\n                <img src=\"".concat(img, "\">\n            </div>\n\n            <div class=\"item-info\">\n                <h4>").concat(item.equipment_name || item.venue_name, "</h4>\n                <small>\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C</small>\n            </div>\n\n            <div class=\"item-select\">\n                <select data-index=\"").concat(index, "\">\n                    <option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01 --</option>\n                </select>\n            </div>\n        ");
        var select = row.querySelector("select");
        /* ===== EQUIPMENT ===== */
        if (item.equipment_id) {
            loadEquipmentInstances(item.equipment_id, select, item.instance_code);
        }
        /* ===== VENUE ===== */
        else if (item.venue_id) {
            // 🔥 venue ใช้ตัวเดียว ไม่ต้องเลือก
            select.innerHTML = "";
            var opt = document.createElement("option");
            opt.value = item.venue_id;
            opt.textContent = item.venue_id;
            opt.selected = true;
            select.appendChild(opt);
            select.disabled = true;
            // set เข้า state
            receiveRows[index].instance_code =
                item.venue_id;
        }
        select.addEventListener("change", function () {
            receiveRows[index].instance_code = select.value;
        });
        itemsBox.appendChild(row);
    });
}
/* ===============================
LOAD EQUIPMENT INSTANCES
================================ */
function loadEquipmentInstances(equipmentId, selectEl, selected) {
    fetch("/sports_rental_system/staff/api/get_equipment_instances.php?equipment_id=".concat(equipmentId), { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success)
            return;
        selectEl.innerHTML =
            "<option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01 --</option>";
        res.instances.forEach(function (i) {
            var opt = document.createElement("option");
            opt.value = i.instance_code;
            opt.textContent = i.instance_code;
            if (selected === i.instance_code) {
                opt.selected = true;
            }
            selectEl.appendChild(opt);
        });
    });
}
/* ===============================
LOAD VENUE INSTANCES
================================ */
function loadVenueInstances(venueId, selectEl, selected, rowIndex) {
    fetch("/sports_rental_system/staff/api/get_venue_instances.php?venue_id=".concat(venueId), { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success)
            return;
        selectEl.innerHTML =
            "<option value=\"\">-- \u0E40\u0E25\u0E37\u0E2D\u0E01 --</option>";
        /* ===== auto ถ้ามี 1 instance ===== */
        if (res.venues.length === 1) {
            var v = res.venues[0];
            var opt = document.createElement("option");
            opt.value = v.venue_instance_id;
            opt.textContent = v.venue_code;
            opt.selected = true;
            selectEl.appendChild(opt);
            selectEl.disabled = true;
            // 🔥 set ค่าเข้า state
            receiveRows[rowIndex].instance_code =
                v.venue_instance_id;
            return;
        }
        /* ===== หลาย instance ===== */
        res.venues.forEach(function (v) {
            var opt = document.createElement("option");
            opt.value = v.venue_instance_id;
            opt.textContent = v.venue_code;
            if (selected === v.venue_instance_id) {
                opt.selected = true;
            }
            selectEl.appendChild(opt);
        });
    });
}
/* ===============================
CONFIRM
================================ */
function bindConfirm() {
    confirmBtn.addEventListener("click", function () {
        var missing = false;
        receiveRows.forEach(function (r) {
            if (!r.instance_code)
                missing = true;
        });
        if (missing) {
            alert("กรุณาเลือกหมายเลขอุปกรณ์ให้ครบทุกชิ้น");
            return;
        }
        if (!confirm("ยืนยันการรับอุปกรณ์ และเริ่มการใช้งาน?")) {
            return;
        }
        submitReceive();
    });
}
/* ===============================
SUBMIT
================================ */
function submitReceive() {
    fetch("/sports_rental_system/staff/api/receive_equipment.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            booking_id: bookingId,
            items: receiveRows
        })
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            alert(res.message || "บันทึกไม่ได้");
            return;
        }
        alert("✅ รับอุปกรณ์เรียบร้อย");
        window.location.href = "bookings.html";
    });
}
