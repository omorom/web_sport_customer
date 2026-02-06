console.log("🔥 PAYMENT TS READY 🔥");

let countdownSeconds = 10 * 60;
let timerInterval: number;

let bookingCode: string | null = null;

// ===============================
// INIT AFTER DOM READY
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const countdownEl = document.getElementById("countdown") as HTMLElement;
    const payAmountEl = document.getElementById("payAmount") as HTMLElement;
    const bookingCodeEl = document.getElementById("bookingCode") as HTMLElement;
    const qrImg = document.getElementById("qrImg") as HTMLImageElement;

    const slipInput = document.getElementById("slipInput") as HTMLInputElement;
    const previewImg = document.getElementById("previewImg") as HTMLImageElement;

    const confirmBtn =
        document.getElementById("confirmPayBtn") as HTMLButtonElement;

    // ===============================
    // READ PARAM
    // ===============================

    const params = new URLSearchParams(window.location.search);
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

        const file =
            slipInput.files ? slipInput.files[0] : null;

        if (!file) return;

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

        if (!bookingCode) return;

        const file =
            slipInput.files ? slipInput.files[0] : null;

        if (!file) {
            alert("กรุณาแนบสลิปก่อน");
            return;
        }

        confirmBtn.disabled = true;
        confirmBtn.textContent = "กำลังอัปโหลด...";

        const formData = new FormData();
        formData.append("slip", file);
        formData.append("booking_code", bookingCode);

        console.log("📤 uploading slip...");
        console.log("booking_code:", bookingCode);
        console.log("file:", file);

        fetch(
            "/sports_rental_system/api/upload_payment_slip.php",
            {
                method: "POST",
                body: formData,
                credentials: "include"
            }
        )
            .then(res => res.json())
            .then(data => {

                console.log("📥 upload response:", data);

                if (!data.success) {

                    alert(data.message || "เกิดข้อผิดพลาด");

                    confirmBtn.disabled = false;
                    confirmBtn.textContent =
                        "ยืนยันการชำระเงิน";
                    return;
                }

                alert("✅ ส่งสลิปเรียบร้อย รอตรวจสอบ");

                window.location.href = "my-bookings.html";

            })
            .catch(err => {

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

    fetch("/sports_rental_system/api/get_profile.php")
        .then(res => res.json())
        .then(data => {

            const pointEl =
                document.getElementById("topPoints");

            if (pointEl && data.points !== undefined) {
                pointEl.textContent =
                    `⭐ ${data.points} คะแนน`;
            }

        })
        .catch(err => {
            console.error("profile error:", err);
        });

}

// ===============================
// LOAD PAYMENT DATA
// ===============================

function loadPaymentInfo(
    code: string,
    payAmountEl: HTMLElement,
    qrImg: HTMLImageElement
) {

    fetch(
        "/sports_rental_system/api/get_payment_info.php?code=" + code,
        { credentials: "include" }
    )
        .then(res => res.json())
        .then(data => {

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
        .catch(err => {

            console.error(err);
            alert("โหลดข้อมูลชำระเงินไม่สำเร็จ");

        });
}

// ===============================
// COUNTDOWN
// ===============================

function startCountdown(
    countdownEl: HTMLElement,
    confirmBtn: HTMLButtonElement,
    qrImg: HTMLImageElement
) {

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

function updateCountdown(el: HTMLElement) {

    const min = Math.floor(countdownSeconds / 60);
    const sec = countdownSeconds % 60;

    el.textContent = pad(min) + ":" + pad(sec);

    if (countdownSeconds <= 120) {
        el.style.color = "#dc2626";
    }
}

function onTimeout(
    confirmBtn: HTMLButtonElement,
    qrImg: HTMLImageElement
) {

    confirmBtn.disabled = true;
    confirmBtn.textContent = "หมดเวลาชำระเงิน";

    qrImg.style.opacity = "0.4";

    alert("⏰ หมดเวลาชำระเงิน กรุณาทำรายการใหม่");
}

// ===============================
// UTILS
// ===============================

function pad(n: number): string {
    return n < 10 ? "0" + n : n.toString();
}
