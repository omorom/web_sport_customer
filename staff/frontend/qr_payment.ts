console.log("🔥 STAFF QR PAYMENT READY 🔥");

let bookingCode: string | null = null;

document.addEventListener("DOMContentLoaded", () => {

    const codeEl =
        document.getElementById("bookingCode");

    const payEl =
        document.getElementById("payAmount");

    const confirmBtn =
        document.getElementById("confirmPayBtn") as HTMLButtonElement;

    const params =
        new URLSearchParams(window.location.search);

    bookingCode = params.get("code");

    if (!bookingCode) {
        alert("ไม่พบ booking code");
        window.location.href = "bookings.html";
        return;
    }

    if (codeEl) codeEl.textContent = bookingCode;

    loadPaymentInfo(bookingCode, payEl);

    confirmBtn.addEventListener("click", () => {

        const ok =
            confirm("ยืนยันว่าลูกค้าชำระผ่าน QR เรียบร้อยแล้ว?");

        if (!ok || !bookingCode) return;

        confirmBtn.disabled = true;
        confirmBtn.textContent = "กำลังบันทึก...";

        fetch(
            "/sports_rental_system/staff/api/confirm_qr_payment.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    booking_code: bookingCode
                })
            }
        )
            .then(r => r.json())
            .then(res => {

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
            .catch(err => {

                console.error(err);

                alert("❌ เซิร์ฟเวอร์ผิดพลาด");

                confirmBtn.disabled = false;
                confirmBtn.textContent =
                    "ยืนยันรับชำระแล้ว";
            });
    });

});


function loadPaymentInfo(
    code: string,
    payEl: HTMLElement | null
) {

    fetch(
        "/sports_rental_system/staff/api/get_payment_info.php?code=" + code,
        { credentials: "include" }
    )
        .then(r => r.json())
        .then(data => {

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
