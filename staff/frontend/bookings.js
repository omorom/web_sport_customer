console.log("🔥 STAFF BOOKINGS TS READY 🔥");
/* ================= DOM ================= */
var bookingList = document.getElementById("bookingList");
var tabs = document.querySelectorAll(".status-tab");
/* ================= STATE ================= */
var pendingCancelId = null;
var allBookings = [];
var currentStatus = "WAITING_STAFF";
/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", function () {
    fetchBookings();
    bindTabs();
});
/* ================= FETCH ================= */
function fetchBookings() {
    bookingList.innerHTML =
        "<p class=\"loading\">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14...</p>";
    fetch("/sports_rental_system/staff/api/get_bookings.php", {
        credentials: "include"
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            bookingList.innerHTML =
                "<p class=\"empty\">".concat(res.message || "ไม่พบข้อมูล", "</p>");
            return;
        }
        allBookings = res.bookings || [];
        updateCounts();
        renderList(currentStatus);
    })
        .catch(function () {
        bookingList.innerHTML =
            "<p class=\"empty\">\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08</p>";
    });
}
/* ================= COUNT ================= */
function updateCounts() {
    var counts = {};
    allBookings.forEach(function (b) {
        // 🔥 ถ้าเป็น CANCELLED แต่ REFUNDED แล้ว → ไม่นับ
        if (b.status_code === "CANCELLED" &&
            b.payment_status_code === "REFUNDED") {
            return;
        }
        counts[b.status_code] =
            (counts[b.status_code] || 0) + 1;
    });
    document
        .querySelectorAll("span[id^='count-']")
        .forEach(function (el) {
        var code = el.id.replace("count-", "");
        el.textContent =
            (counts[code] || 0).toString();
    });
}
/* ================= RENDER ================= */
function renderList(status) {
    currentStatus = status;
    var list = allBookings.filter(function (b) { return b.status_code === status; });
    // 🔥 ถ้าเป็นแท็บคำขอยกเลิก ให้ตัด REFUNDED ออก
    if (status === "CANCELLED") {
        list = list.filter(function (b) { return b.payment_status_code !== "REFUNDED"; });
    }
    if (list.length === 0) {
        bookingList.innerHTML =
            "<p class=\"empty\">\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23</p>";
        return;
    }
    var html = "";
    list.forEach(function (b) {
        var badge = "waiting";
        var text = "รออนุมัติ";
        if (status === "CONFIRMED_WAITING_PICKUP") {
            badge = "ready";
            text = "รอรับอุปกรณ์";
        }
        if (status === "CANCELLED") {
            badge = "cancel";
            text = "คำขอยกเลิก";
        }
        html += "\n            <div class=\"booking-card\">\n\n                <div class=\"booking-info\">\n\n                    <span class=\"status ".concat(badge, "\">\n                        ").concat(text, "\n                    </span>\n\n                    <h4>\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07: ").concat(b.booking_id, "</h4>\n\n                    <p>\n                        \u0E25\u0E39\u0E01\u0E04\u0E49\u0E32: ").concat(b.customer_name, "<br>\n                        \u0E23\u0E31\u0E1A: ").concat(b.pickup_time, "<br>\n                        \u0E04\u0E37\u0E19: ").concat(b.due_return_time, "\n                    </p>\n\n                    <p>\n                        <strong>").concat(b.net_amount, " \u0E1A\u0E32\u0E17</strong>\n                    </p>\n\n                </div>\n\n                <div class=\"booking-actions\">\n\n                    <a class=\"btn-outline\"\n                        href=\"booking-detail.html?code=").concat(b.booking_id, "\">\n                        \u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\n                    </a>\n\n                    ").concat(status === "WAITING_STAFF" ? "\n                        <button class=\"btn-approve\"\n                            data-id=\"".concat(b.booking_id, "\">\n                            \u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\n                        </button>\n\n                        <button class=\"btn-cancel\"\n                            data-id=\"").concat(b.booking_id, "\">\n                            \u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\n                        </button>\n                    ") : "", "\n\n                    ").concat(status === "CONFIRMED_WAITING_PICKUP" ? "\n                        <a href=\"receive-equipment.html?code=".concat(b.booking_id, "\"\n                           class=\"btn-approve\">\n                            \u0E01\u0E23\u0E2D\u0E01\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\n                        </a>\n                    ") : "", "\n\n                    ").concat(status === "CANCELLED" ? "\n                        <button class=\"btn-refund\"\n                            data-id=\"".concat(b.booking_id, "\">\n                            \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E04\u0E37\u0E19\u0E40\u0E07\u0E34\u0E19\n                        </button>\n                    ") : "", "\n\n                </div>\n\n            </div>\n        ");
    });
    bookingList.innerHTML = html;
    bindActionButtons();
}
/* ================= ACTION BUTTONS ================= */
function bindActionButtons() {
    document.querySelectorAll(".btn-approve")
        .forEach(function (btn) {
        btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            if (!id)
                return;
            if (!confirm("ยืนยันอนุมัติการจองนี้?"))
                return;
            approveBooking(id);
        });
    });
    document.querySelectorAll(".btn-cancel")
        .forEach(function (btn) {
        btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            if (!id)
                return;
            pendingCancelId = id;
            openCancelModal();
        });
    });
    document.querySelectorAll(".btn-refund")
        .forEach(function (btn) {
        btn.addEventListener("click", function () {
            var id = btn.dataset.id;
            if (!id)
                return;
            window.location.href =
                "refund-payment.html?code=".concat(id);
        });
    });
}
/* ================= APPROVE ================= */
function approveBooking(id) {
    fetch("/sports_rental_system/staff/api/approve_booking.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: "include",
        body: "booking_id=".concat(encodeURIComponent(id))
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            alert(res.message || "อนุมัติไม่สำเร็จ");
            return;
        }
        fetchBookings();
    })
        .catch(function () { return alert("เชื่อมต่อไม่ได้"); });
}
/* ================= CANCEL ================= */
function cancelBooking(id, reason) {
    fetch("/sports_rental_system/staff/api/cancel_booking.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            booking_id: id,
            reason: reason
        })
    })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            alert(res.message || "ยกเลิกไม่สำเร็จ");
            return;
        }
        fetchBookings();
    })
        .catch(function () { return alert("เชื่อมต่อไม่ได้"); });
}
/* ================= TABS ================= */
function bindTabs() {
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) {
                return t.classList.remove("active");
            });
            tab.classList.add("active");
            var status = tab.dataset.status;
            if (status) {
                renderList(status);
            }
        });
    });
}
/* ================= CANCEL MODAL ================= */
var cancelModal = document.getElementById("cancelModal");
var cancelReasonInput = document.getElementById("cancelReasonInput");
var cancelModalClose = document.getElementById("cancelModalClose");
var cancelModalConfirm = document.getElementById("cancelModalConfirm");
function openCancelModal() {
    cancelReasonInput.value = "";
    cancelModal.classList.remove("hidden");
    cancelReasonInput.focus();
}
function closeCancelModal() {
    cancelModal.classList.add("hidden");
    pendingCancelId = null;
}
cancelModalClose.addEventListener("click", closeCancelModal);
cancelModalConfirm.addEventListener("click", function () {
    if (!pendingCancelId)
        return;
    var reason = cancelReasonInput.value.trim();
    if (!reason) {
        alert("กรุณากรอกเหตุผล");
        return;
    }
    cancelBooking(pendingCancelId, reason);
    closeCancelModal();
});
