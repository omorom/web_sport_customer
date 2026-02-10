console.log("🔥 STAFF BOOKING DETAIL READY 🔥");

/* ================= TYPES ================= */

interface BookingDetailResponse {
    success: boolean;
    message?: string;
    data?: BookingDetail;
}

interface BookingDetail {
    booking_id: string;
    pickup_time: string;
    due_return_time: string;
    net_amount: number;

    booking_status: string;
    payment_status: string;

    customer: {
        name: string;
        phone: string;
        email: string;
    };

    items: BookingItem[];

    payment: PaymentInfo | null;
}

interface BookingItem {
    item_type: "Equipment" | "Venue";
    quantity: number;
    price_at_booking: number;

    equipment_name?: string;
    venue_name?: string;

    equipment_image?: string | null;
    venue_image?: string | null;
}

interface PaymentInfo {
    status: string;
    amount: number;
    paid_at: string | null;
    slip_url: string | null;
    refund_amount?: number | null;
    refund_at?: string | null;
    slip_refund?: string | null;
}

/* ================= DOM ================= */

const detailBox =
    document.getElementById("detailBox") as HTMLElement;

/* ================= PARAM ================= */

const params = new URLSearchParams(window.location.search);
const bookingCode = params.get("code");

if (!bookingCode) {
    detailBox.innerHTML =
        `<p class="error">ไม่พบรหัสการจอง</p>`;
} else {
    loadBookingDetail(bookingCode);
}

/* ================= STATUS MAP ================= */

function mapBookingStatus(code: string): string {

    const map: Record<string, string> = {
        WAITING_STAFF: "รอเจ้าหน้าที่อนุมัติ",
        CONFIRMED_WAITING_PICKUP: "อนุมัติแล้ว (รอรับอุปกรณ์)",
        IN_USE: "กำลังใช้งาน",
        CANCELLED: "ยกเลิกแล้ว"
    };

    return map[code] || code;
}

function mapPaymentStatus(code: string): string {

    const map: Record<string, string> = {
        WAITING_VERIFY: "รอตรวจสอบสลิป",
        PAID: "ชำระแล้ว",
        REFUNDED: "คืนเงินแล้ว",
        CANCELLED: "ยกเลิก"
    };

    return map[code] || code;
}

/* ================= FETCH ================= */

function loadBookingDetail(code: string): void {

    fetch(
        `/sports_rental_system/staff/api/get_booking_detail.php?code=${encodeURIComponent(code)}`,
        { credentials: "include" }
    )
        .then(res => res.json())
        .then((res: BookingDetailResponse) => {

            if (!res.success || !res.data) {
                detailBox.innerHTML =
                    `<p class="error">${res.message || "โหลดไม่สำเร็จ"}</p>`;
                return;
            }

            renderDetail(res.data);
        })
        .catch(err => {

            console.error(err);

            detailBox.innerHTML =
                `<p class="error">เชื่อมต่อไม่ได้</p>`;
        });
}

/* ================= RENDER ================= */

function renderDetail(data: BookingDetail): void {

    let html = `

        <section class="detail-section">

            <h3>ข้อมูลการจอง</h3>

            <p><b>รหัส:</b> ${data.booking_id}</p>

            <p>
                <b>สถานะจอง:</b>
                <span class="badge booking ${data.booking_status}">
                    ${mapBookingStatus(data.booking_status)}
                </span>
            </p>

            <p>
                <b>สถานะการชำระเงิน:</b>
                <span class="badge payment ${data.payment_status}">
                    ${mapPaymentStatus(data.payment_status)}
                </span>
            </p>

            <p><b>รับ:</b> ${data.pickup_time}</p>
            <p><b>คืน:</b> ${data.due_return_time}</p>
            <p><b>รวม:</b> ${data.net_amount} บาท</p>

        </section>

        <section class="detail-section">

            <h3>ข้อมูลลูกค้า</h3>

            <p>${data.customer.name}</p>
            <p>${data.customer.phone}</p>
            <p>${data.customer.email}</p>

        </section>

        <section class="detail-section">

            <h3>รายการที่จอง</h3>

            <div class="items-grid">
    `;

    /* ===== ITEMS ===== */

    data.items.forEach(i => {

        const name =
            i.item_type === "Equipment"
                ? i.equipment_name || "-"
                : i.venue_name || "-";

        const rawImg =
            i.item_type === "Equipment"
                ? i.equipment_image
                : i.venue_image;

        const imageUrl =
            rawImg && rawImg.startsWith("http")
                ? rawImg
                : rawImg
                    ? "/sports_rental_system/" + rawImg
                    : null;

        html += `
            <div class="item-card">

                ${
                    imageUrl
                        ? `<img src="${imageUrl}" class="item-img">`
                        : `<div class="no-img">ไม่มีรูป</div>`
                }

                <div class="item-info">
                    <strong>${name}</strong>
                    <span>จำนวน: ${i.quantity}</span>
                    <span>ราคา: ${i.price_at_booking} บาท</span>
                </div>

            </div>
        `;
    });

    html += `
            </div>
        </section>
    `;

    /* ===== PAYMENT ===== */

    if (data.payment) {

        const rawSlip = data.payment.slip_url;

        const slipUrl =
            rawSlip && rawSlip.startsWith("http")
                ? rawSlip
                : rawSlip
                    ? "/sports_rental_system/" + rawSlip
                    : null;

        html += `

            <section class="detail-section">

                <h3>การชำระเงิน</h3>

                <p><b>สถานะ:</b> ${mapPaymentStatus(data.payment.status)}</p>
                <p><b>จำนวน:</b> ${data.payment.amount} บาท</p>
                <p><b>เวลาที่จ่าย:</b> ${data.payment.paid_at || "-"}</p>

                ${
                    slipUrl
                        ? `<img
                                src="${slipUrl}"
                                class="slip-preview"
                                alt="Slip"
                           />`
                        : `<p class="no-slip">ไม่มี slip</p>`
                }

            </section>
        `;
    }

    detailBox.innerHTML = html;
}
