console.log("🔥 STAFF BOOKINGS TS READY 🔥");

interface Booking {
    booking_id: string;
    pickup_time: string;
    due_return_time: string;
    net_amount: number;
    status_code: string;
    payment_status_code: string; // 👈 ใช้กรอง refund
    customer_name: string;
}

/* ================= DOM ================= */

const bookingList =
    document.getElementById("bookingList") as HTMLElement;

const tabs =
    document.querySelectorAll(".status-tab") as NodeListOf<HTMLButtonElement>;

/* ================= STATE ================= */

let pendingCancelId: string | null = null;
let allBookings: Booking[] = [];
let currentStatus = "WAITING_STAFF";

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    fetchBookings();
    bindTabs();
});

/* ================= FETCH ================= */

function fetchBookings(): void {

    bookingList.innerHTML =
        `<p class="loading">กำลังโหลด...</p>`;

    fetch("/sports_rental_system/staff/api/get_bookings.php", {
        credentials: "include"
    })
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                bookingList.innerHTML =
                    `<p class="empty">${res.message || "ไม่พบข้อมูล"}</p>`;
                return;
            }

            allBookings = res.bookings || [];

            updateCounts();
            renderList(currentStatus);
        })
        .catch(() => {
            bookingList.innerHTML =
                `<p class="empty">โหลดข้อมูลไม่สำเร็จ</p>`;
        });
}

/* ================= COUNT ================= */

function updateCounts(): void {

    const counts: any = {};

    allBookings.forEach(b => {

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
        .forEach(el => {

            const code =
                el.id.replace("count-", "");

            el.textContent =
                (counts[code] || 0).toString();
        });
}

/* ================= RENDER ================= */

function renderList(status: string): void {

    currentStatus = status;

    let list = allBookings.filter(
        b => b.status_code === status
    );

    // 🔥 ถ้าเป็นแท็บคำขอยกเลิก ให้ตัด REFUNDED ออก
    if (status === "CANCELLED") {
        list = list.filter(
            b => b.payment_status_code !== "REFUNDED"
        );
    }

    if (list.length === 0) {
        bookingList.innerHTML =
            `<p class="empty">ไม่มีรายการ</p>`;
        return;
    }

    let html = "";

    list.forEach(b => {

        let badge = "waiting";
        let text = "รออนุมัติ";

        if (status === "CONFIRMED_WAITING_PICKUP") {
            badge = "ready";
            text = "รอรับอุปกรณ์";
        }

        if (status === "CANCELLED") {
            badge = "cancel";
            text = "คำขอยกเลิก";
        }

        html += `
            <div class="booking-card">

                <div class="booking-info">

                    <span class="status ${badge}">
                        ${text}
                    </span>

                    <h4>รหัสการจอง: ${b.booking_id}</h4>

                    <p>
                        ลูกค้า: ${b.customer_name}<br>
                        รับ: ${b.pickup_time}<br>
                        คืน: ${b.due_return_time}
                    </p>

                    <p>
                        <strong>${b.net_amount} บาท</strong>
                    </p>

                </div>

                <div class="booking-actions">

                    <a class="btn-outline"
                        href="booking-detail.html?code=${b.booking_id}">
                        ดูรายละเอียด
                    </a>

                    ${status === "WAITING_STAFF" ? `
                        <button class="btn-approve"
                            data-id="${b.booking_id}">
                            อนุมัติ
                        </button>

                        <button class="btn-cancel"
                            data-id="${b.booking_id}">
                            ยกเลิก
                        </button>
                    ` : ""}

                    ${status === "CONFIRMED_WAITING_PICKUP" ? `
                        <a href="receive-equipment.html?code=${b.booking_id}"
                           class="btn-approve">
                            กรอกอุปกรณ์
                        </a>
                    ` : ""}

                    ${status === "CANCELLED" ? `
                        <button class="btn-refund"
                            data-id="${b.booking_id}">
                            ยืนยันการคืนเงิน
                        </button>
                    ` : ""}

                </div>

            </div>
        `;
    });

    bookingList.innerHTML = html;

    bindActionButtons();
}

/* ================= ACTION BUTTONS ================= */

function bindActionButtons(): void {

    document.querySelectorAll(".btn-approve")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const id =
                    (btn as HTMLElement).dataset.id;

                if (!id) return;

                if (!confirm("ยืนยันอนุมัติการจองนี้?")) return;

                approveBooking(id);
            });
        });

    document.querySelectorAll(".btn-cancel")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const id =
                    (btn as HTMLElement).dataset.id;

                if (!id) return;

                pendingCancelId = id;
                openCancelModal();
            });
        });

    document.querySelectorAll(".btn-refund")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                const id =
                    (btn as HTMLElement).dataset.id;

                if (!id) return;

                window.location.href =
                    `refund-payment.html?code=${id}`;
            });
        });
}

/* ================= APPROVE ================= */

function approveBooking(id: string): void {

    fetch("/sports_rental_system/staff/api/approve_booking.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: "include",
        body: `booking_id=${encodeURIComponent(id)}`
    })
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                alert(res.message || "อนุมัติไม่สำเร็จ");
                return;
            }

            fetchBookings();
        })
        .catch(() => alert("เชื่อมต่อไม่ได้"));
}

/* ================= CANCEL ================= */

function cancelBooking(id: string, reason: string): void {

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
        .then(r => r.json())
        .then(res => {

            if (!res.success) {
                alert(res.message || "ยกเลิกไม่สำเร็จ");
                return;
            }

            fetchBookings();
        })
        .catch(() => alert("เชื่อมต่อไม่ได้"));
}

/* ================= TABS ================= */

function bindTabs(): void {

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            tabs.forEach(t =>
                t.classList.remove("active")
            );

            tab.classList.add("active");

            const status =
                tab.dataset.status;

            if (status) {
                renderList(status);
            }
        });
    });
}

/* ================= CANCEL MODAL ================= */

const cancelModal =
    document.getElementById("cancelModal") as HTMLElement;

const cancelReasonInput =
    document.getElementById("cancelReasonInput") as HTMLTextAreaElement;

const cancelModalClose =
    document.getElementById("cancelModalClose") as HTMLButtonElement;

const cancelModalConfirm =
    document.getElementById("cancelModalConfirm") as HTMLButtonElement;

function openCancelModal(): void {
    cancelReasonInput.value = "";
    cancelModal.classList.remove("hidden");
    cancelReasonInput.focus();
}

function closeCancelModal(): void {
    cancelModal.classList.add("hidden");
    pendingCancelId = null;
}

cancelModalClose.addEventListener("click", closeCancelModal);

cancelModalConfirm.addEventListener("click", () => {

    if (!pendingCancelId) return;

    const reason =
        cancelReasonInput.value.trim();

    if (!reason) {
        alert("กรุณากรอกเหตุผล");
        return;
    }

    cancelBooking(pendingCancelId, reason);
    closeCancelModal();
});
