console.log("🔥 STAFF QR PAYMENT READY 🔥");
var bookingCode = null;
document.addEventListener("DOMContentLoaded", function () {
    var codeEl = document.getElementById("bookingCode");
    var payEl = document.getElementById("payAmount");
    var confirmBtn = document.getElementById("confirmPayBtn");
    var params = new URLSearchParams(window.location.search);
    bookingCode = params.get("code");
    if (!bookingCode) {
        alert("ไม่พบ booking code");
        window.location.href = "bookings.html";
        return;
    }
    if (codeEl)
        codeEl.textContent = bookingCode;
    loadPaymentInfo(bookingCode, payEl);
    confirmBtn.addEventListener("click", function () {
        var ok = confirm("ยืนยันว่าลูกค้าชำระผ่าน QR เรียบร้อยแล้ว?");
        if (!ok || !bookingCode)
            return;
        confirmBtn.disabled = true;
        confirmBtn.textContent = "กำลังบันทึก...";
        fetch("/sports_rental_system/staff/api/confirm_qr_payment.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                booking_code: bookingCode
            })
        })
            .then(function (r) { return r.json(); })
            .then(function (res) {
            if (!res.success) {
                alert(res.message || "บันทึกไม่สำเร็จ");
                confirmBtn.disabled = false;
                confirmBtn.textContent =
                    "ยืนยันรับชำระแล้ว";
                return;
            }
            alert("รับชำระเงินเรียบร้อย");
            window.location.href =
                "bookings.html";
        })
            .catch(function (err) {
            console.error(err);
            alert("❌ เซิร์ฟเวอร์ผิดพลาด");
            confirmBtn.disabled = false;
            confirmBtn.textContent =
                "ยืนยันรับชำระแล้ว";
        });
    });
});
function loadPaymentInfo(code, payEl) {
    fetch("/sports_rental_system/staff/api/get_payment_info.php?code=" + code, { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
        if (!data.success) {
            alert(data.message);
            return;
        }
        if (payEl) {
            payEl.textContent =
                data.amount + " บาท";
        }
    });
}
