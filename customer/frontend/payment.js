console.log("🔥 PAYMENT TS READY 🔥");
var countdownSeconds = 10 * 60;
var timerInterval;
var bookingCode = null;
// ===============================
// INIT AFTER DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    var countdownEl = document.getElementById("countdown");
    var payAmountEl = document.getElementById("payAmount");
    var bookingCodeEl = document.getElementById("bookingCode");
    var qrImg = document.getElementById("qrImg");
    var slipInput = document.getElementById("slipInput");
    var previewImg = document.getElementById("previewImg");
    var confirmBtn = document.getElementById("confirmPayBtn");
    // ===============================
    // READ PARAM
    // ===============================
    var params = new URLSearchParams(window.location.search);
    bookingCode = params.get("code");
    if (!bookingCode) {
        alert("ไม่พบรหัส booking");
        window.location.href = "my-bookings.html";
        return;
    }
    bookingCodeEl.textContent = bookingCode;
    loadPaymentInfo(bookingCode, payAmountEl, qrImg);
    startCountdown(countdownEl, confirmBtn, qrImg);
    loadProfilePoints();
    // ===============================
    // PREVIEW SLIP
    // ===============================
    slipInput.addEventListener("change", function () {
        var file = slipInput.files ? slipInput.files[0] : null;
        if (!file)
            return;
        if (file.type.indexOf("image/") !== 0) {
            alert("ต้องเป็นไฟล์รูปเท่านั้น");
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
    // ===============================
    // SUBMIT PAYMENT
    // ===============================
    confirmBtn.addEventListener("click", function (e) {
        e.preventDefault(); // 🔥 กัน refresh หน้า
        if (!bookingCode)
            return;
        var file = slipInput.files ? slipInput.files[0] : null;
        if (!file) {
            alert("กรุณาแนบสลิปก่อน");
            return;
        }
        confirmBtn.disabled = true;
        confirmBtn.textContent = "กำลังอัปโหลด...";
        var formData = new FormData();
        formData.append("slip", file);
        formData.append("booking_code", bookingCode);
        console.log("📤 uploading slip...");
        console.log("booking_code:", bookingCode);
        console.log("file:", file);
        fetch("/sports_rental_system/customer/api/upload_payment_slip.php", {
            method: "POST",
            body: formData,
            credentials: "include"
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            console.log("📥 upload response:", data);
            if (!data.success) {
                alert(data.message || "เกิดข้อผิดพลาด");
                confirmBtn.disabled = false;
                confirmBtn.textContent =
                    "ยืนยันการชำระเงิน";
                return;
            }
            alert("ส่งสลิปเรียบร้อย รอตรวจสอบ");
            window.location.href = "my-bookings.html";
        })
            .catch(function (err) {
            console.error("❌ upload error:", err);
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
            confirmBtn.disabled = false;
            confirmBtn.textContent =
                "ยืนยันการชำระเงิน";
        });
    });
});
// ===============================
// LOAD PROFILE POINTS
// ===============================
function loadProfilePoints() {
    fetch("/sports_rental_system/customer/api/get_profile.php")
        .then(function (res) { return res.json(); })
        .then(function (data) {
        var pointEl = document.getElementById("topPoints");
        if (pointEl && data.points !== undefined) {
            pointEl.textContent =
                "\u2B50 ".concat(data.points, " \u0E04\u0E30\u0E41\u0E19\u0E19");
        }
    })
        .catch(function (err) {
        console.error("profile error:", err);
    });
}
// ===============================
// LOAD PAYMENT DATA
// ===============================
function loadPaymentInfo(code, payAmountEl, qrImg) {
    fetch("/sports_rental_system/customer/api/get_payment_info.php?code=" + code, { credentials: "include" })
        .then(function (res) { return res.json(); })
        .then(function (data) {
        console.log("💰 payment info:", data);
        if (!data.success) {
            alert(data.message || "โหลดข้อมูลไม่สำเร็จ");
            return;
        }
        payAmountEl.textContent =
            data.amount + " บาท";
        if (data.qr_url) {
            qrImg.src = data.qr_url;
        }
    })
        .catch(function (err) {
        console.error(err);
        alert("โหลดข้อมูลชำระเงินไม่สำเร็จ");
    });
}
// ===============================
// COUNTDOWN
// ===============================
function startCountdown(countdownEl, confirmBtn, qrImg) {
    updateCountdown(countdownEl);
    timerInterval = window.setInterval(function () {
        countdownSeconds--;
        updateCountdown(countdownEl);
        if (countdownSeconds <= 0) {
            clearInterval(timerInterval);
            onTimeout(confirmBtn, qrImg);
        }
    }, 1000);
}
function updateCountdown(el) {
    var min = Math.floor(countdownSeconds / 60);
    var sec = countdownSeconds % 60;
    el.textContent = pad(min) + ":" + pad(sec);
    if (countdownSeconds <= 120) {
        el.style.color = "#dc2626";
    }
}
function onTimeout(confirmBtn, qrImg) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "หมดเวลาชำระเงิน";
    qrImg.style.opacity = "0.4";
    alert("⏰ หมดเวลาชำระเงิน กรุณาทำรายการใหม่");
}
// ===============================
// UTILS
// ===============================
function pad(n) {
    return n < 10 ? "0" + n : n.toString();
}
