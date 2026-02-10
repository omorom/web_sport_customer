console.log("🔥 STAFF BOOKING DETAIL READY 🔥");
/* ================= DOM ================= */
var detailBox = document.getElementById("detailBox");
/* ================= PARAM ================= */
var params = new URLSearchParams(window.location.search);
var bookingCode = params.get("code");
if (!bookingCode) {
    detailBox.innerHTML =
        "<p class=\"error\">\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07</p>";
}
else {
    loadBookingDetail(bookingCode);
}
/* ================= STATUS MAP ================= */
function mapBookingStatus(code) {
    var map = {
        WAITING_STAFF: "รอเจ้าหน้าที่อนุมัติ",
        CONFIRMED_WAITING_PICKUP: "อนุมัติแล้ว (รอรับอุปกรณ์)",
        IN_USE: "กำลังใช้งาน",
        CANCELLED: "ยกเลิกแล้ว"
    };
    return map[code] || code;
}
function mapPaymentStatus(code) {
    var map = {
        WAITING_VERIFY: "รอตรวจสอบสลิป",
        PAID: "ชำระแล้ว",
        REFUNDED: "คืนเงินแล้ว",
        CANCELLED: "ยกเลิก"
    };
    return map[code] || code;
}
/* ================= FETCH ================= */
function loadBookingDetail(code) {
    fetch("/sports_rental_system/staff/api/get_booking_detail.php?code=".concat(encodeURIComponent(code)), { credentials: "include" })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if (!res.success || !res.data) {
            detailBox.innerHTML =
                "<p class=\"error\">".concat(res.message || "โหลดไม่สำเร็จ", "</p>");
            return;
        }
        renderDetail(res.data);
    })
        .catch(function (err) {
        console.error(err);
        detailBox.innerHTML =
            "<p class=\"error\">\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E21\u0E15\u0E48\u0E2D\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49</p>";
    });
}
/* ================= RENDER ================= */
function renderDetail(data) {
    var html = "\n\n        <section class=\"detail-section\">\n\n            <h3>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E08\u0E2D\u0E07</h3>\n\n            <p><b>\u0E23\u0E2B\u0E31\u0E2A:</b> ".concat(data.booking_id, "</p>\n\n            <p>\n                <b>\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E08\u0E2D\u0E07:</b>\n                <span class=\"badge booking ").concat(data.booking_status, "\">\n                    ").concat(mapBookingStatus(data.booking_status), "\n                </span>\n            </p>\n\n            <p>\n                <b>\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19:</b>\n                <span class=\"badge payment ").concat(data.payment_status, "\">\n                    ").concat(mapPaymentStatus(data.payment_status), "\n                </span>\n            </p>\n\n            <p><b>\u0E23\u0E31\u0E1A:</b> ").concat(data.pickup_time, "</p>\n            <p><b>\u0E04\u0E37\u0E19:</b> ").concat(data.due_return_time, "</p>\n            <p><b>\u0E23\u0E27\u0E21:</b> ").concat(data.net_amount, " \u0E1A\u0E32\u0E17</p>\n\n        </section>\n\n        <section class=\"detail-section\">\n\n            <h3>\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32</h3>\n\n            <p>").concat(data.customer.name, "</p>\n            <p>").concat(data.customer.phone, "</p>\n            <p>").concat(data.customer.email, "</p>\n\n        </section>\n\n        <section class=\"detail-section\">\n\n            <h3>\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E08\u0E2D\u0E07</h3>\n\n            <div class=\"items-grid\">\n    ");
    /* ===== ITEMS ===== */
    data.items.forEach(function (i) {
        var name = i.item_type === "Equipment"
            ? i.equipment_name || "-"
            : i.venue_name || "-";
        var rawImg = i.item_type === "Equipment"
            ? i.equipment_image
            : i.venue_image;
        var imageUrl = rawImg && rawImg.startsWith("http")
            ? rawImg
            : rawImg
                ? "/sports_rental_system/" + rawImg
                : null;
        html += "\n            <div class=\"item-card\">\n\n                ".concat(imageUrl
            ? "<img src=\"".concat(imageUrl, "\" class=\"item-img\">")
            : "<div class=\"no-img\">\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E39\u0E1B</div>", "\n\n                <div class=\"item-info\">\n                    <strong>").concat(name, "</strong>\n                    <span>\u0E08\u0E33\u0E19\u0E27\u0E19: ").concat(i.quantity, "</span>\n                    <span>\u0E23\u0E32\u0E04\u0E32: ").concat(i.price_at_booking, " \u0E1A\u0E32\u0E17</span>\n                </div>\n\n            </div>\n        ");
    });
    html += "\n            </div>\n        </section>\n    ";
    /* ===== PAYMENT ===== */
    if (data.payment) {
        var rawSlip = data.payment.slip_url;
        var slipUrl = rawSlip && rawSlip.startsWith("http")
            ? rawSlip
            : rawSlip
                ? "/sports_rental_system/" + rawSlip
                : null;
        html += "\n\n            <section class=\"detail-section\">\n\n                <h3>\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19</h3>\n\n                <p><b>\u0E2A\u0E16\u0E32\u0E19\u0E30:</b> ".concat(mapPaymentStatus(data.payment.status), "</p>\n                <p><b>\u0E08\u0E33\u0E19\u0E27\u0E19:</b> ").concat(data.payment.amount, " \u0E1A\u0E32\u0E17</p>\n                <p><b>\u0E40\u0E27\u0E25\u0E32\u0E17\u0E35\u0E48\u0E08\u0E48\u0E32\u0E22:</b> ").concat(data.payment.paid_at || "-", "</p>\n\n                ").concat(slipUrl
            ? "<img\n                                src=\"".concat(slipUrl, "\"\n                                class=\"slip-preview\"\n                                alt=\"Slip\"\n                           />")
            : "<p class=\"no-slip\">\u0E44\u0E21\u0E48\u0E21\u0E35 slip</p>", "\n\n            </section>\n        ");
    }
    detailBox.innerHTML = html;
}
