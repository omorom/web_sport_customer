console.log("🔥 REFUND TS READY 🔥");
var bookingCode = null;
document.addEventListener("DOMContentLoaded", function () {
    var bookingDisplay = document.getElementById("bookingCode");
    var refundAmountInput = document.getElementById("refundAmount");
    var slipInput = document.getElementById("refundSlip");
    var previewImg = document.getElementById("previewImg");
    var confirmBtn = document.getElementById("confirmRefundBtn");
    if (!bookingDisplay || !refundAmountInput || !slipInput || !previewImg || !confirmBtn) {
        console.error("DOM element missing");
        return;
    }
    /* ================= READ PARAM ================= */
    var params = new URLSearchParams(window.location.search);
    bookingCode = params.get("code");
    if (!bookingCode) {
        alert("ไม่พบรหัส booking");
        window.history.back();
        return;
    }
    bookingDisplay.textContent = bookingCode;
    loadRefundInfo(bookingCode);
    /* ================= PREVIEW SLIP ================= */
    slipInput.addEventListener("change", function () {
        var file = slipInput.files ? slipInput.files[0] : null;
        if (!file)
            return;
        if (file.type.indexOf("image/") !== 0) {
            alert("ต้องเป็นไฟล์รูปภาพเท่านั้น");
            slipInput.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("ไฟล์ใหญ่เกิน 5MB");
            slipInput.value = "";
            return;
        }
        previewImg.src = URL.createObjectURL(file);
        previewImg.hidden = false;
    });
    /* ================= SUBMIT ================= */
    confirmBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (!bookingCode)
            return;
        var amount = parseFloat(refundAmountInput.value);
        var file = slipInput.files ? slipInput.files[0] : null;
        if (!amount || amount <= 0) {
            alert("กรอกจำนวนเงินคืนให้ถูกต้อง");
            return;
        }
        if (!file) {
            alert("กรุณาแนบสลิปคืนเงิน");
            return;
        }
        confirmBtn.disabled = true;
        confirmBtn.textContent = "กำลังบันทึก...";
        var formData = new FormData();
        formData.append("booking_code", bookingCode);
        formData.append("refund_amount", amount.toString());
        formData.append("slip", file);
        fetch("/sports_rental_system/staff/api/process_refund.php", {
            method: "POST",
            body: formData,
            credentials: "include"
        })
            .then(function (r) { return r.json(); })
            .then(function (res) {
            if (!res.success) {
                alert(res.message || "เกิดข้อผิดพลาด");
                confirmBtn.disabled = false;
                confirmBtn.textContent = "บันทึกการคืนเงิน";
                return;
            }
            alert("คืนเงินสำเร็จ");
            window.location.href = "bookings.html";
        })
            .catch(function () {
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
            confirmBtn.disabled = false;
            confirmBtn.textContent = "บันทึกการคืนเงิน";
        });
    });
});
/* ================= LOAD INFO ================= */
function loadRefundInfo(code) {
    fetch("/sports_rental_system/staff/api/get_refund_info.php?code=" + code, { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (res) {
        if (!res.success) {
            alert("โหลดข้อมูลไม่สำเร็จ");
            return;
        }
        document.getElementById("customerName")
            .textContent = res.customer_name;
        document.getElementById("paidAmount")
            .textContent = res.paid_amount;
        document.getElementById("cancelReason")
            .textContent = res.cancellation_reason || "-";
        document.getElementById("bankName")
            .textContent = res.bank_name || "-";
        document.getElementById("accountName")
            .textContent = res.account_name || "-";
        document.getElementById("accountNumber")
            .textContent = res.account_number || "-";
        var refundInput = document.getElementById("refundAmount");
        refundInput.value = res.paid_amount;
    })
        .catch(function () {
        alert("โหลดข้อมูลไม่สำเร็จ");
    });
}
