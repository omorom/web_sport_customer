console.log("🔥 REFUND TS READY 🔥");

let bookingCode: string | null = null;

document.addEventListener("DOMContentLoaded", function () {

  const bookingDisplay =
    document.getElementById("bookingCode") as HTMLElement;

  const refundAmountInput =
    document.getElementById("refundAmount") as HTMLInputElement;

  const slipInput =
    document.getElementById("refundSlip") as HTMLInputElement;

  const previewImg =
    document.getElementById("previewImg") as HTMLImageElement;

  const confirmBtn =
    document.getElementById("confirmRefundBtn") as HTMLButtonElement;

  if (!bookingDisplay || !refundAmountInput || !slipInput || !previewImg || !confirmBtn) {
    console.error("DOM element missing");
    return;
  }

  /* ================= READ PARAM ================= */

  const params = new URLSearchParams(window.location.search);
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

    const file = slipInput.files ? slipInput.files[0] : null;
    if (!file) return;

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

    if (!bookingCode) return;

    const amount = parseFloat(refundAmountInput.value);
    const file = slipInput.files ? slipInput.files[0] : null;

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

    const formData = new FormData();
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

function loadRefundInfo(code: string): void {

  fetch(
    "/sports_rental_system/staff/api/get_refund_info.php?code=" + code,
    { credentials: "include" }
  )
  .then(function (r) { return r.json(); })
  .then(function (res) {

    if (!res.success) {
      alert("โหลดข้อมูลไม่สำเร็จ");
      return;
    }

    (document.getElementById("customerName") as HTMLElement)
      .textContent = res.customer_name;

    (document.getElementById("paidAmount") as HTMLElement)
      .textContent = res.paid_amount;

    (document.getElementById("cancelReason") as HTMLElement)
      .textContent = res.cancellation_reason || "-";

    (document.getElementById("bankName") as HTMLElement)
      .textContent = res.bank_name || "-";

    (document.getElementById("accountName") as HTMLElement)
      .textContent = res.account_name || "-";

    (document.getElementById("accountNumber") as HTMLElement)
      .textContent = res.account_number || "-";

    const refundInput =
      document.getElementById("refundAmount") as HTMLInputElement;

    refundInput.value = res.paid_amount;
  })
  .catch(function () {
    alert("โหลดข้อมูลไม่สำเร็จ");
  });
}
